// API URL Endpoint
const URL = 'http://localhost:3000/api';

/****** APIs for auth ******/

async function logOut() {
    await fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include",
    });
    window.location.replace("http://localhost:5173");
}

const redirectToLogin = () => {
    window.location.replace("http://localhost:3000/login");
};


async function getUser() {
    const response = await fetch(URL + '/user', {
        method: 'GET',
        credentials: 'include',
    });

    if (response.ok) {
        return response.json();
    } else {
        throw await response.json();
    }
}


/****** Virtual Clock APIs ******/

async function getClock() {
    return fetch(URL + '/system/virtual-clock')
        .then(async response => {
            const body = await response.json();

            if (response.ok) {
                return {
                    date: new Date(body.date),
                    offset: body.offset
                };
            } else {
                throw body;
            }
        });
}

async function updateClock(date) {
    return fetch(URL + '/system/virtual-clock', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newDate: date })
    })
        .then(async response => {
            const body = await response.json();

            if (response.ok) {
                return {
                    date: new Date(body.date),
                    offset: body.offset
                };
            } else {
                throw body;
            }
        });
}

/****** Thesis Proposals APIs ******/

// GET Thesis Proposals
async function getThesisProposals() {
    return fetchThesisProposals('/thesis-proposals');
}

// GET Archived Thesis Proposals
async function getArchivedThesisProposals() {
    return fetchThesisProposals('/thesis-proposals/archived');
}

// Generic function that handles the common logic and then use it in both 
// getThesisProposals and getArchivedThesisProposals
async function fetchThesisProposals(endpoint) {
    const response = await fetch(URL + endpoint, {
        method: 'GET',
        credentials: 'include',
    });
    const proposals = await response.json();
    if (response.ok) {
        return proposals.items.map((x) => ({
            id: x.id,
            key: x.id,
            title: x.title,
            supervisor: x.supervisor,
            internalCoSupervisors: x.coSupervisors.internal ?? [],
            externalCoSupervisors: x.coSupervisors.external ?? [],
            type: x.type,
            description: x.description,
            requiredKnowledge: x.requiredKnowledge ?? "",
            notes: x.notes ?? "",
            expiration: x.expiration.substring(0, 10),
            level: x.level,
            groups: x.groups,
            keywords: x.keywords,
            cds: x.cds,
            status: x.status
        }))
    } else {
        throw proposals;
    }
}

// GET Thesis Proposals by given id
async function getThesisProposalbyId(id) {
    const response = await fetch(URL + `/thesis-proposals/${id}`, {
        method: 'GET',
        credentials: 'include'

    });
    const thesisProposal = await response.json();
    if (response.ok) {
        return {
            id: thesisProposal.id,
            key: thesisProposal.id,
            title: thesisProposal.title,
            supervisor: thesisProposal.supervisor,
            internalCoSupervisors: thesisProposal.coSupervisors.internal,
            externalCoSupervisors: thesisProposal.coSupervisors.external,
            type: thesisProposal.type,
            description: thesisProposal.description,
            requiredKnowledge: thesisProposal.requiredKnowledge,
            notes: thesisProposal.notes,
            expiration: thesisProposal.expiration.substring(0, 10),
            level: thesisProposal.level,
            groups: thesisProposal.groups,
            keywords: thesisProposal.keywords,
            cds: thesisProposal.cds
        }
    } else {
        throw thesisProposal;
    }
}

// POST Thesis Proposal
async function insertProposal(proposal) {
    let response = await fetch(URL + '/teacher/thesis_proposals', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(proposal),
    });
    if (response.ok) {
        const prop = await response.json();
        return prop;
    } else {
        const errDetail = await response.json();
        throw new Error({ status: response.status, msg: errDetail });
    }
}

// POST Student Application on a Thesis Proposal
async function applyForProposal(id, attached_file) {
    const formData = new FormData();
    formData.append('file', attached_file);
    formData.append('thesis_proposal_id', id);

    const response = await fetch(URL + '/student/applications', {
        method: 'POST',
        body: formData,
        credentials: 'include',
    });
    if (response.ok) {
        const apply = await response.json();
        return apply;
    } else {
        const errDetail = await response.json();
        throw new Error({ status: response.status, message: errDetail });
    }
}

// PATCH Archive Thesis Proposal by given id
async function archiveProposalById(id) {
    const response = await fetch(URL + `/thesis-proposals/archive/${id} `, {
        method: 'PATCH',
        credentials: 'include'
    });
    if (response.ok) {
        return response;
    } else {
        throw response;
    }
}

// DELETE Thesis Proposal by given id
async function deleteProposalById(id) {
    const response = await fetch(URL + `/thesis-proposals/${id} `, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (response.ok) {
        return response;
    } else {
        throw response;
    }
}

// PUT Update Thesis Proposal by given id
async function updateProposal(id, proposal) {
    const response = await fetch(URL + `/thesis-proposals/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(proposal),
        credentials: 'include',
    });
    const update = await response.json();
    if (response.ok) {
        return update;
    }
    else {
        throw update;
    }
}

/****** Applications APIs ******/

// GET Student's Thesis Applications
async function getStudentActiveApplication() {
    const response = await fetch(URL + '/student/active-application', {
        method: 'GET',
        credentials: 'include'
    });
    const applications = await response.json();
    if (response.ok) {
        return applications.map(x => x.proposal_id);
    } else {
        throw applications;
    }
}

// GET Student Applications on a Thesis Proposal of a Teacher
async function getTeacherThesisApplications(proposalId) {
    const response = await fetch(URL + `/teacher/applications/${proposalId}`, {
        method: 'GET',
        credentials: 'include'
    });
    const applications = await response.json();
    if (response.ok) {
        return applications.map((x) => ({
            name: x.name,
            surname: x.surname,
            status: x.status,
            application_id: x.application_id,
            id: x.id,
            creation_date: x.creation_date,
        }));
    } else {
        throw applications;
    }
}

// PATCH (Accept) Student Applications on a Thesis Proposal 
async function acceptThesisApplications(proposalId, studentId) {
    const response = await fetch(URL + `/teacher/applications/accept/${proposalId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            student_id: studentId,
        }),
        credentials: 'include'
    });
    const res = await response.json();
    if (response.ok) {
        return res;
    } else {
        throw res;
    }
}

// PATCH (Reject) Student Applications on a Thesis Proposal 
async function rejectThesisApplications(proposalId, studentId) {
    const response = await fetch(URL + `/teacher/applications/reject/${proposalId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            student_id: studentId,
        }),
        credentials: 'include'
    });
    const res = await response.json();
    if (response.ok) {
        return res;
    } else {
        throw res;
    }
}

// GET Student Applications History
async function getStudentApplicationsHistory() {
    const response = await fetch(URL + '/student/applications-decision', {
        method: 'GET',
        credentials: 'include',
    });
    const applications = await response.json();
    if (response.ok) {
        return applications.map((x) => ({
            application_id: x.application_id,
            title: x.title,
            teacherName: x.teacher_surname + " " + x.teacher_name,
            status: x.status,
        }))
    } else {
        throw proposals;
    }
}

/****** Thesis Start Request APIs ******/

// GET Secretary Start Request
async function getSecretaryStartRequest() {
    const response = await fetch(URL + `/secretary-clerk/thesis-start-requests`, {
        method: 'GET',
        credentials: 'include'
    });

    const startRequests = await response.json();

    if (response.ok) {
        return startRequests.map((x) => ({
            id: x.id,
            proposal_id: x.proposal_id,
            application_id: x.application_id,
            student: x.student,
            supervisor: x.supervisor,
            co_supervisors: x.co_supervisors,
            title: x.title,
            description: x.description,
            status: x.status,
            creation_date: x.creation_date,
            approval_date: x.approval_date,
        }));
    } else {
        throw startRequests;
    }
}

async function publishProposalById(id, expiration) {
    const queryParams = expiration ? `?expiration=${encodeURIComponent(expiration)}` : '';
    const response = await fetch(URL + `/thesis-proposals/${id}/archive${queryParams}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (response.ok) {
        return response;
    } else {
        throw response;
    }
}


// Secretary accept student Start Request 
async function secretaryAcceptStartRequest(startReqId) {
    const response = await fetch(URL + `/secretary-clerk/thesis-start-requests/accept/${startReqId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });
    const res = await response.json();
    if (response.ok) {
        return res;
    } else {
        throw res;
    }
}

// Secretary reject Student Start Request 
async function secretaryRejectStartRequest(startReqId) {
    const response = await fetch(URL + `/secretary-clerk/thesis-start-requests/reject/${startReqId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });
    const res = await response.json();
    if (response.ok) {
        return res;
    } else {
        throw res;
    }
}

// Insert Thesis Start Request
async function insertThesisStartRequest(request) {
    let response = await fetch(URL + '/student/thesis-start-requests', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(request),
    });
    const res = await response.json();
    if (response.ok) {
        return res;
    } else {
        throw res;
    }
}

// GET Student's last Thesis Start Request
async function getStudentLastThesisStartRequest() {
    const response = await fetch(URL + '/student/thesis-start-requests/last', {
        method: 'GET',
        credentials: 'include',
    });
    const tsr = await response.json();
    if (response.ok) {
        return tsr;
    } else {
        throw tsr;
    }
}

// GET Teacher's active Thesis Start Request
async function getTeacherThesisStartRequest() {
    const response = await fetch(URL + '/teacher/thesis-start-requests', {
        method: 'GET',
        credentials: 'include',
    });
    const tsr = await response.json();
    if (response.ok) {
        return tsr.items;
    } else {
        throw tsr;
    }
}

// Teacher accept Student Thesis Start Request
async function acceptThesisStartRequest(tsrId) {
    const response = await fetch(URL + `/teacher/thesis-start-requests/${tsrId}/review`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            action: "accept",
        }),
    });
    const tsr = await response.json();
    if (response.ok) {
        return tsr;
    } else {
        throw tsr;
    }
}

// Teacher reject Student Thesis Start Request
async function rejectThesisStartRequest(tsrId) {
    const response = await fetch(URL + `/teacher/thesis-start-requests/${tsrId}/review`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            action: "reject",
        }),
    });
    const tsr = await response.json();
    if (response.ok) {
        return tsr;
    } else {
        throw tsr;
    }
}

// Teacher request Changes on a Student Thesis Start Request
async function reviewThesisStartRequest(tsrId, requestedChanges) {
    const response = await fetch(URL + `/teacher/thesis-start-requests/${tsrId}/review`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            action: "request changes",
            changes: requestedChanges,
        }),
    });
    const tsr = await response.json();
    if (response.ok) {
        return tsr;
    } else {
        throw tsr;
    }
}

/****** Other APIs ******/

// GET External Co-Supervisors
async function getExtCoSupervisors() {
    const response = await fetch(URL + '/externalCoSupervisors', {
        method: 'GET',
        credentials: 'include'
    });
    const coSup = await response.json();
    if (response.ok) {
        return coSup;
    } else {
        throw coSup;
    }
}

//GET Teacher List
async function getTeachers() {
    const response = await fetch(URL + '/teachers', {
        method: 'GET',
        credentials: 'include'
    });
    const teachers = await response.json();
    if (response.ok) {
        return teachers;
    } else {
        throw teachers;
    }
}

//GET All Keywords
async function getAllKeywords() {
    const response = await fetch(URL + '/keywords', {
        method: 'GET',
        credentials: 'include'
    });
    const keywords = await response.json();
    if (response.ok) {
        return keywords;
    } else {
        throw keywords;
    }
}

//GET All Degrees
async function getAllDegrees() {
    const response = await fetch(URL + '/degrees', {
        method: 'GET',
        credentials: 'include'
    });
    const degrees = await response.json();
    if (response.ok) {
        return degrees;
    } else {
        throw degrees;
    }
}

// GET Student CV
async function getStudentCVById(id) {
    const response = await fetch(URL + `/student/${id}/career`, {
        method: 'GET',
        credentials: 'include',
    });
    const career = await response.json();
    if (response.ok) {
        return career.map((x) => ({
            code: x.cod_course,
            teaching: x.title_course,
            cfu: x.cfu,
            mark: x.grade,
            date: x.date,
        })).sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
        throw career;
    }
}

// getPDF
async function getPDF(student_id, applicationId) {
    const response = await fetch(URL + `/teacher/uploads/${student_id}/${applicationId}`, {
        method: 'GET',
        credentials: 'include',
    });
    if (response.ok) {
        const file = await response.blob();
        if (file.type === "application/pdf")
            return file;
        return null;
    } else {
        throw response.json();
    }
}

const API = {
    logOut, redirectToLogin, 
    getUser,
    getClock, updateClock,
    insertProposal, getExtCoSupervisors, getTeachers, getAllKeywords, getAllDegrees, 
    getThesisProposals, getThesisProposalbyId, getTeacherThesisApplications,
    applyForProposal, getStudentActiveApplication, 
    acceptThesisApplications, rejectThesisApplications, getStudentApplicationsHistory, 
    deleteProposalById, updateProposal, archiveProposalById, 
    getStudentCVById, getPDF,
    insertThesisStartRequest, getStudentLastThesisStartRequest, getTeacherThesisStartRequest, getSecretaryStartRequest,
    secretaryAcceptStartRequest, secretaryRejectStartRequest,
    acceptThesisStartRequest, rejectThesisStartRequest, reviewThesisStartRequest, 
    getArchivedThesisProposals, publishProposalById, 
};
export default API;
