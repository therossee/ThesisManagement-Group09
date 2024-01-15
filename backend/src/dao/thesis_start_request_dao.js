'use strict';

/* Data Access Object (DAO) module for accessing thesis start requests data */

const db = require('../services/db');
const AdvancedDate = require('../models/AdvancedDate');
const UnauthorizedActionError = require("../errors/UnauthorizedActionError");
const {THESIS_START_REQUEST_STATUS} = require("../enums/thesisStartRequest");

/**
 * Create a new thesis start request
 *
 * @param {string} student_id
 * @param {string} application_id
 * @param {string} proposal_id
 * @param {string} title
 * @param {string} description
 * @param {string} supervisor_id
 * @param {string[]} internal_co_supervisors_ids
 * @return {Promise<number>}
 */
exports.createThesisStartRequest = async (student_id, title, description, supervisor_id, internal_co_supervisors_ids, application_id, proposal_id) => {
  const creation_date = new AdvancedDate().toISOString();

  // check if the student has already a thesis start request
  const checkAlreadyRequest = `SELECT * FROM thesisStartRequest WHERE student_id=? AND (status=? OR status=? OR status=? OR status=?)`;
  const already_request = db.prepare(checkAlreadyRequest).get(student_id, THESIS_START_REQUEST_STATUS.WAITING_FOR_APPROVAL, THESIS_START_REQUEST_STATUS.ACCEPTED_BY_SECRETARY, THESIS_START_REQUEST_STATUS.ACCEPTED_BY_TEACHER, THESIS_START_REQUEST_STATUS.CHANGES_REQUESTED);
  if (already_request) {
    throw new UnauthorizedActionError("The student has already a thesis start request");
  }

  // check if the proposal belong to the degree of the student
  if(proposal_id){
    const checkProposalDegree = `SELECT * FROM proposalCds WHERE proposal_id=? AND cod_degree=(SELECT cod_degree FROM student WHERE id=?)`;
    const proposal_correct = db.prepare(checkProposalDegree).get(proposal_id, student_id);
    if (!proposal_correct) {
      throw new UnauthorizedActionError("The proposal doesn't belong to the student degree");
    }
  }

  let requestId;
  // Self-called transaction
  db.transaction(() => {
    // Insert the thesis start request into the database with application_id and proposal_id
    const addRequestQuery =
        `INSERT INTO thesisStartRequest (student_id, application_id, proposal_id, title, description, supervisor_id, creation_date) 
         VALUES (?, ?, ?, ?, ?, ?, ?);`;

    // Insert the thesis start request into the database without application_id and proposal_id
    const addRequestQueryLessParamethers =
        `INSERT INTO thesisStartRequest (student_id, title, description, supervisor_id, creation_date) 
         VALUES (?, ?, ?, ?, ?);`;

    let res;
    if(application_id && proposal_id){
      res = db.prepare(addRequestQuery).run(student_id, application_id, proposal_id, title, description, supervisor_id, creation_date);
    }
    else{
      res = db.prepare(addRequestQueryLessParamethers).run(student_id, title, description, supervisor_id, creation_date);
    }

    requestId = res.lastInsertRowid;

    // Insert the internal co-supervisors into the database
    const addInternalCoSupervisorsQuery = `INSERT INTO thesisStartCosupervisor (start_request_id, cosupervisor_id) VALUES (?, ?);`;
    for (const id of internal_co_supervisors_ids) {
      db.prepare(addInternalCoSupervisorsQuery).run(requestId, id);
    }
  })();

  return requestId;
};

/**
 * Return the last thesis start request of the student with the given id
 *
 * @param {string} student_id
 * @return {Promise<ThesisStartRequestRow | null>}
 */
exports.getStudentLastThesisStartRequest = async (student_id) => {
  const currentDate = new AdvancedDate().toISOString();
  const query = `SELECT * FROM thesisStartRequest WHERE student_id=? AND creation_date < ? ORDER BY creation_date DESC LIMIT 1;`;
  const tsr = db.prepare(query).get(student_id, currentDate);
  if (!tsr) {
    return null;
  }

  const co_supervisors_query = 'SELECT cosupervisor_id FROM thesisStartCosupervisor WHERE start_request_id=?';
  const co_supervisors = db.prepare(co_supervisors_query).all(tsr.id).map(entry => entry.cosupervisor_id);

  return { ...tsr, co_supervisors };
};


/**
 * Return all the thesis start requests
 *
 * @return {Promise<ThesisStartRequestRow[]>}
 */
exports.listThesisStartRequests = async () => {
  const currentDate = new AdvancedDate().toISOString();
  const queryTSR = `SELECT * FROM thesisStartRequest WHERE creation_date < ?`;
  const tsrList = db.prepare(queryTSR).all(currentDate);

  return tsrList.map( tsr => {
    const queryCoSupervisors = `SELECT cosupervisor_id FROM thesisStartCosupervisor WHERE start_request_id=?`;
    const co_supervisors = db.prepare(queryCoSupervisors).all(tsr.id).map(entry => entry.cosupervisor_id);

    // Add the coSupervisors attribute to the tsr object
    return {
      ...tsr,
      co_supervisors,
    };
  })
};

/**
 * Return the thesis start request with the given id without performing any check
 *
 * @param {string} request_id
 * @return {Promise<ThesisStartRequestRow | null>}
 */
exports.getThesisStartRequestById = async (request_id) => {
  const query = `SELECT * FROM thesisStartRequest WHERE id = ? AND creation_date < ?`;
  const thesisStartRequest = db.prepare(query).get(request_id, new AdvancedDate().toISOString());

  if (!thesisStartRequest) {
    return null;
  }

  const coSupervisorsQuery = 'SELECT cosupervisor_id FROM thesisStartCosupervisor WHERE start_request_id=?';
  const coSupervisorsResult = db.prepare(coSupervisorsQuery).all(request_id);

  const coSupervisors = coSupervisorsResult ? coSupervisorsResult.map(entry => entry.cosupervisor_id) : [];

  return { ...thesisStartRequest, co_supervisors: coSupervisors };
};

/**
 * Accept/Reject a thesis start request
 *
 * @param {string} request_id
 * @param {string} new_status
 * @return {Promise<boolean>}
 */
exports.updateThesisStartRequestStatus = async (request_id, new_status) => {
  const query = `UPDATE thesisStartRequest SET status = ? WHERE id = ?;`;

  const res = db.prepare(query).run(new_status, request_id);
  return res.changes !== 0;
};


/**
 * @typedef {Object} ThesisStartRequestRow
 *
 * @property {number} id
 * @property {string} student_id
 * @property {string} application_id
 * @property {string} proposal_id
 * @property {string} title
 * @property {string} description
 * @property {string} supervisor_id
 * @property {string} creation_date
 * @property {string} approval_date
 * @property {string[]} co_supervisors
 * @property {string} status
 *
 */
