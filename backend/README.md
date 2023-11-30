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
### Index
Contains the API for the working project.

### Authentication APIs

- POST `/api/sessions`
    - The body requires the data for authentication: username and password
    - Returns user information, such as id, username, name, and role

- GET `/api/sessions/current`
    - Get the current logged-in user

- DELETE `/sessions/current`
    - Delete the current session

- GET `/api/system/virtual-clock`
    - Get the virtual date of the system

### Virtual Clock APIs

- GET `/api/system/virtual-clock`
    - Get the virtual date of the system

- POST `/api/system/virtual-clock`
    - Set the virual date of the system

### Thesis Proposals APIs

- POST `/api/teacher/thesis_proposals`
    - Inserts a new thesis proposal in the database
    - The body requires title, internal supervisors, external supervisors, type, description, required knowledge, note, level, cds and keywords
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
    - - Requires the id of the thesis proposal to update
    - Update a thesis proposals with the given id which are not been accepted


