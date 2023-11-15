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

// GET Student's Thesis Proposals
async function getStudentThesisProposals() {
    const response = await fetch(URL + '/thesis-proposals', {
        credentials: 'include',
    });
    const proposals = await response.json();
    if (response.ok) {
        return proposals.items.map((x) => ({
            id: x.id,
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

const API = {
    logIn, logOut, getUserInfo, getStudentThesisProposals, getThesisProposalbyId
};
export default API;