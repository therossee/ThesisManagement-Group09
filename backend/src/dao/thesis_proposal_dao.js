'use strict';

/* Data Access Object (DAO) module for accessing thesis proposals data */

const db = require('../services/db');
const AdvancedDate = require('../models/AdvancedDate');
const InvalidActionError = require("../errors/InvalidActionError");
const NoThesisProposalError = require("../errors/NoThesisProposalError");
const UnauthorizedActionError = require("../errors/UnauthorizedActionError");
const {APPLICATION_STATUS} = require("../enums/application");

/**
 * Create a new thesis proposal
 *
 * @param {object} proposal_details -> title, supervisor_id, type, description, required_knowledge, notes, expiration, level
 * @param {object} additional_details -> keywords, internal_co_supervisors_id, external_co_supervisors_id, unique_groups, cds
 * @return {Promise<number>}
 */
exports.createThesisProposal = async (proposal_details, additional_details) => {
  let currentDate = new AdvancedDate();
  const exp = new AdvancedDate(proposal_details.expiration);
  if (exp.isBefore(currentDate)){
    throw new Error("The expiration date must be after the creation date");
  }

  currentDate = currentDate.toISOString();

  const insertThesisProposalQuery = `
      INSERT INTO thesisProposal (title, supervisor_id, type, description, required_knowledge, notes, creation_date, expiration, level)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?); `;

  const insertProposalKeywordQuery = `
      INSERT INTO proposalKeyword (proposal_id, keyword)
      VALUES (?, ?); `;

  const insertInternalCoSupervisorsQuery = `
      INSERT INTO thesisInternalCoSupervisor (proposal_id, co_supervisor_id)
      VALUES (?, ?); `;

  const insertExternalCoSupervisorsQuery = `
      INSERT INTO thesisExternalCoSupervisor (proposal_id, co_supervisor_id)
      VALUES (?, ?); `;

  const insertGroupsQuery = `
      INSERT INTO proposalGroup (proposal_id, cod_group)
      VALUES (?, ?); `;

  const insertCdsQuery = `
      INSERT INTO proposalCds (proposal_id, cod_degree)
      VALUES (?, ?); `;

  // Self-called transaction
  let proposalId;
  db.transaction(() => {
    const res = db.prepare(insertThesisProposalQuery).run(proposal_details.title, proposal_details.supervisor_id, proposal_details.type, proposal_details.description, proposal_details.required_knowledge, proposal_details.notes, currentDate, proposal_details.expiration, proposal_details.level);
    proposalId = res.lastInsertRowid;

    // Keywords insertion
    additional_details.keywords.forEach(keyword => {
      db.prepare(insertProposalKeywordQuery).run(proposalId, keyword);
    });

    if (additional_details.internal_co_supervisors_id.length > 0) {
      additional_details.internal_co_supervisors_id.forEach(internal_co_supervisor_id => {
        db.prepare(insertInternalCoSupervisorsQuery).run(proposalId, internal_co_supervisor_id);
      });
    }

    if (additional_details.external_co_supervisors_id.length > 0) {
      additional_details.external_co_supervisors_id.forEach(external_co_supervisor_id => {
        db.prepare(insertExternalCoSupervisorsQuery).run(proposalId, external_co_supervisor_id);
      });
    }

    additional_details.unique_groups.forEach(group => {
      db.prepare(insertGroupsQuery).run(proposalId, group);
    });

    additional_details.cds.forEach(cod_degree => {
      db.prepare(insertCdsQuery).run(proposalId, cod_degree);
    });
  })();

  return proposalId;
};

/**
 * Update all the fields of a thesis proposal
 *
 * @param {string} proposal_id
 * @param {string} supervisor_id
 * @param thesis
 * @return {Promise<string | null>}
 */
exports.updateThesisProposal = async (proposal_id, supervisor_id, thesis) => {
  const now = new AdvancedDate();

  if (thesis.notes === ''){
    thesis.notes = null;
  }
  if (thesis.required_knowledge === ''){
    thesis.required_knowledge = null;
  }

  /** @type {string | null} */
  let result = proposal_id;
  db.transaction(() => {
    const updateThesisProposalQuery = `
        UPDATE thesisProposal
        SET title = ?, type = ?, description = ?, required_knowledge = ?, notes = ?, expiration = ?, level = ?
        WHERE proposal_id = ? AND supervisor_id = ? AND creation_date < ? AND is_deleted = 0;`;

    const res = db.prepare(updateThesisProposalQuery).run(thesis.title, thesis.type, thesis.description, thesis.required_knowledge, thesis.notes, thesis.expiration, thesis.level, proposal_id, supervisor_id, now.toISOString());
    if (res.changes === 0) {
      result = null;
      return;
    }

    const deleteProposalKeywordQuery = `
        DELETE FROM proposalKeyword
        WHERE proposal_id = ?;`;
    db.prepare(deleteProposalKeywordQuery).run(proposal_id);
    const insertProposalKeywordQuery = `
        INSERT INTO proposalKeyword (proposal_id, keyword)
        VALUES (?, ?); `;
    for (const keyword of thesis.keywords) {
      db.prepare(insertProposalKeywordQuery).run(proposal_id, keyword);
    }

    const deleteInternalCoSupervisorsQuery = `
            DELETE FROM thesisInternalCoSupervisor
            WHERE proposal_id = ?;`;
    db.prepare(deleteInternalCoSupervisorsQuery).run(proposal_id);
    const insertInternalCoSupervisorsQuery = `
            INSERT INTO thesisInternalCoSupervisor (proposal_id, co_supervisor_id)
            VALUES (?, ?); `;
    for (const internal_co_supervisor_id of thesis.internal_co_supervisors_id) {
      db.prepare(insertInternalCoSupervisorsQuery).run(proposal_id, internal_co_supervisor_id);
    }

    const deleteExternalCoSupervisorsQuery = `
            DELETE FROM thesisExternalCoSupervisor
            WHERE proposal_id = ?;`;
    db.prepare(deleteExternalCoSupervisorsQuery).run(proposal_id);
    const insertExternalCoSupervisorsQuery = `
            INSERT INTO thesisExternalCoSupervisor (proposal_id, co_supervisor_id)
            VALUES (?, ?); `;
    for (const external_co_supervisor_id of thesis.external_co_supervisors_id) {
      db.prepare(insertExternalCoSupervisorsQuery).run(proposal_id, external_co_supervisor_id);
    }

    const deleteGroupsQuery = `
            DELETE FROM proposalGroup
            WHERE proposal_id = ?;`;
    db.prepare(deleteGroupsQuery).run(proposal_id);
    const insertGroupsQuery = `
            INSERT INTO proposalGroup (proposal_id, cod_group)
            VALUES (?, ?); `;
    for (const group of thesis.groups) {
      db.prepare(insertGroupsQuery).run(proposal_id, group);
    }

    const deleteCdsQuery = `
            DELETE FROM proposalCds
            WHERE proposal_id = ?;`;
    db.prepare(deleteCdsQuery).run(proposal_id);
    const insertCdsQuery = `
            INSERT INTO proposalCds (proposal_id, cod_degree)
            VALUES (?, ?); `;
    for (const cod_degree of thesis.cds) {
      db.prepare(insertCdsQuery).run(proposal_id, cod_degree);
    }
  })();

  return result;
};

/**
 * Return the proposal with the given id related to a student degree (if exists)
 *
 * @param {string} proposalId
 * @param {string} studentId
 *
 * @return {Promise<ThesisProposalRow | null>}
 */
exports.getThesisProposal = async (proposalId, studentId) => {
  const currentDate = new AdvancedDate().toISOString();

  // Check is the proposal is not already assigned
  const checkProposalAssigned = `SELECT * FROM thesisApplication WHERE proposal_id=? AND status=?`;
  const proposal_assigned = db.prepare(checkProposalAssigned).get(proposalId, APPLICATION_STATUS.ACCEPTED);

  if (proposal_assigned){
    return null;
  }

  const query = `SELECT * FROM thesisProposal P
        JOIN proposalCds PC ON P.proposal_id = PC.proposal_id
        JOIN degree D ON PC.cod_degree = D.cod_degree
        JOIN student S ON S.cod_degree = D.cod_degree
        WHERE P.proposal_id = ? AND S.id = ? 
        AND P.expiration > ? AND P.creation_date < ? AND P.is_deleted = 0;`;

  return db.prepare(query).get(proposalId, studentId, currentDate, currentDate) ?? null;
};

/**
 * Return the proposal with the given id without performing any check
 *
 * @param {string} proposalId
 * @return {ThesisProposalRow | null}
 */
exports.getThesisProposalById = (proposalId) => {
  // Do not set this function as async to avoid useless complexity in "_handleFailure" function

  const query = `SELECT * FROM thesisProposal P
        JOIN proposalCds PC ON P.proposal_id = PC.proposal_id
        JOIN degree D ON PC.cod_degree = D.cod_degree
        WHERE P.proposal_id = ? AND is_deleted = 0;`;

  return db.prepare(query).get(proposalId) ?? null;
};

/**
 * Set the property is_deleted of a thesis proposal to 1 and cancel all the applications waiting for approval for that
 * thesis
 *
 * @param {string} proposalId
 * @param {string} supervisorId
 * @return {Promise<ThesisApplicationRow[]>}
 */
exports.deleteThesisProposalById = async (proposalId, supervisorId) => {
  let application;
  db.transaction(() => {
    const hasApplicationsApprovedQuery = `
        SELECT 1
        FROM thesisApplication
        WHERE proposal_id = ? AND status = ?;
      `;
    const hasApplicationsApproved = db.prepare(hasApplicationsApprovedQuery).get(proposalId, APPLICATION_STATUS.ACCEPTED) != null;
    if (hasApplicationsApproved) {
      throw new UnauthorizedActionError('Some applications has been accepted and, therefore, you can\'t delete this thesis');
    }

    const now = new AdvancedDate().toISOString();
    const deleteThesisProposalQuery = `
        UPDATE thesisProposal
        SET is_deleted = 1
        WHERE proposal_id = ? AND supervisor_id = ? AND expiration > ? AND creation_date < ?;
      `;
    const res = db.prepare(deleteThesisProposalQuery).run(proposalId, supervisorId, now, now);
    if (res.changes === 0) {
      // Handle failure scenarios
      _handleFailure.call(this, proposalId, now, "delete");
    }

    const cancelApplicationsQuery = `
        UPDATE thesisApplication
        SET status = ?
        WHERE proposal_id = ? AND status = ?
        RETURNING *;
      `;
    application = db.prepare(cancelApplicationsQuery).all(APPLICATION_STATUS.CANCELLED, proposalId, APPLICATION_STATUS.WAITING_FOR_APPROVAL);
  })();

  return application;
};

/**
 * Set the property is_archived of a thesis proposal to 1 and cancel all the applications waiting for approval for that
 * thesis
 *
 * @param {string} proposalId
 * @param {string} supervisorId
 * @return {Promise<ThesisApplicationRow[]>}
 */
exports.archiveThesisProposalById = async (proposalId, supervisorId) => {
  let applicationsCancelled;
  db.transaction(() => {
    const hasApplicationsApprovedQuery = `
        SELECT 1
        FROM thesisApplication
        WHERE proposal_id = ? AND status = ?;
      `;
    const hasApplicationsApproved = db.prepare(hasApplicationsApprovedQuery).get(proposalId, APPLICATION_STATUS.ACCEPTED) != null;
    if (hasApplicationsApproved) {
      throw new UnauthorizedActionError('Some applications has been accepted and, therefore, you can\'t archive this thesis');
    }

    const now = new AdvancedDate().toISOString();
    const archiveThesisProposalQuery = `
        UPDATE thesisProposal
        SET is_archived = 1
        WHERE proposal_id = ? AND supervisor_id = ? AND expiration > ? AND creation_date < ?;
      `;
    const res = db.prepare(archiveThesisProposalQuery).run(proposalId, supervisorId, now, now);
    if (res.changes === 0) {
      // Handle failure scenarios
      _handleFailure.call(this, proposalId, now, "archive");
    }

    const cancelApplicationsQuery = `
        UPDATE thesisApplication
        SET status = ?
        WHERE proposal_id = ? AND status = ?
        RETURNING *;
      `;
    applicationsCancelled = db.prepare(cancelApplicationsQuery).all(APPLICATION_STATUS.CANCELLED, proposalId, APPLICATION_STATUS.WAITING_FOR_APPROVAL);
  })();

  return applicationsCancelled;
};

/**
 * Un-archive a thesis proposal properly
 *
 * @param {number} proposalId
 * @param {string} supervisorId
 * @param {string} [expiration]
 *
 * @return {Promise<ThesisProposalRow>}
 */
exports.unarchiveThesisProposalById = async (proposalId, supervisorId, expiration) => {
  /** @type {ThesisProposalRow | null} */
  let proposal = null;
  const transaction = db.transaction(() => {
    const now = new AdvancedDate();

    proposal = db.prepare('SELECT * FROM thesisProposal WHERE proposal_id = ? AND supervisor_id = ? AND is_deleted = 0;').get(proposalId, supervisorId);
    if (!proposal) {
      throw new NoThesisProposalError(proposalId);
    }

    const application = db.prepare('SELECT * FROM thesisApplication WHERE proposal_id = ? AND status = ?;').get(proposalId, APPLICATION_STATUS.ACCEPTED);
    if (application) {
      throw new InvalidActionError('You can\'t un-archive a thesis that has already been assigned');
    }

    const thesisExpiration = new AdvancedDate(proposal.expiration);
    switch (true) {
      case thesisExpiration.isBefore(now):
        if (!expiration) {
          throw new InvalidActionError('The thesis proposal is expired and you must specify a new expiration date');
        }

        db.prepare('UPDATE thesisProposal SET is_archived = 0, expiration = ? WHERE proposal_id = ?;')
            .run(expiration, proposalId);

        break;
      case Boolean(proposal.is_archived):
        if (expiration) {
          db.prepare('UPDATE thesisProposal SET is_archived = 0, expiration = ? WHERE proposal_id = ?;')
                .run(expiration, proposalId);
        } else {
          db.prepare('UPDATE thesisProposal SET is_archived = 0 WHERE proposal_id = ?;')
                .run(proposalId);
        }

        break;
      default:
        throw new InvalidActionError('You can\'t un-archive a thesis that wasn\'t archived manually OR that is not expired');
    }
  });
  transaction();

  return exports.getThesisProposalTeacher(proposalId, supervisorId);
};

/**
 * Return the list of thesis proposals related to a student degree
 *
 * @param {string} studentId
 * @return {Promise<ThesisProposalRow[]>}
 */
exports.listThesisProposalsFromStudent = async (studentId) => {
  const currentDate = new AdvancedDate().toISOString();
  const query = `SELECT *
        FROM thesisProposal P
            JOIN proposalCds C ON C.proposal_id = P.proposal_id
            JOIN degree D ON C.cod_degree = D.cod_degree
            JOIN student S ON S.cod_degree = D.cod_degree
        WHERE S.id = ?
          AND NOT EXISTS (
              SELECT 1
              FROM thesisApplication A
              WHERE A.proposal_id = P.proposal_id
                AND A.status = ?
          )
          AND P.expiration > ?
          AND P.creation_date < ?
          AND is_archived = 0
          AND is_deleted = 0;`;

  return db.prepare(query).all(studentId, APPLICATION_STATUS.ACCEPTED, currentDate, currentDate);
};

/**
 * Return the list of keywords of a thesis proposal
 *
 * @param {string} proposalId
 * @return {Promise<string[]>}
 */
exports.getKeywordsOfProposal = async (proposalId) => {
  const query = `SELECT keyword FROM proposalKeyword WHERE proposal_id = ?`;

  return db.prepare(query).all(proposalId)
      .map( row => row.keyword );
};

/**
 * Return the list of thesis proposals groups
 *
 * @param {string} proposalId
 * @return {Promise<string[]>}
 */
exports.getProposalGroups = async (proposalId) => {
  const query = `SELECT cod_group FROM proposalGroup WHERE proposal_id = ?`;
  return db.prepare(query).all(proposalId)
      .map( row => row.cod_group );
};

/**
 * Return the list of internal co-supervisors (teachers) of a thesis proposal
 *
 * @param {string} proposalId
 *
 * @return {Promise<TeacherRow[]>}
 */
exports.getInternalCoSupervisorsOfProposal = async (proposalId) => {
  const query = `SELECT * FROM thesisInternalCoSupervisor I JOIN teacher T ON I.co_supervisor_id = T.id WHERE I.proposal_id = ?`;
  return db.prepare(query).all(proposalId);
};

/**
 * Return the list of external co-supervisors of a thesis proposal
 *
 * @param {string} proposalId
 * @return {Promise<ExternalCoSupervisorRow[]>}
 */
exports.getExternalCoSupervisorsOfProposal = async (proposalId) => {
  const query = `SELECT * FROM thesisExternalCoSupervisor E JOIN externalCoSupervisor C ON E.co_supervisor_id = C.id WHERE E.proposal_id = ?`;
  return db.prepare(query).all(proposalId);
};

/**
 * Return the supervisor of a thesis proposal
 *
 * @param {string} proposalId
 * @return {Promise<TeacherRow>}
 */
exports.getSupervisorOfProposal = async (proposalId) => {
  const query = `SELECT T.id, T.surname, T.name, T.email, T.cod_group, T.cod_department FROM thesisProposal P JOIN teacher T ON P.supervisor_id = T.id WHERE P.proposal_id = ? AND P.is_deleted = 0`;
  return db.prepare(query).get(proposalId);
};

/**
 * Return the list of thesis proposals of a teacher
 *
 * @param {string} teacherId
 * @returns {Promise<ThesisProposalRow[]>}
 */
exports.listThesisProposalsTeacher = async (teacherId) => {
  const currentDate = new AdvancedDate().toISOString();
  const getProposals = `SELECT * 
      FROM thesisProposal P
      WHERE P.supervisor_id=?
        AND NOT EXISTS (
          SELECT 1
          FROM thesisApplication A
          WHERE A.proposal_id = P.proposal_id
            AND A.status = ?
        )
        AND P.expiration > ?
        AND creation_date < ?
        AND is_archived = 0
        AND is_deleted = 0;`;
  return db.prepare(getProposals).all(teacherId, APPLICATION_STATUS.ACCEPTED, currentDate, currentDate);
};

/**
 * Return the list of archived thesis proposals of a teacher
 * @param {string} teacherId 
 * @returns {Promise<ThesisProposalRow[]>} 
 */
exports.listArchivedThesisProposalsTeacher = async(teacherId) => {
  const currentDate = new AdvancedDate().toISOString();
  const getProposals = `SELECT * 
    FROM thesisProposal P
    WHERE P.supervisor_id=?
    AND ( 
      EXISTS (
        SELECT 1
        FROM thesisApplication A
        WHERE A.proposal_id = P.proposal_id
        AND A.status = ? 
      )
      OR P.expiration < ?
      OR is_archived = 1 
    )
    AND creation_date < ?
    AND is_deleted = 0;`;
  return db.prepare(getProposals).all(teacherId, APPLICATION_STATUS.ACCEPTED, currentDate, currentDate);
};

/**
 * Return the list of course of studies of a thesis proposal
 *
 * @param {string | number} proposalId
 * @returns {Promise<DegreeRow[]>}
 */
exports.getThesisProposalCds = async (proposalId) => {
  const query = `SELECT d.cod_degree, d.title_degree FROM proposalCds p, degree d WHERE proposal_id = ? AND p.cod_degree = d.cod_degree`;
  return db.prepare(query).all(proposalId);
};

/**
 * Return the thesis proposal with the given id and the given teacher as supervisor
 *
 * @param {string | number} proposalId
 * @param {string} teacherId
 * @returns {Promise<ThesisProposalRow | null>}
 */
exports.getThesisProposalTeacher = (proposalId, teacherId) => {
  const currentDate = new AdvancedDate().toISOString();

  const query = `SELECT * FROM thesisProposal WHERE proposal_id = ? AND supervisor_id = ? 
                 AND creation_date < ? AND is_deleted = 0;`;
  return db.prepare(query).get(proposalId, teacherId, currentDate) ?? null;
};


/**
 * Handle failure scenarios when deleting or archiving a thesis proposal
 *
 * @param {string} proposalId
 * @param {string} now
 * @param {string} operation
 *
 * @return {Promise<void>}
 */
function _handleFailure(proposalId, now, operation) {
    const thesis = this.getThesisProposalById(proposalId);
    if (thesis == null || thesis.creation_date > now) {
      // No thesis proposal with the given id
      throw new NoThesisProposalError(proposalId);
    } else if (thesis.expiration <= now) {
      // Thesis proposal expired
      throw new UnauthorizedActionError(`You can't ${operation} a thesis already expired`);
    } else {
      // The supervisor is not the owner of the thesis proposal
      throw new UnauthorizedActionError('You are not the supervisor of this thesis');
    }
}

/**
 * @typedef {Object} ThesisApplicationRow
 *
 * @property {string} proposal_id
 * @property {string} student_id
 * @property {string} status
 * @property {string} creation_date
 */

/**
 * @typedef {Object} ThesisProposalRow
 *
 * @property {string} proposal_id
 * @property {string} title
 * @property {string} supervisor_id
 * @property {string} type
 * @property {string} description
 * @property {string} [required_knowledge]
 * @property {string} [notes]
 * @property {string} expiration
 * @property {string} level
 * @property {string} cds
 * @property {1 | 0} is_deleted
 * @property {1 | 0} is_archived
 */

/**
 * @typedef {Object} TeacherRow
 *
 * @property {string} id
 * @property {string} surname
 * @property {string} name
 * @property {string} email
 * @property {string} cod_group
 * @property {string} cod_department
 */

/**
 * @typedef {Object} ExternalCoSupervisorRow
 *
 * @property {string} id
 * @property {string} surname
 * @property {string} name
 * @property {string} email
 */

/**
 * @typedef {Object} DegreeRow
 *
 * @property {string} cod_degree
 * @property {string} title_degree
 */
