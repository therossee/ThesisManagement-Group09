// API URL Endpoint
const URL = 'http://localhost:3000/api';


/****** APIs for auth ******/

async function logIn(credentials) {
    let response = await fetch(URL + '/sessions', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user;
    } else {
        const errDetail = await response.json();
        throw errDetail;
    }
}

async function logOut() {
    await fetch(URL + '/sessions/current', {
        method: 'DELETE',
        credentials: 'include'
    });
}

async function getUserInfo() {
    const response = await fetch(URL + '/sessions/current', {
        credentials: 'include'
    });
    const userInfo = await response.json();
    if (response.ok) {
        return userInfo;
    } else {
        throw userInfo;
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
        credentials: 'include',
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

async function applyForProposal(id) {
    const response = await fetch(URL + '/student/applications', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ thesis_proposal_id: id }),
    });
    if (response.ok) {
        const apply = await response.json();
        console.log(apply);
        return apply;
    } else {
        const errDetail = await response.json();
        throw { status: response.status, message: errDetail };
    }
}

// GET Student's Thesis Applications
async function getStudentActiveApplication() {
    const response = await fetch(URL + '/student/active-application', {
        credentials: 'include',
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
        credentials: 'include',
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

async function insertProposal(proposal) {
    let response = await fetch(URL + '/teacher/thesis_proposals', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
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

async function getExtCoSupervisors() {
    const response = await fetch(URL + '/externalCoSupervisors', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
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
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
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
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
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
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
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
async function acceptThesisApplications(proposalId, studentId) {
    const response = await fetch(URL + `/teacher/applications/accept/${proposalId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
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
async function rejectThesisApplications(proposalId, studentId) {
    const response = await fetch(URL + `/teacher/applications/reject/${proposalId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
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



const API = {
    logIn, logOut, getUserInfo,
    getClock, updateClock,
    insertProposal, getExtCoSupervisors, getTeachers, getAllKeywords, getAllDegrees, getThesisProposals, getThesisProposalbyId, getTeacherThesisApplications,
    applyForProposal, getStudentActiveApplication, acceptThesisApplications, rejectThesisApplications
};
export default API;
