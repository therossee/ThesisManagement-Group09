const request = require('supertest');
const {app} = require('../app');

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

module.exports = {
    getMarcoRossiAgent,
    getMolinattoSylvieAgent,
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
