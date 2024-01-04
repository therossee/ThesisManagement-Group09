# Back End
## Description
This is the back end of the project. It is a REST API that provides the data for the front end. It is written in Node.js using the Express framework.

## Installation
1. Install [Node.js](https://nodejs.org/en/download/)
2. Clone the repository
3. Run `npm install` in the back-end directory
4. Run `npm start` to start the server (the server will be running on port 3000 by default)

---

## Project Structure
The backend project is divided into 3 parts :
- `src` => source code of the API
- `test` => all unit/integration tests of the project
- `.` => all the configuration (.pem key, environment, ...)

### Test (directory)
The test directory contains integration and unit testing of the backend. To simplify readability tests are divided 
into 2 folders:
- unit
- integration
The root of the directory contains some utils methods/variables for the execution of tests

### Source code (directory)
The source has been divided into different folder to simplify the readability of the code:
- `errors` => each file is equal to a class representing an error that can be formatted to be sent through an express response (see `src/middlewares/errors.js`)
- `middlewares` => each file contains one or more function used as middleware for express application/router
- `models` => each file contains a class representing a model of an entity
- `enums` => each file contains one or more enum object AND the file `index.js` exports all enums from the directory
  - Don't forget to update the `index.js` file when you add a new enum
- `schemas` => each file contains one or more "zod" schemas object used to validate user input AND the file `index.js` exports all schemas from the directory
  - Don't forget to update the `index.js` file when you add a new schema
- `services` => each file contains one or more service class/function used to interact logically. Some of the domain logic is implemented here
- `dao` => each file contains one or more dao function used to interact with the database. All the database logic is implemented here
- `routers` => each file contains one router exported as default. The router contains all API endpoint related to his domain.
  - They are used in the `app.js` file to register the router to the express application
- `controllers` => each file contains one or more functions used in routers ONLY to handle the request and response.

The `index.js` file is the entry point where the HTTP server is created/set up. While the `app.js` file is used to set
up the express application and is used in test directory to create a fake server for integration testing.

## Middlewares
### Authentication
The authentication middleware is defined in `src/middlewares/authentication.js`.
It uses the `passport-saml` library to authenticate users using SAML.
### Authorization
Several middleware functions are defined to check user authentication and roles. These include:
- `isLoggedIn`: Checks if the user is authenticated.
- `isStudent`, `isTeacher`, `isTester`: Checks if the authenticated user has the specified role.
### Error Handling
The error handling middleware is defined in `src/middlewares/errors.js` and expose all middlewares needed
to handle errors and send a response to the client.

---

## APIs
### Authentication APIs
- GET `/login`
    - Endpoint for initiating SAML authentication
- POST `/sso/callback`
    - Endpoint for receiving SAML responses 
- POST `/logout`
    - Endpoint for logging out
- GET `/api/user`
    - Returns information about the authenticated user.

### Virtual Clock APIs

- GET `/api/system/virtual-clock`
    - Get the virtual date of the system

- POST `/api/system/virtual-clock`
    - Set the virual date of the system

### Thesis Proposals APIs

- POST `/api/teacher/thesis_proposals`
    - Inserts a new thesis proposal in the database
    - The body requires title, internal supervisors, external supervisors, type, description, required knowledge, notes, level, cds and keywords
    - Authenticated by the teacher, responds with the thesis proposal in json format

- GET `/api/teachers`
    - Authenticated by the teacher, get the list of all teachers

- GET `/api/externalCoSupervisors`
    - Authenticated by the teacher, get the list of all external CoSupervisors

- GET `/api/keywords`
    - Authenticated by the teacher, get the list of all keywords

- GET `/api/degrees`
    - Authenticated by the teacher, get the list of all degrees

- GET `/api/thesis-proposals`
    - This API checks if the logged-in user is a teacher or a student:
        - In the first case get all the unexpired thesis proposals of which the logged-in professor is supervisor;
        - In the second case get all the thesis proposals of the same degree of the logged-in student that are not expired

- GET `/api/thesis-proposals/:id`
    - Requires the id of the thesis proposal
    - This API checks if the logged-in user is a teacher or a student:
        - If the logged-in user is a student, it gets the required thesis proposal with the given id, having checked before if the thesis proposal has not expired or accepted. In this case the thesis proposal have to have the same degree of the student.
        - In the case of a logged-in teacher, it gets all the information of the thiesis proposal with the given id, having checked before if the thesis proposal has not expired or accepted. In this case the thesis proposal have to have the logged-in teacher as a supervisor

- PUT `/api/thesis-proposals/:id`
    - Requires the id of the thesis proposal to update, and all the modified field in the body
    - Authenticated by a teacher, update a thesis proposal with the given id which is not been accepted.
    - Give error if some properties are missing or invalid

- DELETE `/api/thesis-proposals/:id`
    - Authenticated by a teacher, delete the proposal with the given id, of which the teacher is the supervisor
    - Requires the id of the thesis proposal to delete
    - Error if:
        - Some applications of the given thesis proposals has been accepted
        - There are no thesis proposal with the given id
        - The thesis is already expired
        - The supervisor is not the owner of the thesis proposal
- PATCH `/api/thesis-proposals/archive/:id`
    - Authenticated by a teacher, archive the proposal with the given id, of which the teacher is the superviso
    - Requires the id of the thesis proposal to delete
    - Error if:
        - Some applications of the given thesis proposals has been accepted
        - There are no thesis proposal with the given id
        - The thesis is already expired
        - The supervisor is not the owner of the thesis proposal

### Applications APIs

- POST `/api/student/applications`
    - Authenticated by a student, it allows the latter to apply for a proposal, allowing to upload a file if necessary.
    - The user ID (student_id) and thesis proposal ID (thesis_proposal_id) are extracted from the request
    - Returns the json with application_id, thesis_proposal_id, student_id and the status setted to 'waiting for approval'
    - Error if:
        - The proposal doesn't belong to the student degree
        - The proposal is not active
        - The user has already applied for other proposals

- GET `/api/teacher/applications/:proposal_id`
    - Authenticated by a teacher, it gets all the infos of the application done by the student to the thesis proposal of which the teacher is the supervisor.

- GET `/api/student/active-application`
    - Authenticated by a student, it gets all the proposal_id of the thesis application done by the logged-in student that are waiting for approval or accepted 

- PATCH `/api/teacher/applications/accept/:proposal_id`
    - Requires the proposal id in the endpoint and the the student_id in the body
    - Authenticated by a teacher, allows to accept a proposal with the given id to a specific student and cancel all the other application done by other student
    - Notify automatically the students of the new status of the applications
    - Error if: 
        - No application with the status "waiting for approval" has been found for this proposal
        - Another student has been accepted for this thesis proposal

- PATCH `/api/teacher/applications/reject/:proposal_id`
    - Requires the proposal id in the endpoint and the the student_id in the body
    - Authenticated by a teacher, allows to reject a proposal with the given id to a specific student
    - Error if no application with the status "waiting for approval" has been found for this proposal

- GET `/api/student/applications-decision`
    - Authenticated by a student, gets all the applications with thesis infos done by the logged-in student

- GET `/api/student/:id/career`
    - Authenticated by a teacher, gets the career of the student with the given id
    - Error if a student with the given id doesn't exist

- GET `/api/teacher/uploads/:stud_id/:app_id`
    - Authenticated by a teacher, gets uploads associated with a specific student's application for a teacher.
    - Error if a student with the given id or an application with a given id doesn't exist.
