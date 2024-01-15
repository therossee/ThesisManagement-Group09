require('jest');
require('../integration_config');
const { CronJob } = require('cron');
const CronTasksService = require('../../src/services/CronTasksService');
const thesisApplicationDao = require('../../src/dao/thesis_application_dao');
const NotificationService = require('../../src/services/NotificationService');

jest.mock('cron');
jest.mock('../../src/dao/thesis_application_dao');
jest.mock('../../src/services/NotificationService');

describe('CronTasksService', () => {
  afterEach(() => {
    // Clear all mock calls after each test
    jest.clearAllMocks();
  });

  describe('init', () => {
    test('should cancel no expired thesis', async() => {
        // Mock the implementation of cancelWaitingApplicationsOnExpiredThesis
        thesisApplicationDao.cancelWaitingApplicationsOnExpiredThesis.mockResolvedValue([]);
        
        // Set up the cron job
        CronTasksService.init();

        // Trigger the cron job callback manually
        const mockCallback = CronJob.mock.calls[0][1];
        await mockCallback();

        // Ensure the cron job is set up correctly
        expect(CronJob).toHaveBeenCalledWith(
            '0 0 * * *',
            expect.any(Function),
            undefined,
            true,
            'utc',
            undefined,
            true,
        );
    });

    test('should cancel one expired thesis', async() => {
        // Mock the implementation of cancelWaitingApplicationsOnExpiredThesis
        thesisApplicationDao.cancelWaitingApplicationsOnExpiredThesis.mockResolvedValue([{
            student_id: 's318952',
            proposal_id: 1,
            status: 'WAITING FOR APPROVAL',
        }]);
        
        // Set up the cron job
        CronTasksService.init();

        // Trigger the cron job callback manually
        const mockCallback = CronJob.mock.calls[0][1];
        await mockCallback();

        // Ensure the cron job is set up correctly
        expect(CronJob).toHaveBeenCalledWith(
            '0 0 * * *',
            expect.any(Function),
            undefined,
            true,
            'utc',
            undefined,
            true,
        );
    });

    test('should handle an error', async() => {
        // Mock the implementation of cancelWaitingApplicationsOnExpiredThesis
        thesisApplicationDao.cancelWaitingApplicationsOnExpiredThesis.mockRejectedValue(new Error('Something went wrong'));
        
        // Set up the cron job
        CronTasksService.init();

        // Trigger the cron job callback manually
        const mockCallback = CronJob.mock.calls[0][1];
        await mockCallback();

        // Ensure the cron job is set up correctly
        expect(CronJob).toHaveBeenCalledWith(
            '0 0 * * *',
            expect.any(Function),
            undefined,
            true,
            'utc',
            undefined,
            true,
        );
    });
  });

  describe('stop', () => {
    test('should stop all cron jobs', () => {
      // Mock cron jobs
      CronTasksService._cronJobs = {
        THESIS_EXPIRED: new CronJob(),
        // Add more cron jobs if needed
      };

      // Call stop method
      CronTasksService.stop();

      // Ensure the stop method is called on each cron job
      for (const job of Object.values(CronTasksService._cronJobs)) {
        expect(job.stop).toHaveBeenCalled();
      }
    });
  });

  describe('fireJob', () => {
    test('should fire a specific job', () => {
      // Mock cron job
      CronTasksService._cronJobs = {
        THESIS_EXPIRED: new CronJob(),
        // Add more cron jobs if needed
      };

      // Call fireJob method
      CronTasksService.fireJob(CronTasksService.JOB_NAMES.THESIS_EXPIRED);

      // Ensure the fireOnTick method is called on the specified cron job
      expect(CronTasksService._cronJobs[CronTasksService.JOB_NAMES.THESIS_EXPIRED].fireOnTick).toHaveBeenCalled();
    });

    test('should handle an invalid job name', () => {
      // Mock cron job
      CronTasksService._cronJobs = {
        THESIS_EXPIRED: new CronJob(),
        // Add more cron jobs if needed
      };

      // Call fireJob method with an invalid job name
      CronTasksService.fireJob('INVALID_JOB_NAME');

      // Ensure nothing is called for an invalid job name
      expect(CronTasksService._cronJobs.INVALID_JOB_NAME).toBeUndefined();
    });
  });
});
