// API URL Endpoint
const URL = 'http://localhost:3000/api';

/****** APIs for auth ******/

async function getUserInfo(token) {
    return new Promise((resolve, reject) => {
        fetch(URL + '/user', {
            headers: {
                Method: 'GET',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (response.ok) {
                    response
                        .json()
                        .then((user) => resolve(user))
                        .catch(() => {
                            reject({ message: 'Cannot parse server response.' });
                        });
                } else {
                    response
                        .json()
                        .then((message) => {
                            reject(message);
                        })
                        .catch(() => {
                            reject({ message: 'Cannot parse server response.' });
                        });
                }
            })
            .catch(() => reject({ message: 'Cannot communicate with the server.' }));
    });
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
async function getThesisProposals(accessToken) {
    const response = await fetch(URL + '/thesis-proposals', {
        headers: {
            Method: 'GET',
            Authorization: `Bearer ${accessToken}`,
        },
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
async function getThesisProposalbyId(id, accessToken) {
    const response = await fetch(URL + `/thesis-proposals/${id}`, {
        headers: {
            Method: 'GET',
            Authorization: `Bearer ${accessToken}`,
        },
        headers: {
            Method: 'GET',
            Authorization: `Bearer ${accessToken}`,
        },
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

async function applyForProposal(id, accessToken) {
    const response = await fetch(URL + '/student/applications', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ thesis_proposal_id: id }),
    });
    if (response.ok) {
        const apply = await response.json();
        return apply;
    } else {
        const errDetail = await response.json();
        throw { status: response.status, message: errDetail };
    }
}

// GET Student's Thesis Applications
async function getStudentActiveApplication(accessToken) {
    const response = await fetch(URL + '/student/active-application', {
        headers: {
            Method: 'GET',
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const applications = await response.json();
    if (response.ok) {
        return applications.map(x => x.proposal_id);
    } else {
        throw applications;
    }
}

// GET Student Applications on a Thesis Proposal of a Teacher
async function getTeacherThesisApplications(proposalId, accessToken) {
    const response = await fetch(URL + `/teacher/applications/${proposalId}`, {
        headers: {
            Method: 'GET',
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const applications = await response.json();

    if (response.ok) {
        return applications.map((x) => ({
            name: x.name,
            surname: x.surname,
            status: x.status,
            id: x.id
        }));
    } else {
        throw applications;
    }
}

async function insertProposal(proposal, accessToken) {
    let response = await fetch(URL + '/teacher/thesis_proposals', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(proposal),
    });
    if (response.ok) {
        const prop = await response.json();
        return prop;
    } else {
        const errDetail = await response.json();
        throw { status: response.status, msg: errDetail };
    }
}

async function getExtCoSupervisors(accessToken) {
    const response = await fetch(URL + '/externalCoSupervisors', {
        headers: {
            Method: 'GET',
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const coSup = await response.json();
    if (response.ok) {
        return coSup;
    } else {
        throw coSup;
    }
}

async function getTeachers(accessToken) {
    const response = await fetch(URL + '/teachers', {
        headers: {
            Method: 'GET',
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const teachers = await response.json();
    if (response.ok) {
        return teachers;
    } else {
        throw teachers;
    }
}

async function getAllKeywords(accessToken) {
    const response = await fetch(URL + '/keywords', {
        headers: {
            Method: 'GET',
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const keywords = await response.json();
    if (response.ok) {
        return keywords;
    } else {
        throw keywords;
    }
}

async function getAllDegrees(accessToken) {
    const response = await fetch(URL + '/degrees', {
        headers: {
            Method: 'GET',
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const degrees = await response.json();
    if (response.ok) {
        return degrees;
    } else {
        throw degrees;
    }
}



// Accept Student Applications on a Thesis Proposal 
async function acceptThesisApplications(proposalId, studentId, accessToken) {
    const response = await fetch(URL + `/teacher/applications/accept/${proposalId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            student_id: studentId,
        }),
    });
    const res = await response.json();
    if (response.ok) {
        return res;
    } else {
        throw res;
    }
}

// Reject Student Applications on a Thesis Proposal 
async function rejectThesisApplications(proposalId, studentId, accessToken) {
    const response = await fetch(URL + `/teacher/applications/reject/${proposalId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            student_id: studentId,
        }),
    });
    const res = await response.json();
    if (response.ok) {
        return res;
    } else {
        throw res;
    }
}

async function getStudentApplicationsHistory(accessToken) {
    const response = await fetch(URL + '/student/applications-decision', {
        headers: {
            Method: 'GET',
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const applications = await response.json();
    if (response.ok) {
        return applications.map((x) => ({
            title: x.title,
            teacherName: x.teacher_surname + " " + x.teacher_name,
            status: x.status,
        }))
    } else {
        throw proposals;
    }
}

async function deleteProposalById(id, accessToken) {
    const response = await fetch(URL +  `/thesis-proposals/${id} `, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (response.ok) {
        return response; 
    } else {
        throw response;
    }
}

async function updateProposal(id, proposal, accessToken) {
    const response = await fetch(URL + `/thesis-proposals/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(proposal),
    });
    const update = await response.json();
    if (response.ok) {
        return update;
    }
    else {
        throw update;
    }
}

const API = {
    getUserInfo,
    getClock, updateClock,
    insertProposal, getExtCoSupervisors, getTeachers, getAllKeywords, getAllDegrees, getThesisProposals, getThesisProposalbyId, getTeacherThesisApplications,
    applyForProposal, getStudentActiveApplication, acceptThesisApplications, rejectThesisApplications, getStudentApplicationsHistory, deleteProposalById, updateProposal
};
export default API;
