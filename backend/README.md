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
