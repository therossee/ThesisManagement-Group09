require('jest');
const request = require("supertest");
const service = require("../users_dao");
const {app, server} = require("../index");
const passport = require('passport');

jest.mock('../users_dao', () => ({
  getUser: jest.fn(),
}));

describe('Integration Tests for Authentication APIs', () => {
    afterAll((done) => {
      jest.resetAllMocks();
      server.close(done);
    }); 
    test('should return 401 for an unsuccessful  (inexistent user)', async () => {
        const response = await request(app)
          .post('/api/sessions')
          .send({ username: 'invalid@example.com', password: 'invalidPassword' })
          .set('Accept', 'application/json');
    
        expect(response.status).toBe(401);
        expect(response.body).toEqual('Incorrect email and/or password');
    });
    test('should return 401 for an unsuccessful  (wrong password)', async () => {
          const response = await request(app)
            .post('/api/sessions')
            .send({ username: 'fontana.caldo@email.com', password: 'invalidPassword' })
            .set('Accept', 'application/json');
      
          expect(response.status).toBe(401);
          expect(response.body).toEqual('Incorrect email and/or password');
    });
    test('should return 201 for a successful login of a student', async () => {
      service.getUser.mockResolvedValue(
        { 
          id: 's1',
          surname: 'C',
          name: 'A',
          gender: 'MALE',
          nationality: 'It',
          email: 'c.a@email.com', 
          cod_degree: 'LM-1',
          enrollment_year: 2021
        }
      );

        const response = await request(app)
          .post('/api/sessions')
          .send({ username: 'c.a@email.com', password: 's1' })
          .set('Accept', 'application/json');
    
        expect(response.status).toBe(201);
        expect(response.body).toEqual(
          {
            id: 's1',
            surname: 'C',
            name: 'A',
            gender: 'MALE',
            nationality: 'It',
            email: 'c.a@email.com', 
            cod_degree: 'LM-1',
            enrollment_year: 2021
          }
        )
    });
    test('should return 201 for a successful login of a teacher', async () => {
      service.getUser.mockResolvedValue(
        { 
          id: 'd1',
          surname: 'R',					
          name: 'M',
          email: 'r.m@email.com', 
          cod_group: 'Group1',
          cod_department: 'Dep1'
        }
      );
      const response = await request(app)
        .post('/api/sessions')
        .send({ username: 'r.m@email.com', password: 'd1' })
        .set('Accept', 'application/json');
  
      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        {
          id: 'd1',
          surname: 'R',					
          name: 'M',
          email: 'r.m@email.com', 
          cod_group: 'Group1',
          cod_department: 'Dep1'
        }
      )
    });
    test('should return 200 for the current logged user', async () => {
      service.getUser.mockResolvedValue(
        { 
          id: 's1',
          surname: 'C',
          name: 'A',
          gender: 'MALE',
          nationality: 'It',
          email: 'c.a@email.com', 
          cod_degree: 'LM-1',
          enrollment_year: 2021
        }
      );

        const loginResponse = await request(app)
          .post('/api/sessions')
          .send({ username: 'c.a@email.com', password: 's1' })
          .set('Accept', 'application/json')

        expect(loginResponse.status).toBe(201);
        // Check if cookies are present in the login response
        const cookies = loginResponse.headers['set-cookie'];
        expect(cookies).toBeDefined();

        const response = await request(app)
          .get('/api/sessions/current')
          .set('Accept', 'application/json')
          .set('Cookie', loginResponse.headers['set-cookie']);
    
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
          { 
            id: 's1',
            surname: 'C',
            name: 'A',
            gender: 'MALE',
            nationality: 'It',
            email: 'c.a@email.com', 
            cod_degree: 'LM-1',
            enrollment_year: 2021
          }
        );        
    });
    test('should return an error for an authentication failure', async () => {
      const authenticateSpy = jest.spyOn(passport, 'authenticate');
      authenticateSpy.mockImplementation((strategy, callback) => {
          const err = new Error('Authentication failed');
          return (req, res, next) => callback(err, null, null, next);
      });

      const response = await request(app)
          .post('/api/sessions')
          .send({ username: 'invalid@example.com', password: 'invalidPassword' })
          .set('Accept', 'application/json');

      expect(response.status).toBe(500); 
      
      authenticateSpy.mockRestore();
    });
    test('should return 204 for a successful logout', async () => {
        const logoutResponse = await request(app)
          .delete('/api/sessions/current')
          .set('Accept', 'application/json');
    
        expect(logoutResponse.status).toBe(204);
    
        // Verify that the user is no longer authenticated
        const getCurrentUserResponse = await request(app)
          .get('/api/sessions/current')
          .set('Accept', 'application/json');
    
        expect(getCurrentUserResponse.status).toBe(401);
        expect(getCurrentUserResponse.body).toEqual('Not authenticated');
    });
});
