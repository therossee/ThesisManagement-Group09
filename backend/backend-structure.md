# Thesis Management System 

![GitHub contributors](https://img.shields.io/github/contributors/therossee/ThesisManagement-Group09)


## Backend

Welcome to the backend of our project! This repository houses the core functionality that powers our application, seamlessly connecting the frontend user interface with the underlying data management, authentication, and communication processes.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Test](#test)
- [Backend Project Structure](#backend-project-structure)
  - [src directory](#src-directory)
  - [test tirectory](#test-directory)
- [Middlewares](#middlewares)
- [API Endpoints](#api-endpoints)
- [Test](#test)
  - [Testing Overview](#testing-overview)
  - [Running Tests](#running-tests)
  - [Test Coverage Report](#test-coverage-report)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The backend is implemented as a RESTful API, leveraging Node.js and the Express framework to provide seamless data interactions with the frontend. 

Its primary purpose is to handle data management, authentication, and communication with external services. By seamlessly integrating with the frontend, the backend ensures a smooth user experience and robust functionality. 

Whether you're a developer looking to contribute or a user seeking insights into the backend workings, this README will guide you through the essential information about our backend architecture, setup, and usage. 

Let's get started! 🚀

## Features

1. **RESTful API**

    Our backend provides a RESTful API to facilitate communication between the frontend and server. This enables efficient data retrieval, modification, and storage.

2. **Node.js and Express**  

    <p>
      <img src="https://img.shields.io/badge/Node.js-43853D?style=plastic&logo=node.js&logoColor=white">
      <img src="https://img.shields.io/badge/Express.js-404D59?style=plastic">
    </p>
    
    Built on the Node.js runtime and utilizing the Express framework, our backend is designed for scalability, performance, and ease of development.

3. **Authentication and Authorization**
    
    Ensuring secure access, our backend implements authentication mechanisms to verify user identities and authorization controls to manage user permissions effectively.

4. **Database Integration**

    ![SQLite](https://img.shields.io/badge/SQLite-07405E?style=plastic&logo=sqlite&logoColor=white)

    The backend seamlessly integrates with a database system to store and retrieve data, ensuring persistent and organized information for the application.
5. **Programming Language**

    ![JS](https://img.shields.io/badge/javascript-blue?logo=javascript&logoColor=f5f5f5)

    The entire backend infrastructure is implemented using the JavaScript programming language. This includes the use of JavaScript for defining controllers, Data Access Objects (Dao), error handling, middlewares, and routes. This choice provides consistency and ease of maintenance, as all the code, from handling user requests to database access logic, is written in a single language, simplifying development and enhancing code readability.

6. **Collaborative Development with GitHub**
    
    
    
    Our development process has been entirely collaborative, leveraging the GitHub platform. Through GitHub, team members have seamlessly collaborated on code contributions, tracked changes, and managed the project's development lifecycle. This approach ensures transparency, version control, and efficient teamwork, fostering a streamlined and organized development process.



## Getting Started

Instructions on how to set up and run the backend.

### Prerequisites

<p>
  <img src="https://img.shields.io/badge/Node%20js-339933?style=plastic&logo=nodedotjs&logoColor=white">
  <img src="https://img.shields.io/badge/npm-CB3837?style=plastic&logo=npm&logoColor=white">
</p>

Before running the backend, ensure you have the following prerequisites installed:

- [Node.js](https://nodejs.org/) 
- [npm](https://www.npmjs.com/) (Node Package Manager)
   

### Installation
  <p>
    <img src="https://img.shields.io/badge/mac%20os-000000?style=plastic&logo=apple&logoColor=white" alt="Mac OS" height='30px'>
    <img src="https://img.shields.io/badge/Windows-0078D6?style=plastic&logo=windows&logoColor=white" alt="Windows" height='30px'>
    <img src="https://img.shields.io/badge/Linux-FCC624?style=plastic&logo=linux&logoColor=black"  alt="Linux" height='30px'>
  </p>

1. **Clone the repository**: 

   ```bash
   git clone https://github.com/therossee/ThesisManagement-Group09.git
   ```
2. **Go inside the backend directory**:
   ```bash
   cd backend
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```

### Usage

To run the backend server, follow these steps:

1. Ensure you have completed the installation steps mentioned above.

2. Run the following command (in the backend directory) to start the server:
   ```bash
   npm start
   ```
The server will start, and you should see console logs indicating that the server is running.

## Backend Project Structure
The backend project is divided into 3 parts :
- `src` => source code of the API
- `test` => all unit/integration tests of the project
- `.` => all the configuration (.pem key, environment, ...)

### src directory
The source directory has been divided into different folder to simplify the readability of the code:
- `controllers` => each file contains one or more functions used in routers ONLY to handle the request and response.
- `dao` => each file contains one or more dao function used to interact with the database. All the database logic is implemented here.
- `enums` => each file contains one or more enum object AND the file `index.js` exports all enums from the directory.
- `errors` => each file is equal to a class representing an error that can be formatted to be sent through an express response (see `src/middlewares/errors.js`).
- `middlewares` => each file contains one or more function used as middleware for express application/router.
- `models` => each file contains a class representing a model of an entity.
- `routers` => each file contains one router exported as default. The router contains all API endpoint related to his domain.
  - They are used in the `app.js` file to register the router to the express application.
- `schemas` => each file contains one or more "zod" schemas object used to validate user input AND the file `index.js` exports all schemas from the directory. 
- `services` => each file contains one or more service class/function used to interact logically. Some of the domain logic is implemented here.

The `index.js` file is the entry point where the HTTP server is created/set up. While the `app.js` file is used to set up the express application and is used in test directory to create a fake server for integration testing.

### test directory
The test directory contains integration and unit testing of the backend. To simplify readability tests are divided 
into 2 folders:
- unit
- integration

The root of the directory contains some utils methods/variables for the execution of tests

## Middlewares

### Authentication
The authentication middleware is defined in `src/middlewares/authentication.js`.
It uses the `passport-saml` library to authenticate users using SAML2.0.

### Authorization
Several middleware functions are defined to check user authentication and roles. These include:
- `isLoggedIn`: Checks if the user is authenticated.
- `isStudent`, `isTeacher`, `isTester`, `isSecretaryClerk`: Checks if the authenticated user has the specified role.

### Error Handling
The error handling middleware is defined in `src/middlewares/errors.js` and expose all middlewares needed
to handle errors and send a response to the client.

## API Endpoints

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
    - Authenticated by a teacher, archive the proposal with the given id, for which the teacher is the supervisor
    - Requires the id of the thesis proposal to delete
    - Error if:
        - Some applications of the given thesis proposals has been accepted
        - There are no thesis proposal with the given id
        - The thesis is already expired
        - The supervisor is not the owner of the thesis proposal

- DELETE `/api/thesis-proposals/:id/archive`
    - Authenticated by a teacher, un-archive the proposal with the given id, for which the teacher is the supervisor. If the thesis is expired also a new expiration date should be provided as a query parameter.
    - Requires the id of the proposal to un-archive
    - Error if:
        - There are no thesis proposal with the given id
        - The thesis is assigned to a student
        - The thesis proposal is expired and no new expiration date is sent 
        - The this is not archived (or expired) 

### Utils APIs

- GET `/api/teachers`
    - Authenticated by the teacher, get the list of all teachers

- GET `/api/externalCoSupervisors`
    - Authenticated by the teacher, get the list of all external CoSupervisors

- GET `/api/keywords`
    - Authenticated by the teacher, get the list of all keywords

- GET `/api/degrees`
    - Authenticated by the teacher, get the list of all degrees

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


### Thesis Start Requests APIs

- GET `/api/teacher/thesis-start-requests`
    - Authenticated as a teacher, gets all the student thesis start requests for which the teacher is the supervisor. 

- POST `/api/teacher/thesis-start-requests/:id/review`
    - Authenticated as a teacher, allows to review the student thesis start request with the given id for which the teacher is the supervisor.
    - The body requires the action ('accept', 'reject' or 'request changes') and in the third case also a string.
    - Error if:
      - Thesis start request not found

- POST `/api/student/thesis-start-requests`
    - Authenticated as a student, creates a new thesis start request.
    - The body requires a title, a description, the supervisor id, the application id (optional), the proposal id (optional) and an array (even empty) with the id of the internal co-supervisors.
    - Error if:
      - Missing required fields
      - Supervisor not found
      - Application or thesis proposal not found
      - Proposal archived (or expired)
      - Internal co-supervisor not found
      - Same teacher is selected both as supervisor and as co-supervisor
      - Student has another active thesis start request
      - The proposal doesn't belong to the student degree

- GET `/api/student/thesis-start-requests/last`
    - Authenticated as a student, gets his last thesis start request.

- GET `/api/secretary-clerk/thesis-start-requests`
    - Authenticated as a secretary clerk, gets all the student thesis start requests.

- PATCH `/api/secretary-clerk/thesis-start-requests/accept/:request_id`
    - Authenticated as a secretary clerk, accepts the thesis start request with the given id.
    - Error if:
      - Thesis start request not found
      - Thesis start request already reviewed

- PATCH `/api/secretary-clerk/thesis-start-requests/reject/:request_id`
    - Authenticated as a secretary clerk, rejects the thesis start request with the given id.
   - Error if:
      - Thesis start request not found
      - Thesis start request already reviewed

## Test

### Testing Overview
Our backend is equipped with a comprehensive suite of tests, including both unit and integration tests, implemented using Jest, a popular JavaScript testing framework.

![Jest](https://img.shields.io/badge/Jest-C21325?style=plastic&logo=jest&logoColor=white)

### Running Tests
To run the tests, execute the following command in the backend folder:

 ```bash
npm run test
 ```

### Test Coverage Report
Upon completion of the tests, a detailed HTML coverage report will be generated. The report will open in your browser and here you can gain insights into the test coverage. This provides a visual representation of how well our code is tested, helping ensure its robustness and reliability.

We encourage contributors to run tests regularly and review the coverage report to maintain the high quality and integrity of our codebase.

## Contributing

Thank you for considering contributing to the backend project! By contributing, you acknowledge and agree that your contributions will be subject to the licensing terms chosen by the project. Your contributions help us maintain an open and collaborative environment. We appreciate your support!

#### Important notes:

- License
  - Ensure that your contributions comply with the project's license (GNU GPL 3.0). Include the license header in new files.

- Be Respectful:
  - Be respectful and inclusive in your interactions. We embrace a diverse community.

Thanks for being part of our project! 🚀

## License
This project is licensed under the [GNU General Public License v3.0](https://opensource.org/licenses/GPL-3.0) - see the LICENSE.md file for details.

![GitHub License](https://img.shields.io/github/license/therossee/ThesisManagement-Group09?style=plastic&color=green)

