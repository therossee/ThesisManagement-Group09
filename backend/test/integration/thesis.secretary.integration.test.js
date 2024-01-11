require('jest');
// [i] This line setup the test database + load the environment variables. DON'T (RE)MOVE IT
const { resetTestDatabase, initImapClient, closeImapClient, searchEmails} = require('../integration_config');
const request = require("supertest");
const {app} = require("../../src/app");
const utils = require("../utils");
const thesisDao = require('../../src/dao/thesis_dao');
const db = require('../../src/services/db');
const AdvancedDate = require('../../src/models/AdvancedDate');
const CronTasksService = require("../../src/services/CronTasksService");

beforeEach(() => {
    // Be sure that we are using a full clean database before each test
    resetTestDatabase();
    jest.restoreAllMocks();
    jest.clearAllMocks();
});

let agent;
beforeAll(async () => {
    await initImapClient();
    agent = await utils.getRossiAbbondanzioAgent(app);
});

afterAll(async () => {
    await closeImapClient();
    resetTestDatabase();
    CronTasksService.stop();
});

describe('GET /api/secretary-clerk/thesis-start-requests', () => {
    test('should return a list of one thesis start requests without co-supervisors', async () => {
        const res = await agent
            .get('/api/secretary-clerk/thesis-start-requests')
            .set('credentials', 'include')
            .set('Accept', 'application/json')
            .send();

        expect(res.status).toEqual(200);
        expect(res.body).toEqual([{
            "id": 1,
            "application_id": 1,
            "proposal_id": 1,
            "student": {
                id: "s320213",
                email: "s320213@studenti.polito.it",
                name: "Luca",
                surname: "Barbato",
            },
            "supervisor": {
                id: "d279620",
                email: "d279620@polito.it",
                name: "Marco",
                surname: "Rossi",
                cod_group: "Group1",
                cod_department: "Dep1"
            },
            "co_supervisors": [],
            "title": "AI-GUIDED WEB CRAWLER FOR AUTOMATIC DETECTION OF MALICIOUS SITES",
            "description": "This thesis focuses on developing an AI-guided web crawler for the automatic detection of malicious sites. The research aims to leverage artificial intelligence to enhance the efficiency and accuracy of web crawling in identifying and cataloging potentially harmful websites.",
            "creation_date": "2023-12-12T23:59:59.999Z",
            "approval_date": null,
            "status": "waiting for approval",
        }]);
    });

    test('should return a list of thesis start requests', async () => {
        const tsr = db.prepare(`INSERT INTO thesisStartRequest (student_id, supervisor_id, title, description, creation_date) VALUES (?,?,?,?,?)`)
                      .run("s318952", "d279620", "title", "description", new AdvancedDate().toISOString());
        
        db.prepare(`INSERT INTO thesisStartCosupervisor (start_request_id, cosupervisor_id) VALUES (?,?)`)
            .run(tsr.lastInsertRowid, "d370335");

        const res = await agent
            .get('/api/secretary-clerk/thesis-start-requests')
            .set('credentials', 'include')
            .set('Accept', 'application/json')
            .send();

        expect(res.status).toEqual(200);
        expect(res.body).toEqual([
            {
                "id": 1,
                "application_id": 1,
                "proposal_id": 1,
                "student": {
                    id: "s320213",
                    email: "s320213@studenti.polito.it",
                    name: "Luca",
                    surname: "Barbato",
                },
                "supervisor": {
                    id: "d279620",
                    email: "d279620@polito.it",
                    name: "Marco",
                    surname: "Rossi",
                    cod_group: "Group1",
                    cod_department: "Dep1"
                },
                "co_supervisors": [],
                "title": "AI-GUIDED WEB CRAWLER FOR AUTOMATIC DETECTION OF MALICIOUS SITES",
                "description": "This thesis focuses on developing an AI-guided web crawler for the automatic detection of malicious sites. The research aims to leverage artificial intelligence to enhance the efficiency and accuracy of web crawling in identifying and cataloging potentially harmful websites.",
                "creation_date": "2023-12-12T23:59:59.999Z",
                "approval_date": null,
                "status": "waiting for approval",
            },
            {
                "id": 2,
                "application_id": null,
                "proposal_id": null,
                "student": {
                    "id": "s318952",
                    "email": "s318952@studenti.polito.it",
                    "name": "Sylvie",
                    "surname": "Molinatto",
                },
                "supervisor": {
                    id: "d279620",
                    email: "d279620@polito.it",
                    name: "Marco",
                    surname: "Rossi",
                    cod_group: "Group1",
                    cod_department: "Dep1"
                },
                "co_supervisors":  [
                    {
                        id: "d370335",
                        email: "d370335@polito.it",
                        name: "Luca",
                        surname: "Bianchi",
                        cod_group: "Group2",
                        cod_department: "Dep2"
                    }
                ],
                "title": "title",
                "description": "description",
                "creation_date": expect.stringContaining(new AdvancedDate().toISOString().substring(0, 10)),
                "approval_date": null,
                "status": "waiting for approval",
            },
        ]);
    });

    test('should handle errors', async () => {
        jest.spyOn(thesisDao, 'listThesisStartRequests').mockImplementation(() => {
            throw new Error();
        });
        const res = await agent
            .get('/api/secretary-clerk/thesis-start-requests')
            .set('credentials', 'include')
            .set('Accept', 'application/json')
            .send();

        expect(res.statusCode).toEqual(500);
    });
});