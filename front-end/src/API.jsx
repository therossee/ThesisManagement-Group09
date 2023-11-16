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
        .then( async response => {
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
        .then( async response => {
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

// GET Student's Thesis Proposals
async function getStudentThesisProposals() {
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
            internalCoSupervisors: x.coSupervisors.internal,
            externalCoSupervisors: x.coSupervisors.external,
            type: x.type,
            description: x.description,
            requiredKnowledge: x.requiredKnowledge,
            notes: x.notes,
            expiration: x.expiration,
            level: x.level,
            groups: x.groups,
            keywords: x.keywords
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
            expiration: thesisProposal.expiration,
            level: thesisProposal.level,
            groups: thesisProposal.groups,
            keywords: thesisProposal.keywords
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
        body: JSON.stringify({thesis_proposal_id: id}),
    });
    if (response.ok) {
        const apply = await response.json();
        console.log(apply);
        return apply;
    } else {
        const errDetail = await response.json();
        throw {status: response.status, msg: errDetail};
    }
}

// GET Student's Thesis Applications
async function getStudentApplications() {
    const response = await fetch(URL + '/student/applications', {
        credentials: 'include',
    });
    const applications = await response.json();
    if (response.ok) {
        return applications.map(x => x.proposal_id);
    } else {
        throw applications;
    }
}

// GET Thesis Proposals of a Teacher
async function getTeacherThesisProposals() {
    const response = await fetch(URL + '/teacher/thesis_proposals', {
        credentials: 'include',
    });
    const proposals = await response.json();
    if (response.ok) {
        return proposals.map((x) => ({
            id: x.proposal_id,
            title: x.title,
            supervisor: x.supervisor_id,
            type: x.type,
            description: x.description,
            requiredKnowledge: x.required_knowledge,
            notes: x.notes,
            expiration: x.expiration,
            level: x.level,
            cds: x.cds
        }))
    } else {
        throw proposals;
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
            status: x.status
        }));
    } else {
        throw applications;
    }
}

const API = {
    logIn, logOut, getUserInfo,
    getClock, updateClock,
    getStudentThesisProposals, getThesisProposalbyId, getTeacherThesisProposals, getTeacherThesisApplications,
    applyForProposal, getStudentApplications
};
export default API;
