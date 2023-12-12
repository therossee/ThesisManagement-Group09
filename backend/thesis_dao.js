'use strict';

/* Data Access Object (DAO) module for accessing thesis data */

const db = require('./db');
const AdvancedDate = require('./AdvancedDate');
const NoThesisProposalError = require("./errors/NoThesisProposalError");
const UnauthorizedActionError = require("./errors/UnauthorizedActionError");

exports.createThesisProposal = (proposal_details, additional_details) => {
  return new Promise((resolve, reject) => {

    let currentDate = new AdvancedDate();
    const exp = new AdvancedDate(proposal_details.expiration);
    if(exp.isBefore(currentDate)){
      reject(new Error("The expiration date must be after the creation date"));
      return;
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
    db.transaction(() => {
      const res = db.prepare(insertThesisProposalQuery).run(proposal_details.title, proposal_details.supervisor_id, proposal_details.type, proposal_details.description, proposal_details.required_knowledge, proposal_details.notes, currentDate, proposal_details.expiration, proposal_details.level);
      const proposalId = res.lastInsertRowid;

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

      resolve(proposalId)
    })()
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Update all the fields of a thesis proposal
 *
 * @param {string} proposal_id
 * @param {string} supervisor_id
 * @param thesis
 * @return {Promise<string>}
 */
exports.updateThesisProposal = (proposal_id, supervisor_id, thesis) => {
  return new Promise((resolve) => {
    const now = new AdvancedDate();

    if(thesis.notes === ''){
      thesis.notes = null;
    }
    if(thesis.required_knowledge === ''){
      thesis.required_knowledge = null;
    }

    db.transaction(() => {
      const updateThesisProposalQuery = `
        UPDATE thesisProposal
        SET title = ?, type = ?, description = ?, required_knowledge = ?, notes = ?, expiration = ?, level = ?
        WHERE proposal_id = ? AND supervisor_id = ? AND creation_date < ? AND is_deleted = 0;`;

      const res = db.prepare(updateThesisProposalQuery).run(thesis.title, thesis.type, thesis.description, thesis.required_knowledge, thesis.notes, thesis.expiration, thesis.level, proposal_id, supervisor_id, now.toISOString());
      if (res.changes === 0) {
        resolve(null);
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

      resolve(proposal_id)
    })()
  })
};

exports.getTeacherListExcept = (id) => {
  return new Promise((resolve) => {
    const query = `SELECT * FROM teacher WHERE id <> ?; `;
    const teachers = db.prepare(query).all(id);
    resolve(teachers);
  })
};

exports.getExternalCoSupervisorList = () => {
  return new Promise((resolve) => {
    const query = `SELECT * FROM externalCoSupervisor;`;
    const externalCoSupervisors = db.prepare(query).all();
    resolve(externalCoSupervisors);
  })
};

exports.getGroup = (teacherId) => {
  return new Promise((resolve) => {
    const getGroupQuery = `SELECT cod_group FROM teacher WHERE id=? `;
    const res = db.prepare(getGroupQuery).get(teacherId);
    resolve(res.cod_group)
  })
};

exports.getAllKeywords = () => {
  return new Promise((resolve) => {
    const getKeywords = `SELECT DISTINCT(keyword) FROM proposalKeyword`;
    const res = db.prepare(getKeywords).all();
    // Extracting the keyword property from each row
    const keywords = res.map(row => row.keyword);
    resolve(keywords)
  })
};

exports.getDegrees = () => {
  return new Promise((resolve) => {
    const getDegrees = `SELECT * FROM degree`;
    const res = db.prepare(getDegrees).all();
    resolve(res)
  })
};

/**
 * Return the proposal with the given id related to a student degree (if exists)
 *
 * @param {string} proposalId
 * @param {string} studentId
 *
 * @return {Promise<ThesisProposalRow | null>}
 */
exports.getThesisProposal = (proposalId, studentId) => {
  return new Promise((resolve) => {
    const currentDate = new AdvancedDate().toISOString();

    // Check is the proposal is not already assigned
    const checkProposalAssigned = `SELECT * FROM thesisApplication WHERE proposal_id=? AND status='accepted'`;
    const proposal_assigned = db.prepare(checkProposalAssigned).get(proposalId);

    if(proposal_assigned){
      resolve(null);
      return;
    }

    const query = `SELECT * FROM thesisProposal P
        JOIN proposalCds PC ON P.proposal_id = PC.proposal_id
        JOIN degree D ON PC.cod_degree = D.cod_degree
        JOIN student S ON S.cod_degree = D.cod_degree
        WHERE P.proposal_id = ? AND S.id = ? 
        AND P.expiration > ? AND P.creation_date < ? AND P.is_deleted = 0;`;

    const thesisProposal = db.prepare(query).get(proposalId, studentId, currentDate, currentDate);
    resolve(thesisProposal ?? null);
  })
};

/**
 * Return the proposal with the given id without performing any check
 *
 * @param {string} proposalId
 * @return {Promise<ThesisProposalRow | null>}
 */
exports.getThesisProposalById = (proposalId) => {
  return new Promise((resolve) => {
    const query = `SELECT * FROM thesisProposal P
        JOIN proposalCds PC ON P.proposal_id = PC.proposal_id
        JOIN degree D ON PC.cod_degree = D.cod_degree
        WHERE P.proposal_id = ? AND is_deleted = 0;`;

    const thesisProposal = db.prepare(query).get(proposalId);
    resolve(thesisProposal ?? null);
  })
};

/**
 * Set the property is_deleted of a thesis proposal to 1 and cancel all the applications waiting for approval for that
 * thesis
 *
 * @param {string} proposalId
 * @param {string} supervisorId
 * @return {Promise<ThesisApplicationRow[]>}
 */
exports.deleteThesisProposalById = (proposalId, supervisorId) => {
  return new Promise( (resolve, reject) => {
    db.transaction(async () => {
      const hasApplicationsApprovedQuery = `
        SELECT 1
        FROM thesisApplication
        WHERE proposal_id = ? AND status = 'accepted';
      `;
      const hasApplicationsApproved = db.prepare(hasApplicationsApprovedQuery).get(proposalId) != null;
      if (hasApplicationsApproved) {
        reject( new UnauthorizedActionError('Some applications has been accepted and, therefore, you can\'t delete this thesis') );
        return;
      }

      const now = new AdvancedDate().toISOString();
      const deleteThesisProposalQuery = `
        UPDATE thesisProposal
        SET is_deleted = 1
        WHERE proposal_id = ? AND supervisor_id = ? AND expiration > ? AND creation_date < ?;
      `;
      const res = db.prepare(deleteThesisProposalQuery).run(proposalId, supervisorId, now, now);
      if (res.changes === 0) {
        // We try to understand the reason of the failure
        const thesis = await this.getThesisProposalById(proposalId);
        if (thesis == null || thesis.creation_date > now) {
          // No thesis proposal with the given id
          reject( new NoThesisProposalError(proposalId) );
        } else if (thesis.expiration <= now) {
          // Thesis proposal expired
          reject( new UnauthorizedActionError('You can\'t delete a thesis already expired') );
        } else {
          // The supervisor is not the owner of the thesis proposal
          reject( new UnauthorizedActionError('You are not the supervisor of this thesis') );
        }

        return;
      }

      const cancelApplicationsQuery = `
        UPDATE thesisApplication
        SET status = 'cancelled'
        WHERE proposal_id = ? AND status = 'waiting for approval'
        RETURNING *;
      `;
      resolve( db.prepare(cancelApplicationsQuery).all(proposalId) );
    })();
  })
};

/**
 * Set the property is_archived of a thesis proposal to 1 and cancel all the applications waiting for approval for that
 * thesis
 *
 * @param {string} proposalId
 * @param {string} supervisorId
 * @return {Promise<ThesisApplicationRow[]>}
 */
exports.archiveThesisProposalById = (proposalId, supervisorId) => {
  return new Promise( (resolve, reject) => {
    db.transaction(async () => {
      const hasApplicationsApprovedQuery = `
        SELECT 1
        FROM thesisApplication
        WHERE proposal_id = ? AND status = 'accepted';
      `;
      const hasApplicationsApproved = db.prepare(hasApplicationsApprovedQuery).get(proposalId) != null;
      if (hasApplicationsApproved) {
        reject( new UnauthorizedActionError('Some applications has been accepted and, therefore, you can\'t archive this thesis') );
        return;
      }

      const now = new AdvancedDate().toISOString();
      const archiveThesisProposalQuery = `
        UPDATE thesisProposal
        SET is_archived = 1
        WHERE proposal_id = ? AND supervisor_id = ? AND expiration > ? AND creation_date < ?;
      `;
      const res = db.prepare(archiveThesisProposalQuery).run(proposalId, supervisorId, now, now);
      if (res.changes === 0) {
        // We try to understand the reason of the failure
        const thesis = await this.getThesisProposalById(proposalId);
        if (thesis == null || thesis.creation_date > now) {
          // No thesis proposal with the given id
          reject( new NoThesisProposalError(proposalId) );
        } else if (thesis.expiration <= now) {
          // Thesis proposal expired
          reject( new UnauthorizedActionError('You can\'t archive a thesis already expired') );
        } else {
          // The supervisor is not the owner of the thesis proposal
          reject( new UnauthorizedActionError('You are not the supervisor of this thesis') );
        }

        return;
      }

      const cancelApplicationsQuery = `
        UPDATE thesisApplication
        SET status = 'cancelled'
        WHERE proposal_id = ? AND status = 'waiting for approval'
        RETURNING *;
      `;
      resolve( db.prepare(cancelApplicationsQuery).all(proposalId) );
    })();
  })
};
/**
 * Return the list of thesis proposals related to a student degree
 *
 * @param {string} studentId
 * @return {Promise<ThesisProposalRow[]>}
 */
exports.listThesisProposalsFromStudent = (studentId) => {
  return new Promise((resolve) => {
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
                AND A.status = 'accepted'
          )
          AND P.expiration > ?
          AND P.creation_date < ?
          AND is_archived = 0
          AND is_deleted = 0;`;

    const thesisProposals = db.prepare(query).all(studentId, currentDate, currentDate);
    resolve(thesisProposals);
  })
};

/**
 * Return the list of keywords of a thesis proposal
 *
 * @param {string} proposalId
 * @return {Promise<string[]>}
 */
exports.getKeywordsOfProposal = (proposalId) => {
  return new Promise((resolve) => {
    const query = `SELECT keyword FROM proposalKeyword WHERE proposal_id = ?`;
    const data = db.prepare(query).all(proposalId);
    resolve(data.map(row => row.keyword));
  })
};

/**
 * Return the list of thesis proposals groups
 *
 * @param {string} proposalId
 * @return {Promise<string[]>}
 */
exports.getProposalGroups = (proposalId) => {
  return new Promise((resolve) => {
    const query = `SELECT cod_group FROM proposalGroup WHERE proposal_id = ?`;
    const data = db.prepare(query).all(proposalId);

    resolve(data.map(row => row.cod_group));
  })
};

/**
 * Return the list of internal co-supervisors (teachers) of a thesis proposal
 *
 * @param {string} proposalId
 *
 * @return {Promise<TeacherRow[]>}
 */
exports.getInternalCoSupervisorsOfProposal = (proposalId) => {
  return new Promise((resolve) => {
    const query = `SELECT * FROM thesisInternalCoSupervisor I JOIN teacher T ON I.co_supervisor_id = T.id WHERE I.proposal_id = ?`;
    const data = db.prepare(query).all(proposalId);
    resolve(data);
  })
};

/**
 * Return the list of external co-supervisors of a thesis proposal
 *
 * @param {string} proposalId
 * @return {Promise<ExternalCoSupervisorRow[]>}
 */
exports.getExternalCoSupervisorsOfProposal = (proposalId) => {
  return new Promise((resolve) => {
    const query = `SELECT * FROM thesisExternalCoSupervisor E JOIN externalCoSupervisor C ON E.co_supervisor_id = C.id WHERE E.proposal_id = ?`;
    const data = db.prepare(query).all(proposalId);
    resolve(data);
  })
};

/**
 * Return the supervisor of a thesis proposal
 *
 * @param {string} proposalId
 * @return {Promise<TeacherRow>}
 */
exports.getSupervisorOfProposal = (proposalId) => {
  return new Promise((resolve) => {
    const query = `SELECT T.id, T.surname, T.name, T.email, T.cod_group, T.cod_department FROM thesisProposal P JOIN teacher T ON P.supervisor_id = T.id WHERE P.proposal_id = ? AND P.is_deleted = 0`;
    const data = db.prepare(query).get(proposalId);
    resolve(data);
  })
};


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

exports.applyForProposal = (proposal_id, student_id) => {
  return new Promise((resolve, reject) => {
    const currentDate = new AdvancedDate().toISOString();

    //  Check if the proposal belong to the degree of the student
    const checkProposalDegree = `SELECT * FROM proposalCds WHERE proposal_id=? AND cod_degree=(SELECT cod_degree FROM student WHERE id=?)`;
    const proposal_correct = db.prepare(checkProposalDegree).get(proposal_id, student_id);
    if(!proposal_correct){
      reject(new UnauthorizedActionError("The proposal doesn't belong to the student degree"));
      return;
    }

    // Check if the proposal is active
    const checkProposalActive = `SELECT * FROM thesisProposal P WHERE P.proposal_id=?
                                 AND P.expiration > ? AND P.creation_date < ? AND P.is_deleted = 0 AND is_archived = 0
                                 AND NOT EXISTS (
                                    SELECT 1
                                    FROM thesisApplication A
                                    WHERE A.proposal_id = P.proposal_id
                                    AND A.status = 'accepted'
                                )`;

    const proposal_active = db.prepare(checkProposalActive).get(proposal_id, currentDate, currentDate);
    if(!proposal_active){
      reject(new Error("The proposal is not active"));
      return;
    }

    // Check if the user has already applied for other proposals
    const checkAlreadyApplied = `SELECT * FROM thesisApplication WHERE student_id=? AND (status='waiting for approval' OR status='accepted')`;
    const already_applied = db.prepare(checkAlreadyApplied).get(student_id);
    if(already_applied){
      reject(new UnauthorizedActionError("The user has already applied for other proposals"));
      return;
    }

    const insertApplicationQuery = `
    INSERT INTO thesisApplication (proposal_id, student_id, creation_date)
    VALUES (?, ?, ?); `; // at first the application has default status 'waiting for approval'

    const res = db.prepare(insertApplicationQuery).run(proposal_id, student_id, currentDate);
    resolve(res.lastInsertRowid);
  })
}

exports.listThesisProposalsTeacher = (teacherId) => {
  return new Promise((resolve) => {
    const currentDate = new AdvancedDate().toISOString();
    const getProposals = `SELECT * 
      FROM thesisProposal P
      WHERE P.supervisor_id=?
        AND NOT EXISTS (
          SELECT 1
          FROM thesisApplication A
          WHERE A.proposal_id = P.proposal_id
            AND A.status = 'accepted'
        )
        AND P.expiration > ?
        AND creation_date < ?
        AND is_archived = 0
        AND is_deleted = 0;`;
    const proposals = db.prepare(getProposals).all(teacherId, currentDate, currentDate);
    resolve(proposals)

  })
};

exports.listApplicationsForTeacherThesisProposal = (proposal_id, teacherId) => {
  return new Promise((resolve) => {
    const currentDate = new AdvancedDate().toISOString();
    const getApplications = `SELECT s.name, s.surname, ta.status, s.id
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

    const applications = db.prepare(getApplications).all(proposal_id, teacherId, currentDate, currentDate, currentDate);
    resolve(applications)

  })
};

exports.getStudentActiveApplication = (student_id) => {
  return new Promise((resolve) => {
    const currentDate = new AdvancedDate().toISOString();
    const query = `SELECT proposal_id FROM thesisApplication WHERE student_id=? AND creation_date < ? AND ( status='waiting for approval' OR status='accepted')`;
    const res = db.prepare(query).all(student_id, currentDate);
    resolve(res)
  })
};

exports.updateApplicationStatus = (studentId, proposalId, status) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE thesisApplication
      SET status = ?
      WHERE student_id = ? AND proposal_id = ? AND status = 'waiting for approval' AND creation_date < ?
    `;
    const res = db.prepare(query).run(status, studentId, proposalId, new AdvancedDate().toISOString());

    resolve(res.changes !== 0);
  })
};

/**
 * Cancel all applications waiting for approval for a given proposal except the one of the student
 *
 * @param {string} studentId
 * @param {string} proposalId
 * @return {Promise<ThesisApplicationRow[]>}
 */
exports.cancelOtherApplications = (studentId, proposalId) => {
  return new Promise((resolve, reject) => {
    const updateQuery = `
        UPDATE thesisApplication
        SET status='cancelled'
        WHERE student_id <> ? AND proposal_id = ? AND status = 'waiting for approval'
        RETURNING *;
      `;

    resolve(db.prepare(updateQuery).all(studentId, proposalId));
  })
};

exports.listApplicationsDecisionsFromStudent = (studentId) => {
  return new Promise((resolve) => {

    const getApplications = `SELECT ta.id AS "application_id", ta.proposal_id, tp.title,  tp.level, t.name AS "teacher_name" , t.surname AS "teacher_surname" ,ta.status, tp.expiration
    FROM thesisApplication ta, thesisProposal tp, teacher t
    WHERE ta.proposal_id = tp.proposal_id AND ta.student_id = ? AND t.id = tp.supervisor_id AND ta.creation_date < ?`;

    const applications = db.prepare(getApplications).all(studentId, new AdvancedDate().toISOString());
    resolve(applications)

  })
};
exports.getThesisProposalCds = (proposalId) => {
  return new Promise((resolve) => {
    const query = `SELECT d.cod_degree, d.title_degree FROM proposalCds p, degree d WHERE proposal_id = ? AND p.cod_degree = d.cod_degree`;
    const res = db.prepare(query).all(proposalId);
    resolve(res);
  })
};

exports.getThesisProposalTeacher = (proposalId, teacherId) => {
  return new Promise((resolve) => {
    const currentDate = new AdvancedDate().toISOString();

    // Check is the proposal is not already assigned
    const checkProposalAssigned = `SELECT * FROM thesisApplication WHERE proposal_id=? AND status='accepted'`;
    const proposal_assigned = db.prepare(checkProposalAssigned).get(proposalId);

    if(proposal_assigned){
      resolve(null);
      return;
    }

    const query = `SELECT * FROM thesisProposal WHERE proposal_id = ? AND supervisor_id = ? 
                   AND expiration > ? AND creation_date < ? AND is_deleted = 0 AND is_archived = 0;`;
    const res = db.prepare(query).get(proposalId, teacherId, currentDate, currentDate);
    resolve(res);
  })
};


/**
 * @typedef {Object} ThesisApplicationRow
 *
 * @property {string} proposal_id
 * @property {string} student_id
 * @property {string} status
 * @property {string} creation_date
 */
