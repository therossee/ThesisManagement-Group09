require('jest');

const NotificationService = require('../../src/services/NotificationService');
const usersDao = require('../../src/dao/users_dao');
const thesisProposalDao = require('../../src/dao/thesis_proposal_dao');
const thesisApplicationDao = require('../../src/dao/thesis_application_dao');
const email = require('../../src/services/emails');

jest.mock('../../src/dao/users_dao', () => ({
    getStudentById: jest.fn(),
    getTeacherById: jest.fn(),
}));

jest.mock('../../src/dao/thesis_proposal_dao', () => ({
    getThesisProposalById: jest.fn(),
}));

jest.mock('../../src/dao/thesis_application_dao', () => ({
    getApplicationById: jest.fn(),
}));

jest.mock('../../src/services/emails', () => ({
    sendEmail: jest.fn(),
}));

describe('NotificationService', () => {
    let consoleErrorSpy;
    beforeEach(() => {
        jest.clearAllMocks();
        // Spy on console.error
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });
    afterEach(() => {
        // Restore the original console.error
        consoleErrorSpy.mockRestore();
    });

    describe('emitThesisApplicationStatusChange', () => {
       
        test('handles student not found', async () => {
            
            usersDao.getStudentById.mockResolvedValue(null);
            await NotificationService.emitThesisApplicationStatusChange('nonExistingStudent', 'proposalId', 'accepted', 'reason');
    
            expect(usersDao.getStudentById).toHaveBeenCalledWith('nonExistingStudent');
            expect(thesisProposalDao.getThesisProposalById).not.toHaveBeenCalled();
            // Ensure console.error is called with the expected message
            expect(consoleErrorSpy).toHaveBeenCalledWith(`Student with id "nonExistingStudent" not found, cannot notify application status change.`);

        });
    
        test('handles thesis not found', async () => {
            
            usersDao.getStudentById.mockResolvedValue({ id: 'studentId', email: 'student@example.com' });
            thesisProposalDao.getThesisProposalById.mockResolvedValue(null);

            await NotificationService.emitThesisApplicationStatusChange('studentId', 'nonExistingProposal', 'accepted', 'reason');

            expect(usersDao.getStudentById).toHaveBeenCalledWith('studentId');
            expect(thesisProposalDao.getThesisProposalById).toHaveBeenCalledWith('nonExistingProposal');
            // Ensure console.error is called with the expected message
            expect(consoleErrorSpy).toHaveBeenCalledWith(`Thesis proposal with id "nonExistingProposal" not found, cannot notify application status change.`);

        });

        test('handles email sending failure', async () => {
            
            usersDao.getStudentById.mockResolvedValue({ id: 'studentId', email: 'student@example.com' });
            thesisProposalDao.getThesisProposalById.mockResolvedValue(
                { 
                    proposal_id: '1',
                    title: 'Thesis Title',
                    supervisor_id: 'd279620',
                    type: 'research project',
                    description: 'description',
                    required_knowledge: 'required knowledge',
                    notes: 'notes',
                    creation_date: '2023-11-28T12:00:00Z',
                    expiration_date: '2033-11-28T12:00:00Z',
                    level: 'LM',
                    is_deleted: 0,
                    is_archived: 0,
    
            });
            email.sendEmail.mockRejectedValue(new Error('Email sending error'));

            await NotificationService.emitThesisApplicationStatusChange('studentId', 'proposalId', 'accepted', 'reason');

            expect(usersDao.getStudentById).toHaveBeenCalledWith('studentId');
            expect(thesisProposalDao.getThesisProposalById).toHaveBeenCalledWith('proposalId');
            // Ensure console.error is called with the expected message
            expect(consoleErrorSpy).toHaveBeenCalledWith(`Failed to send email to student "studentId"`, new Error('Email sending error'));
        
        });

        test('handles generic failure', async () => {
            
            usersDao.getStudentById.mockResolvedValue({ id: 'studentId', email: 'student@example.com' });
            thesisProposalDao.getThesisProposalById.mockRejectedValue(new Error('Error while retrieving thesis'));

            await NotificationService.emitThesisApplicationStatusChange('studentId', 'proposalId', 'accepted', 'reason');

            expect(usersDao.getStudentById).toHaveBeenCalledWith('studentId');
            expect(thesisProposalDao.getThesisProposalById).toHaveBeenCalledWith('proposalId');
            // Ensure console.error is called with the expected message
            expect(consoleErrorSpy).toHaveBeenCalledWith(`Failed to send email to student "studentId"`, new Error('Error while retrieving thesis'));
        
        });

        test('successfully sends email for status change', async () => {
        
            usersDao.getStudentById.mockResolvedValue({ id: 's318952', email: 's318952@studenti.polito.it' });
            thesisProposalDao.getThesisProposalById.mockResolvedValue(
                { 
                    proposal_id: '1',
                    title: 'Thesis Title',
                    supervisor_id: 'd279620',
                    type: 'research project',
                    description: 'description',
                    required_knowledge: 'required knowledge',
                    notes: 'notes',
                    creation_date: '2023-11-28T12:00:00Z',
                    expiration_date: '2033-11-28T12:00:00Z',
                    level: 'LM',
                    is_deleted: 0,
                    is_archived: 0,
    
            });
            email.sendEmail.mockResolvedValue({});
            // Call the function
            await NotificationService.emitThesisApplicationStatusChange('s318952', '1', 'accepted', 'reason');
    
            // Verify that the correct methods were called with the expected arguments
            expect(usersDao.getStudentById).toHaveBeenCalledWith('s318952');
            expect(thesisProposalDao.getThesisProposalById).toHaveBeenCalledWith('1');
    
            expect(email.sendEmail).toHaveBeenCalledWith(
                's318952@studenti.polito.it',
                'Application status changed - Thesis Title',
                expect.any(String),
                expect.any(String)
            );
            // Verify console.error is not called for a successful case
            expect(consoleErrorSpy).toHaveBeenCalledTimes(0);
        });

        test('successfully sends email for status change without a \'reason\'', async () => {
        
            usersDao.getStudentById.mockResolvedValue({ id: 's318952', email: 's318952@studenti.polito.it' });
            thesisProposalDao.getThesisProposalById.mockResolvedValue(
                { 
                    proposal_id: '1',
                    title: 'Thesis Title',
                    supervisor_id: 'd279620',
                    type: 'research project',
                    description: 'description',
                    required_knowledge: 'required knowledge',
                    notes: 'notes',
                    creation_date: '2023-11-28T12:00:00Z',
                    expiration_date: '2033-11-28T12:00:00Z',
                    level: 'LM',
                    is_deleted: 0,
                    is_archived: 0,
    
            });
            email.sendEmail.mockResolvedValue({});
            // Call the function
            await NotificationService.emitThesisApplicationStatusChange('s318952', '1', 'accepted');
    
            // Verify that the correct methods were called with the expected arguments
            expect(usersDao.getStudentById).toHaveBeenCalledWith('s318952');
            expect(thesisProposalDao.getThesisProposalById).toHaveBeenCalledWith('1');
    
            expect(email.sendEmail).toHaveBeenCalledWith(
                's318952@studenti.polito.it',
                'Application status changed - Thesis Title',
                expect.any(String),
                expect.any(String)
            );
            // Verify console.error is not called for a successful case
            expect(consoleErrorSpy).toHaveBeenCalledTimes(0);
        });
    });
  
    describe('emitNewApplicationCreated', () => {
    
        test('handles application not found', async () => {
        
            thesisApplicationDao.getApplicationById.mockResolvedValue(null);
            
            await NotificationService.emitNewApplicationCreated('nonExistingApplication', 'studentId', 'proposalId');
        
            expect(thesisApplicationDao.getApplicationById).toHaveBeenCalledWith('nonExistingApplication');
            expect(consoleErrorSpy).toHaveBeenCalledWith(`Application with id "nonExistingApplication" not found, cannot notify new application.`);
        });
    
        test('handles student not found', async () => {
       
            thesisApplicationDao.getApplicationById.mockResolvedValue({ id:1, proposal_id: 3, student_id: 's318952', creation_date: '2023-01-01', status: 'waiting for approval' });
            usersDao.getStudentById.mockResolvedValue(null);

            await NotificationService.emitNewApplicationCreated('existingApplication', 'nonExistingStudent', 'proposalId');
        
            
            expect(usersDao.getStudentById).toHaveBeenCalledWith('nonExistingStudent');
            expect(consoleErrorSpy).toHaveBeenCalledWith(`Student with id "nonExistingStudent" not found, cannot notify new application.`);
    
        });
    
        test('handles thesis not found', async () => {
        
            thesisApplicationDao.getApplicationById.mockResolvedValue({ id:1, proposal_id: 3, student_id: 's318952', creation_date: '2023-01-01', status: 'waiting for approval' });
            usersDao.getStudentById.mockResolvedValue({ id: 's318952', surname: 'Molinatto', name: 'Sylvie', gender: 'Female', nationality: 'Italian', email: 's318952@studenti.polito.it', cod_degree: 'L-08', enrollment_year: 2020});
            thesisProposalDao.getThesisProposalById.mockResolvedValue(null);
        
            await NotificationService.emitNewApplicationCreated('existingApplication', 'existingStudent', 'nonExistingProposal');
        
            expect(thesisProposalDao.getThesisProposalById).toHaveBeenCalledWith('nonExistingProposal');
            expect(consoleErrorSpy).toHaveBeenCalledWith(`Thesis proposal with id "nonExistingProposal" not found, cannot notify new application.`);
        
        });
    
        test('handles supervisor not found', async () => {
       
            thesisApplicationDao.getApplicationById.mockResolvedValue({ id:1, proposal_id: 3, student_id: 's318952', creation_date: '2023-01-01', status: 'waiting for approval' });
            usersDao.getStudentById.mockResolvedValue({ id: 's318952', surname: 'Molinatto', name: 'Sylvie', gender: 'Female', nationality: 'Italian', email: 's318952@studenti.polito.it', cod_degree: 'L-08', enrollment_year: 2020});
            thesisProposalDao.getThesisProposalById.mockResolvedValue(
                { 
                    proposal_id: '1',
                    title: 'Thesis Title',
                    supervisor_id: 'nonExistingSupervisor',
                    type: 'research project',
                    description: 'description',
                    required_knowledge: 'required knowledge',
                    notes: 'notes',
                    creation_date: '2023-11-28T12:00:00Z',
                    expiration_date: '2033-11-28T12:00:00Z',
                    level: 'LM',
                    is_deleted: 0,
                    is_archived: 0,
    
            });
            usersDao.getTeacherById.mockResolvedValue(null);

            await NotificationService.emitNewApplicationCreated('existingApplication', 'existingStudent', 'existingProposal');
        
            expect(usersDao.getTeacherById).toHaveBeenCalledWith('nonExistingSupervisor');
            expect(consoleErrorSpy).toHaveBeenCalledWith(`Supervisor with id "nonExistingSupervisor" not found, cannot notify new application.`);
        
        });
    
        test('handles email sending failure', async () => {
            
            thesisApplicationDao.getApplicationById.mockResolvedValue({ id:1, proposal_id: 3, student_id: 's318952', creation_date: '2023-01-01', status: 'waiting for approval' });
            usersDao.getStudentById.mockResolvedValue({ id: 's318952', surname: 'Molinatto', name: 'Sylvie', gender: 'Female', nationality: 'Italian', email: 's318952@studenti.polito.it', cod_degree: 'L-08', enrollment_year: 2020});
            thesisProposalDao.getThesisProposalById.mockResolvedValue(
                { 
                    proposal_id: '1',
                    title: 'Thesis Title',
                    supervisor_id: 'd279620',
                    type: 'research project',
                    description: 'description',
                    required_knowledge: 'required knowledge',
                    notes: 'notes',
                    creation_date: '2023-11-28T12:00:00Z',
                    expiration_date: '2033-11-28T12:00:00Z',
                    level: 'LM',
                    is_deleted: 0,
                    is_archived: 0,
    
            });
            usersDao.getTeacherById.mockResolvedValue({ id: 'd279620', surname: 'Rossi', name: 'Marco', email: 'd279620@polito.it', cod_group: 'group1', cod_department: 'dep1'});
        
            email.sendEmail.mockRejectedValue('Email sending failed');

            await NotificationService.emitNewApplicationCreated('existingApplication', 'existingStudent', 'existingProposal');
        
            expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to send email to supervisor "d279620"', 'Email sending failed');
        });

        test('handles generic failure', async () => {
            
            thesisApplicationDao.getApplicationById.mockResolvedValue({ id:1, proposal_id: 3, student_id: 's318952', creation_date: '2023-01-01', status: 'waiting for approval' });
            usersDao.getStudentById.mockResolvedValue({ id: 's318952', surname: 'Molinatto', name: 'Sylvie', gender: 'Female', nationality: 'Italian', email: 's318952@studenti.polito.it', cod_degree: 'L-08', enrollment_year: 2020});
            thesisProposalDao.getThesisProposalById. mockRejectedValue('Error while retrieving thesis');
            usersDao.getTeacherById.mockResolvedValue({ id: 'd279620', surname: 'Rossi', name: 'Marco', email: 'd279620@polito.it', cod_group: 'group1', cod_department: 'dep1'});
        
            email.sendEmail.mockRejectedValue('Email sending failed');

            await NotificationService.emitNewApplicationCreated('existingApplication', 'existingStudent', 'existingProposal');
        
            expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to send email to supervisor of the thesis "existingProposal"', 'Error while retrieving thesis');
        });

        test('sends email successfully', async () => {
       
            thesisApplicationDao.getApplicationById.mockResolvedValue({ id:1, proposal_id: 3, student_id: 's318952', creation_date: '2023-01-01', status: 'waiting for approval' });
            usersDao.getStudentById.mockResolvedValue({ id: 's318952', surname: 'Molinatto', name: 'Sylvie', gender: 'Female', nationality: 'Italian', email: 's318952@studenti.polito.it', cod_degree: 'L-08', enrollment_year: 2020});
            thesisProposalDao.getThesisProposalById.mockResolvedValue(
                { 
                    proposal_id: '1',
                    title: 'Thesis Title',
                    supervisor_id: 'd279620',
                    type: 'research project',
                    description: 'description',
                    required_knowledge: 'required knowledge',
                    notes: 'notes',
                    creation_date: '2023-11-28T12:00:00Z',
                    expiration_date: '2033-11-28T12:00:00Z',
                    level: 'LM',
                    is_deleted: 0,
                    is_archived: 0,
    
            });
            usersDao.getTeacherById.mockResolvedValue({ id: 'd279620', surname: 'Rossi', name: 'Marco', email: 'd279620@polito.it', cod_group: 'group1', cod_department: 'dep1'});
        
            email.sendEmail.mockResolvedValue({});
        
            await NotificationService.emitNewApplicationCreated('existingApplication', 'existingStudent', 'existingProposal');
        
            // Assertions
            expect(email.sendEmail).toHaveBeenCalledWith(
                'd279620@polito.it',
                'New Application - Thesis Title',
                expect.stringContaining(`A new student has applied for your thesis "Thesis Title" the Jan 1, 2023 12:00 AM!`),
                expect.stringContaining(`<p> A new student has applied for your thesis "Thesis Title" the Jan 1, 2023 12:00 AM!</p>`)
            );
            expect(consoleErrorSpy).toHaveBeenCalledTimes(0);
        });
    
    });
  
});