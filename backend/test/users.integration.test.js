require('jest');
// [i] This line setup the test database + load the environment variables. DON'T (RE)MOVE IT
const { resetTestDatabase } = require('./integration_config');

const request = require("supertest");
const { app } = require("../app");

// Mock Passport-SAML authenticate method
jest.mock('passport-saml', () => {
    const Strategy = jest.requireActual('passport-saml').Strategy;
    return {
      Strategy: class MockStrategy extends Strategy {
        authenticate(req, options) {
          const user = {
            id: 's318952',
            name: 'Sylvie Molinatto',
            roles: ['student'], 
          };
          this.success(user);
        }
      },
    };
});

beforeEach(() => {
    // Be sure that we are using a full clean database before each test
    resetTestDatabase();
});

beforeAll(async () => {
    agent = request.agent(app);
    await agent.get('/login');
});

describe('GET /users', () => {
    test('should return user information with valid authentication', async () => {
        // Make a request to the endpoint
        const response = await agent
            .get('/api/user')
            .set('credentials', 'include');

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toEqual({id: 's318952', name: 'Sylvie Molinatto', roles: ['student']});
    });

    test('should return 401 error with invalid authentication', async () => {
        // Make a request to the endpoint
        const response = await request(app)
            .get('/api/user')
            .set('credentials', 'include');

        // Assertions
        expect(response.status).toBe(401);
        expect(response.body).toBe('Unauthorized');
    });
});
