const request = require('supertest');

const agents = {};

/**
 * Return a supertest agent logged as Marco Rossi (teacher + tester).
 *
 * @param {import('express').Express} app
 */
async function getMarcoRossiAgent(app) {
    return _getAgent(app, 'd279620', 'Marco Rossi', 'teacher,tester');
}

/**
 * Return a supertest agent logged as Molinatto Sylvie (student).
 *
 * @param {import('express').Express} app
 * @param {boolean} includeRoles
 */
async function getMolinattoSylvieAgent(app, includeRoles = true) {
    return _getAgent(app, 's318952', 'Sylvie Molinatto', includeRoles ? 'student' : '');
}

/**
 * Return a supertest agent logged as Rossi Abbondanzio (secretary clerk).
 *
 * @param {import('express').Express} app
 * @param {boolean} includeRoles
 */
async function getRossiAbbondanzioAgent(app, includeRoles = true) {
    return _getAgent(app, 'sc12345', 'Abbondanzio Rossi', includeRoles ? 'secretary clerk' : '');
}

/**
 * Return a supertest agent logged as a fake user with no roles.
 *
 * @param {import('express').Express} app
 * @param {boolean} includeRoles
 */
async function getFakeAgent(app, includeRoles = true) {
    return _getAgent(app, '11111', 'Fake Agent', includeRoles ? 'fake role' : '');
}

module.exports = {
    getMarcoRossiAgent,
    getMolinattoSylvieAgent,
    getRossiAbbondanzioAgent,
    getFakeAgent
};

async function _getAgent(app, id, name, roles) {
    if (agents[id]) {
        return agents[id];
    }

    const agent = request.agent(app);

    await agent.get('/login')
        .set('X-User-Id', id)
        .set('X-User-Name', name)
        .set('X-User-Roles', roles);
    agents[id] = agent;

    return agent;
}
