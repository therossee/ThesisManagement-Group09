const request = require('supertest');
const { app } = require('../app');

const agents = { };

async function getMarcoRossiAgent() {
    const id = 'd279620';
    if (agents[id]) {
        return agents[id];
    }

    const agent = request.agent(app);

    await agent.get('/login')
        .set('X-User-Id', id)
        .set('X-User-Name', 'Marco Rossi')
        .set('X-User-Roles', 'teacher,tester');
    agents[id] = agent;

    return agent;
}

module.exports = {
    getMarcoRossiAgent
};
