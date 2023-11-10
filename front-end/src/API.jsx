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
        const errDetail = await response.text(); // return value is not an object but just a string!
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

const API = {
    logIn, logOut, getUserInfo
};
export default API;