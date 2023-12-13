# Back End
## Description
This is the back end of the project. It is a REST API that provides the data for the front end. It is written in Node.js using the Express framework.

## Installation
1. Install [Node.js](https://nodejs.org/en/download/)
2. Clone the repository
3. Run `npm install` in the back-end directory
4. Run `npm start` to start the server (the server will be running on port 3000 by default)

### Test (directory)
The test directory contains integration and unit testing of the backend.
### Validators
The validators are the JSON schemas that are used to validate the requests using the [ajv](https://ajv.js.org/) library.
### DAO'S
There are the Data Access Object modules for accessing thesis/users/degree data.
The controllers are responsible for handling the requests and responses. They are located in the `controllers` directory.
In this directory, each controller has its own file with all the methods that handle the requests for that controller.
### App.js
Contains the API for the working project.

### Authentication Middleware
Several middleware functions are defined to check user authentication and roles. These include:

- `isLoggedIn`: Checks if the user is authenticated.
- `isStudent`, `isTeacher`, `isTester`: Checks if the authenticated user has the specified role.

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
    - Authenticated by a student, it allows the latter to apply for a proposal
    - Requires the id of the thesis proposal to apply to in the body
    - Returns the json with thesis_proposal_id, student_id and the status setted to 'waiting for approval'
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

