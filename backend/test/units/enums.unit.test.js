require('jest');
// Import the modules
const user = require('../../src/enums/user');
const application = require('../../src/enums/application');
const thesisStartRequest = require('../../src/enums/thesisStartRequest');
const index = require('../../src/enums/index');

describe('Aggregated Modules', () => {
  // Test for the user module
  describe('User Module', () => {
    test('should have the required functions', () => {
        // Check if the constant is defined
        expect(user.USER_ROLES).toBeDefined();

        // Check if the constant has the expected properties
        expect(user.USER_ROLES.STUDENT).toBe('student');
        expect(user.USER_ROLES.TEACHER).toBe('teacher');
        expect(user.USER_ROLES.TESTER).toBe('tester');
        expect(user.USER_ROLES.SECRETARY_CLERK).toBe('secretary clerk');
    });
  });

  // Test for the application module
  describe('Application Module', () => {
    test('should have the required functions', () => {
        // Check if the constant is defined
        expect(application.APPLICATION_STATUS).toBeDefined();

        // Check if the constant has the expected properties
        expect(application.APPLICATION_STATUS.ACCEPTED).toBe('accepted');
        expect(application.APPLICATION_STATUS.REJECTED).toBe('rejected');
        expect(application.APPLICATION_STATUS.WAITING_FOR_APPROVAL).toBe('waiting for approval');
        expect(application.APPLICATION_STATUS.CANCELLED).toBe('cancelled');
      
    });
  });

  // Test for the thesisStartRequest module
  describe('Thesis Start Request Module', () => {
    test('should have the required functions', () => {
        // Check if the constant is defined
        expect(thesisStartRequest.THESIS_START_REQUEST_STATUS).toBeDefined();

        // Check if the constant has the expected properties
        expect(thesisStartRequest.THESIS_START_REQUEST_STATUS.WAITING_FOR_APPROVAL).toBe('waiting for approval');
        expect(thesisStartRequest.THESIS_START_REQUEST_STATUS.ACCEPTED_BY_TEACHER).toBe('accepted by teacher');
        expect(thesisStartRequest.THESIS_START_REQUEST_STATUS.REJECTED_BY_TEACHER).toBe('rejected by teacher');
        expect(thesisStartRequest.THESIS_START_REQUEST_STATUS.ACCEPTED_BY_SECRETARY).toBe('accepted by secretary');
        expect(thesisStartRequest.THESIS_START_REQUEST_STATUS.REJECTED_BY_SECRETARY).toBe('rejected by secretary');
        expect(thesisStartRequest.THESIS_START_REQUEST_STATUS.CHANGES_REQUESTED).toBe('changes requested');

    });
  });

  // Test for the aggregated object
  describe('Aggregated Object', () => {
    test('should include functions from user, application, and thesisStartRequest modules', () => {
        // Check if the aggregated object includes functions from all modules
        expect(index.USER_ROLES).toBeDefined();
        expect(index.APPLICATION_STATUS).toBeDefined();
        expect(index.THESIS_START_REQUEST_STATUS).toBeDefined();
    });
  });
});
