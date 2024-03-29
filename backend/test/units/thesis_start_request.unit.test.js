require('jest');

/**
 * Tests on the whole thesis start request management
 */

const db = require('../../src/services/db');
const thesis_start_request = require('../../src/dao/thesis_start_request_dao');
const {THESIS_START_REQUEST_STATUS} = require("../../src/enums/thesisStartRequest");
const UnauthorizedActionError = require('../../src/errors/UnauthorizedActionError');
const NoThesisStartRequestError = require('../../src/errors/NoThesisStartRequestError');
const AdvancedDate = require('../../src/models/AdvancedDate');
const AppError = require('../../src/errors/AppError');

// Mocking the database
jest.mock('../../src/services/db', () => ({
    prepare: jest.fn().mockReturnThis(),
    get: jest.fn(),
    run: jest.fn(),
    all: jest.fn(),
    transaction: jest.fn().mockImplementation(callback => callback),
}));

jest.mock('../../src/dao/configuration_dao', () => ({
    getIntegerValue: jest.fn().mockReturnValue(0),
    setValue: jest.fn(),
    KEYS: {
        VIRTUAL_OFFSET_MS: 'virtual_clock_offset'
    }
}));

afterEach(() => {
    jest.restoreAllMocks(); // Restore original functionality after all tests
    jest.clearAllMocks();
});

describe('createThesisStartRequest', () => {
    test('handles unauthorized action error if student already has a request', async () => {

      db.prepare().get.mockReturnValueOnce({ proposal_id: 3, cod_degree: 'LM-31'});

      // Assertions for rejected promise with UnauthorizedActionError
      await expect(
        thesis_start_request.createThesisStartRequest(
            's320213',
            1,
            3,
            'title',
            'description',
            'd279620',
            ['']
        )
      ).rejects.toThrowError(new UnauthorizedActionError('The student has already a thesis start request'));

      // Assertions for database interactions
      expect(db.transaction).not.toHaveBeenCalled();
    });

    test('handles unauthorized action error if proposal doesn\'t belong to the same cds of the student', async () => {

        db.prepare().get.mockReturnValueOnce();
        db.prepare().get.mockReturnValueOnce();

        // Assertions for rejected promise with UnauthorizedActionError
        await expect(
          thesis_start_request.createThesisStartRequest(
              's320213',
              1,
              3,
              'title',
              'description',
              'd279620',
              ['']
          )
        ).rejects.toThrowError(new UnauthorizedActionError('The proposal doesn\'t belong to the student degree'));

        // Assertions for database interactions
        expect(db.transaction).not.toHaveBeenCalled();
    });

    test('creates a thesis start request not related to an application', async () => {

        db.prepare().get.mockReturnValueOnce();
        db.prepare().run.mockReturnValueOnce({lastInsertRowid: 1});
        db.prepare().run.mockReturnValueOnce({});

        const requestId = await thesis_start_request.createThesisStartRequest(
          's318952',
          'title',
          'description',
          'd279620',
          ['']
        );

        expect(requestId).toBe(1);
        expect(db.transaction).toHaveBeenCalled();

    });

    test('creates a thesis start request with all parameters', async () => {

        db.prepare().get.mockReturnValueOnce();
        db.prepare().get.mockReturnValueOnce({ proposal_id: 2, cod_degree: 'LM-31'});
        db.prepare().run.mockReturnValueOnce({lastInsertRowid: 1});
        db.prepare().run.mockReturnValueOnce({});

        const requestId = await thesis_start_request.createThesisStartRequest(
          's318952',
          1,
          2,
          'title',
          'description',
          'd279620',
          ['d370335']
        );

        expect(requestId).toBe(1);
        expect(db.transaction).toHaveBeenCalled();
    });
});

describe('getStudentLastThesisStartRequest', () => {

  test('returns the last thesis start request for the student', async () => {

    db.prepare().get.mockReturnValueOnce(
      {
        id: 1,
        title: 'Title 1',
        student_id: 's318952',
        description: 'Description 1',
        supervisor_id: 'd279620',
        creation_date: '2021-01-01T00:00:00.000Z',
        approval_date: null,
        status: THESIS_START_REQUEST_STATUS.WAITING_FOR_APPROVAL,
        changes_requested: null
      }
    );

    db.prepare().all.mockReturnValueOnce([{ cosupervisor_id: 'd370335' }]);

    const studentId = 's318952';
    const result = await thesis_start_request.getStudentLastThesisStartRequest(studentId);

    const expectedQuery = `SELECT * FROM thesisStartRequest WHERE student_id=? AND creation_date < ? ORDER BY creation_date DESC LIMIT 1;`;
    expect(db.prepare).toHaveBeenCalledWith(expectedQuery);

    expect(result).toEqual(
      {
        id: 1,
        title: 'Title 1',
        student_id: 's318952',
        description: 'Description 1',
        supervisor_id: 'd279620',
        co_supervisors: ['d370335'],
        creation_date: '2021-01-01T00:00:00.000Z',
        approval_date: null,
        status: THESIS_START_REQUEST_STATUS.WAITING_FOR_APPROVAL,
        changes_requested: null
      }
    );
  });

  test('returns no thesis start requests for the student', async () => {

    db.prepare().get.mockReturnValueOnce(undefined);

    const studentId = 's318952';
    const result = await thesis_start_request.getStudentLastThesisStartRequest(studentId);

    const expectedQuery = `SELECT * FROM thesisStartRequest WHERE student_id=? AND creation_date < ? ORDER BY creation_date DESC LIMIT 1;`;
    expect(db.prepare).toHaveBeenCalledWith(expectedQuery);

    expect(result).toEqual(null);
  });

});

describe('listThesisStartRequests', () => {

  test('should return all thesis start requests if no supervisor is provided', async () => {

    db.prepare().all.mockReturnValueOnce([
      {
        id: 1,
        title: 'Title 1',
        student_id: 's318952',
        description: 'Description 1',
        supervisor_id: 'd279620',
        creationdate: '2021-01-01T00:00:00.000Z',
        approval_date: null,
        status: THESIS_START_REQUEST_STATUS.WAITING_FOR_APPROVAL,
        changes_requested: null
      }
    ]);

    db.prepare().all.mockReturnValueOnce([{ cosupervisor_id: 'd370335' }])

    const result = await thesis_start_request.listThesisStartRequests();

    const expectedQuery = `SELECT * FROM thesisStartRequest WHERE creation_date < ?`;
    expect(db.prepare).toHaveBeenCalledWith(expectedQuery);

    expect(result).toEqual([
      {
        id: 1,
        title: 'Title 1',
        student_id: 's318952',
        description: 'Description 1',
        supervisor_id: 'd279620',
        co_supervisors: [
          'd370335'
        ],
        creationdate: '2021-01-01T00:00:00.000Z',
        approval_date: null,
        status: THESIS_START_REQUEST_STATUS.WAITING_FOR_APPROVAL,
        changes_requested: null
      }
    ]);
  });

  test('should return only some of the thesis start requests of the teacher if supervisor is provided', async() => {
    
    const supervisorId = 'd12345';

    db.prepare().all.mockReturnValueOnce([
      {
        id: 1,
        title: 'Title 1',
        student_id: 's318952',
        description: 'Description 1',
        supervisor_id: 'd12345',
        creationdate: '2021-01-01T00:00:00.000Z',
        approval_date: null,
        status: THESIS_START_REQUEST_STATUS.ACCEPTED_BY_SECRETARY,
        changes_requested: null
      },
      {
        id: 2,
        title: 'Title 2',
        student_id: 's123456',
        description: 'Description 2',
        supervisor_id: 'd12345',
        creationdate: '2021-01-01T00:00:00.000Z',
        approval_date: null,
        status: THESIS_START_REQUEST_STATUS.REJECTED_BY_SECRETARY,
        changes_requested: null
      }
    ]);

    db.prepare().all.mockReturnValueOnce([{ cosupervisor_id: 'd370335' }]);
    db.prepare().all.mockReturnValueOnce([{ cosupervisor_id: 'd370335' }]);

    const result = await thesis_start_request.listThesisStartRequests(supervisorId);

    const expectedQuery = `SELECT * FROM thesisStartRequest WHERE creation_date < ? AND supervisor_id = ? AND status NOT IN (?, ?)`;
    expect(db.prepare).toHaveBeenCalledWith(expectedQuery);
    expect(result).toEqual([
      {
        id: 1,
        title: 'Title 1',
        student_id: 's318952',
        description: 'Description 1',
        supervisor_id: 'd12345',
        co_supervisors: ['d370335'],
        creationdate: '2021-01-01T00:00:00.000Z',
        approval_date: null,
        status: THESIS_START_REQUEST_STATUS.ACCEPTED_BY_SECRETARY,
        changes_requested: null
      },
      {
        id: 2,
        title: 'Title 2',
        student_id: 's123456',
        description: 'Description 2',
        supervisor_id: 'd12345',
        co_supervisors: ['d370335'],
        creationdate: '2021-01-01T00:00:00.000Z',
        approval_date: null,
        status: THESIS_START_REQUEST_STATUS.REJECTED_BY_SECRETARY,
        changes_requested: null
      }
    ]);
  });

});

describe('getThesisStartRequestById', () => {
  test('should fetch the thesis start request and its co-supervisors', async () => {
    const request_id = 1;
    const mockThesisStartRequest = {
      id: 1,
      student_id: 's318952',
      supervisor_id: 'd279620',
      title: 'Title 1',
      description: 'Description 1',
      creation_date: '2021-01-01T00:00:00.000Z',
      approval_date: null,
      status: THESIS_START_REQUEST_STATUS.WAITING_FOR_APPROVAL,
      changes_requested: null
    };
    const mockCoSupervisors = [{ cosupervisor_id: 'cosupervisor1' }, { cosupervisor_id: 'cosupervisor2' }];

    // Mock the behavior of the database
    db.prepare().get.mockReturnValueOnce(mockThesisStartRequest);
    db.prepare().all.mockReturnValueOnce(mockCoSupervisors);

    const result = await thesis_start_request.getThesisStartRequestById(request_id);

    // Verify that the queries were prepared with the correct parameters
    const expectedThesisQuery = `SELECT * FROM thesisStartRequest WHERE id = ? AND creation_date < ?`;
    const expectedCoSupervisorsQuery = 'SELECT cosupervisor_id FROM thesisStartCosupervisor WHERE start_request_id=?';
    expect(db.prepare).toHaveBeenCalledWith(expectedThesisQuery);
    expect(db.prepare).toHaveBeenCalledWith(expectedCoSupervisorsQuery);

    // Verify that the function resolves with the expected result
    const expectedResolvedResult = { ...mockThesisStartRequest, co_supervisors: mockCoSupervisors.map(entry => entry.cosupervisor_id) };
    expect(result).toEqual(expectedResolvedResult);
  });

  test('should fetch the thesis start request and an empty array of co-supervisors', async () => {
    const request_id = 1;
    const mockThesisStartRequest = {
      id: 1,
      student_id: 's318952',
      supervisor_id: 'd279620',
      title: 'Title 1',
      description: 'Description 1',
      creation_date: '2021-01-01T00:00:00.000Z',
      approval_date: null,
      status: THESIS_START_REQUEST_STATUS.WAITING_FOR_APPROVAL,
      changes_requested: null
    };
    const mockCoSupervisors = undefined;

    // Mock the behavior of the database
    db.prepare().get.mockReturnValueOnce(mockThesisStartRequest);
    db.prepare().all.mockReturnValueOnce(mockCoSupervisors);

    const result = await thesis_start_request.getThesisStartRequestById(request_id);

    // Verify that the queries were prepared with the correct parameters
    const expectedThesisQuery = `SELECT * FROM thesisStartRequest WHERE id = ? AND creation_date < ?`;
    const expectedCoSupervisorsQuery = 'SELECT cosupervisor_id FROM thesisStartCosupervisor WHERE start_request_id=?';
    expect(db.prepare).toHaveBeenCalledWith(expectedThesisQuery);
    expect(db.prepare).toHaveBeenCalledWith(expectedCoSupervisorsQuery);

    // Verify that the function resolves with the expected result
    const expectedResolvedResult = { ...mockThesisStartRequest, co_supervisors: []};
    expect(result).toEqual(expectedResolvedResult);
  });

  test('should handle the case where the thesis start request is not found', async () => {
    const request_id = 2;

    // Mock the behavior of the database to simulate an empty result for thesisStartRequest
    db.prepare().get.mockReturnValueOnce(undefined);

    const result = await thesis_start_request.getThesisStartRequestById(request_id);

    // Verify that the function resolves with the expected result (null)
    expect(result).toBeNull();
  });
});

describe('updateThesisStartRequestStatus', () => {
  test('should update the thesis start request status', async () => {
    const request_id = 1;
    const new_status = 'ACCEPTED';
    const expectedRowCount = 1;

    db.prepare().run.mockReturnValueOnce({changes: expectedRowCount});

    const result = await thesis_start_request.updateThesisStartRequestStatus(request_id, new_status);

    // Verify that the query was prepared with the correct parameters
    const expectedQuery = `UPDATE thesisStartRequest SET status = ? WHERE id = ?;`;
    expect(db.prepare).toHaveBeenCalledWith(expectedQuery);
    expect(db.prepare().run).toHaveBeenCalledWith(new_status, request_id);

    // Verify that the function resolves with the expected result
    expect(result).toBe(true); // Assuming changes property is 1, indicating success
  });

  test('should handle the case where the update operation fails', async () => {
    const request_id = 1;
    const new_status = 'REJECTED';

    db.prepare().run.mockReturnValue({ changes: 0 });

    const result = await thesis_start_request.updateThesisStartRequestStatus(request_id, new_status);

    expect(result).toBe(false);
  });
});

describe('supervisorReviewThesisStartRequest', () => {
  test('should update the status when the action is "accept"', async () => {
    
    const supervisorId = 'd12345';
    const tsrId = 1;
    const review = {
      action: 'accept',
    };

    db.prepare().run.mockReturnValueOnce({changes: 1});
  
    const result = await thesis_start_request.supervisorReviewThesisStartRequest(supervisorId, tsrId, review);

    expect(result).toBe(true);
    expect(db.prepare).toHaveBeenCalledWith(expect.any(String));
    expect(db.prepare().run).toHaveBeenCalledWith(
      THESIS_START_REQUEST_STATUS.ACCEPTED_BY_TEACHER,
      null,
      expect.stringContaining(new AdvancedDate().toISOString().substring(0, 10)),
      tsrId,
      supervisorId,
      THESIS_START_REQUEST_STATUS.ACCEPTED_BY_SECRETARY,
      THESIS_START_REQUEST_STATUS.CHANGES_REQUESTED
    );
  });

  test('should update the status when the action is "reject"', async () => {
    
    const supervisorId = 'd12345';
    const tsrId = 1;
    const review = {
      action: 'reject',
    };

    db.prepare().run.mockReturnValueOnce({changes: 1});
  
    const result = await thesis_start_request.supervisorReviewThesisStartRequest(supervisorId, tsrId, review);

    expect(result).toBe(true);
    expect(db.prepare).toHaveBeenCalledWith(expect.any(String));
    expect(db.prepare().run).toHaveBeenCalledWith(
      THESIS_START_REQUEST_STATUS.REJECTED_BY_TEACHER,
      null,
      null,
      tsrId,
      supervisorId,
      THESIS_START_REQUEST_STATUS.ACCEPTED_BY_SECRETARY,
      THESIS_START_REQUEST_STATUS.CHANGES_REQUESTED
    );
  });

  test('should update the status and changes when the action is "request changes"', async () => {
    const supervisorId = 'd12345';
    const tsrId = 1;
    const review = {
      action: 'request changes',
      changes: 'Some changes requested',
    };

    db.prepare().run.mockReturnValueOnce({changes: 1});
    
    const result = await thesis_start_request.supervisorReviewThesisStartRequest(supervisorId, tsrId, review);

    expect(result).toBe(true);
    expect(db.prepare).toHaveBeenCalledWith(expect.any(String));
    expect(db.prepare().run).toHaveBeenCalledWith(
      THESIS_START_REQUEST_STATUS.CHANGES_REQUESTED,
      review.changes,
      null,
      tsrId,
      supervisorId,
      THESIS_START_REQUEST_STATUS.ACCEPTED_BY_SECRETARY,
      THESIS_START_REQUEST_STATUS.CHANGES_REQUESTED
    );
  });

  test('should return false when no row is updated', async () => {
    
    const supervisorId = 'd12345';
    const tsrId = 'validTsrId';
    const review = {
      action: 'accept',
    };

    db.prepare().run.mockReturnValueOnce({changes: 0});

    const result = await thesis_start_request.supervisorReviewThesisStartRequest(supervisorId, tsrId, review);

    expect(result).toBe(false);
    expect(db.prepare).toHaveBeenCalledWith(expect.any(String));
    expect(db.prepare().run).toHaveBeenCalledWith(
      THESIS_START_REQUEST_STATUS.ACCEPTED_BY_TEACHER,
      null,
      expect.stringContaining(new AdvancedDate().toISOString().substring(0, 10)),
      tsrId,
      supervisorId,
      THESIS_START_REQUEST_STATUS.ACCEPTED_BY_SECRETARY,
      THESIS_START_REQUEST_STATUS.CHANGES_REQUESTED
    );
  });
});

describe('NoThesisStartRequestError', () => {
  test('should be an instance of AppError', () => {
    const error = new NoThesisStartRequestError(123);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
  });

  test('should have the correct message and status code', () => {
    const id = 456;
    const error = new NoThesisStartRequestError(id);
    expect(error.message).toBe(`No thesis start request with id ${id} found or you are not authorized to access it.`);
  });

  test('should stringify to the correct format', () => {
    const id = 'abc';
    const error = new NoThesisStartRequestError(id);
    const expectedString = `Error: No thesis start request with id ${id} found or you are not authorized to access it.`;
    expect(error.toString()).toBe(expectedString);
  });
});



