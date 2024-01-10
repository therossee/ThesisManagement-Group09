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


/****** End APIs for auth ******/

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

// GET Thesis Proposals
async function getThesisProposals() {
    const response = await fetch(URL + '/thesis-proposals', {
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
            cds: x.cds
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

async function getSecretaryStartRequest(proposalId) {
    const response = await fetch(URL + `/secretary/startrequests/${proposalId}`, {
        method: 'GET',
        credentials: 'include'
    });

    const startRequests = await response.json();

    if (response.ok) {
        return startRequests.map((x) => ({
            name: x.name,
            surname: x.surname,
            status: x.status,
            application_id: x.application_id,
            id: x.id
        }));
    } else {
        throw startRequests;
    }
}

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



// Accept Student Applications on a Thesis Proposal 
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

// Reject Student Applications on a Thesis Proposal 
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
    insertProposal, getExtCoSupervisors, getTeachers, getAllKeywords, getAllDegrees, getThesisProposals, getThesisProposalbyId, getTeacherThesisApplications,
    applyForProposal, getStudentActiveApplication, acceptThesisApplications, rejectThesisApplications, getStudentApplicationsHistory, deleteProposalById, updateProposal, archiveProposalById, getStudentCVById, getPDF, getSecretaryStartRequest
};
export default API;
