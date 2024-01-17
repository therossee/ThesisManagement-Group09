'use strict';

/* Data Access Object (DAO) module for accessing thesis applications data */

const fs = require('fs');
const path = require('path');
const db = require('../services/db');
const AdvancedDate = require('../models/AdvancedDate');
const UnauthorizedActionError = require("../errors/UnauthorizedActionError");
const {APPLICATION_STATUS} = require("../enums/application");

/**
 * Apply for a thesis proposal and store correctly the file
 *
 * @param {string} proposal_id
 * @param {string} student_id
 * @param {file} file
 * @returns {Promise<string>}
 */
exports.applyForProposal = async (proposal_id, student_id, file) => {
  const currentDate = new AdvancedDate().toISOString();

  //  Check if the proposal belong to the degree of the student
  const checkProposalDegree = `SELECT * FROM proposalCds WHERE proposal_id=? AND cod_degree=(SELECT cod_degree FROM student WHERE id=?)`;
  const proposal_correct = db.prepare(checkProposalDegree).get(proposal_id, student_id);
  if (!proposal_correct) {
    throw new UnauthorizedActionError("The proposal doesn't belong to the student degree");
  }

  // Check if the proposal is active
  const checkProposalActive = `SELECT * FROM thesisProposal P WHERE P.proposal_id=?
                                 AND P.expiration > ? AND P.creation_date < ? AND P.is_deleted = 0 AND is_archived = 0
                                 AND NOT EXISTS (
                                    SELECT 1
                                    FROM thesisApplication A
                                    WHERE A.proposal_id = P.proposal_id
                                    AND A.status = ?
                                )`;

  const proposal_active = db.prepare(checkProposalActive).get(proposal_id, currentDate, currentDate, APPLICATION_STATUS.ACCEPTED);
  if (!proposal_active) {
    throw new UnauthorizedActionError("The proposal is not active");
  }

  // Check if the user has already applied for other proposals
  const checkAlreadyApplied = `SELECT * FROM thesisApplication WHERE student_id=? AND (status=? OR status=?)`;
  const already_applied = db.prepare(checkAlreadyApplied).get(student_id, APPLICATION_STATUS.WAITING_FOR_APPROVAL, APPLICATION_STATUS.ACCEPTED);
  if (already_applied) {
    throw new UnauthorizedActionError("The user has already applied for other proposals");
  }

  const insertApplicationQuery = `
    INSERT INTO thesisApplication (proposal_id, student_id, creation_date)
    VALUES (?, ?, ?); `; // at first, the application has the default status 'waiting for approval'

  let insertedId = null;
  db.transaction(() => {
    try {
      const res = db.prepare(insertApplicationQuery).run(proposal_id, student_id, currentDate);

      if (file) {
        if(file.mimetype !== 'application/pdf'){
          throw new Error("The file must be a PDF");
        }
        const dir = path.join(__dirname, '..', '..', 'uploads', student_id.toString(), res.lastInsertRowid.toString());
        // Use try-catch to handle any errors during file writing
        try {
          const writePath = path.join(dir, file.originalFilename);
          fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(writePath, fs.readFileSync(file.filepath));
        } catch (fileError) {
          console.error('Error writing file:', fileError);

          throw fileError; // Reject the promise with the file error
        }
      }

      insertedId = res.lastInsertRowid;
    } catch (error) {
      console.error('Error inserting application:', error);

      throw error; // Reject the promise with the main error
    }
  })();

  return insertedId;
};

/**
 * Return the list of applications for a given thesis proposal of a given teacher
 *
 * @param {string} proposal_id
 * @param {string} teacherId
 * @returns {Promise<ThesisApplicationWithStudentRow[]>}
 */
exports.listApplicationsForTeacherThesisProposal = async (proposal_id, teacherId) => {
  const currentDate = new AdvancedDate().toISOString();
  const getApplications = `SELECT s.name, s.surname, ta.status, s.id, ta.id AS application_id, ta.creation_date
      FROM thesisApplication ta, thesisProposal tp, student s
      WHERE ta.proposal_id = tp.proposal_id 
        AND s.id = ta.student_id
        AND ta.proposal_id=?
        AND tp.supervisor_id= ? 
        AND ta.creation_date < ?
        AND tp.expiration > ?
        AND tp.creation_date < ?
        AND tp.is_archived = 0
        AND tp.is_deleted = 0;`;

  return db.prepare(getApplications).all(proposal_id, teacherId, currentDate, currentDate, currentDate);
};

/**
 * Return the list of proposal ids for which the student has an active application
 *
 * @param {string} student_id
 * @returns {Promise<{ proposal_id: string; }[]>}
 */
exports.getStudentActiveApplication = async (student_id) => {
  const currentDate = new AdvancedDate().toISOString();
  const query = `SELECT proposal_id FROM thesisApplication WHERE student_id=? AND creation_date < ? AND ( status=? OR status=?)`;

  return db.prepare(query).all(student_id, currentDate, APPLICATION_STATUS.WAITING_FOR_APPROVAL, APPLICATION_STATUS.ACCEPTED);
};

/**
 * Update the status of the application with the given id of the student with the given id
 *
 * @param {string} studentId
 * @param {string} proposalId
 * @param {string} status
 * @returns {Promise<boolean>}
 */
exports.updateApplicationStatus = async (studentId, proposalId, status) => {
  const query = `
      UPDATE thesisApplication
      SET status = ?
      WHERE student_id = ? AND proposal_id = ? AND status = ? AND creation_date < ?
    `;
  const res = db.prepare(query).run(status, studentId, proposalId, APPLICATION_STATUS.WAITING_FOR_APPROVAL, new AdvancedDate().toISOString());

  return res.changes !== 0;
};

/**
 * Cancel all applications waiting for approval for a given proposal except the one of the student
 *
 * @param {string} studentId
 * @param {string} proposalId
 * @return {Promise<ThesisApplicationRow[]>}
 */
exports.cancelOtherApplications = async (studentId, proposalId) => {
  const updateQuery = `
    UPDATE thesisApplication
    SET status = ?
    WHERE student_id <> ?
      AND proposal_id = ?
      AND status = ?
    RETURNING *;
  `;

  return db.prepare(updateQuery).all(APPLICATION_STATUS.CANCELLED, studentId, proposalId, APPLICATION_STATUS.WAITING_FOR_APPROVAL);
};

/**
 * Cancel all applications waiting for approval on expired thesis proposals
 *
 * @return {Promise<ThesisApplicationRow[]>}
 */
exports.cancelWaitingApplicationsOnExpiredThesis = async () => {
  const date = new AdvancedDate();

  const query = `UPDATE thesisApplication
      SET status=?
      WHERE status=? AND proposal_id IN (SELECT proposal_id FROM thesisProposal WHERE expiration < ?)
      RETURNING *;`;

  return db.prepare(query).all(APPLICATION_STATUS.CANCELLED, APPLICATION_STATUS.WAITING_FOR_APPROVAL, date.toISOString());
};

/**
 * Return the list of applications decisions for a given student
 *
 * @param {string} studentId
 * @returns {Promise<ThesisApplicationWithTeacherAndProposalRow[]>}
 */
exports.listApplicationsDecisionsFromStudent = async (studentId) => {
  const getApplications = `SELECT ta.id AS "application_id", ta.proposal_id, tp.title,  tp.level, t.name AS "teacher_name" , t.surname AS "teacher_surname" ,ta.status, tp.expiration
    FROM thesisApplication ta, thesisProposal tp, teacher t
    WHERE ta.proposal_id = tp.proposal_id AND ta.student_id = ? AND t.id = tp.supervisor_id AND ta.creation_date < ?`;

  return db.prepare(getApplications).all(studentId, new AdvancedDate().toISOString());
};

/**
 * Return the application with the given id
 *
 * @param {string} applicationId
 * @returns {Promise<ThesisApplicationRow>}
 */
exports.getApplicationById = async (applicationId) => {
  const query = `SELECT * FROM thesisApplication WHERE id = ?`;

  return db.prepare(query).get(applicationId);
};


/**
 *
 * @typedef {Object} ThesisApplicationWithStudentRow
 *
 * @property {string} id -> student id
 * @property {string} name -> student name
 * @property {string} surname -> student surname
 * @property {string} status -> application status
 * @property {string} application_id -> application id
 * @property {string} creation_date -> application creation date
 */

/**
 * @typedef {Object} ThesisApplicationRow
 *
 * @property {string} id
 * @property {string} proposal_id
 * @property {string} student_id
 * @property {string} creation_date
 * @property {string} status
 */

/**
 * @typedef {Object} ThesisApplicationWithTeacherAndProposalRow
 *
 * @property {string} application_id
 * @property {string} proposal_id
 * @property {string} title
 * @property {string} level
 * @property {string} teacher_name
 * @property {string} teacher_surname
 * @property {string} status
 * @property {string} expiration
 */
