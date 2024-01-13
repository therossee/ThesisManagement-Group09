# Thesis Management System - Demo project for Group 09

## SE2 Course - Politecnico di Torino, academic year 2023-24

## Students:
- ### 320213 Barbato Luca
- ### 321607 Beltrán Juan Carlos
- ### 314796 De Rossi Daniele
- ### 318771 Husanu Diana Alexandra
- ### 321529 Ladrat Mattéo
- ### 318952 Molinatto Sylvie
- ### 319355 Schiavone Michele

---

## Docker
This project supports the use of Docker to run the application. The following instructions assume that you have Docker
correctly installed on your machine.
### Build image
```
docker build -t apokalypt/09_thesis_management .
```
_N.B. A working image is available on Docker Hub at [this link](https://hub.docker.com/r/apokalypt/09_thesis_management)._
### Run container
```
docker run -p 5173:5173 -p 3000:3000 --name thesis_management -e <...> apokalypt/09_thesis_management
```
_For the environment variables, see the [Environment variables](#environment-variables) section._
### External documentation
- [Docker](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

---

## Environment variables

In order to work properly, the application requires the following environment variables to be set:
- **TM_SMTP_SERVICE_NAME** = The name of the SMTP service to use (e.g. "gmail")
- **TM_SMTP_HOST** = The host of the SMTP service to use (e.g. "smtp.gmail.com")
- **TM_SMTP_USERNAME** = The username of the SMTP service to use (e.g. the email address for a Gmail account)
- **TM_SMTP_PASSWORD** = The password of the SMTP service to use
- **TM_SMTP_PORT** = The port of the SMTP service to use (e.g. 587)
- **TM_SMTP_SECURE** = Whether to use a secure connection to the SMTP service (e.g. "true")

_The service support the use of dotenv-vault and therefore allow you to set only one environment variable: TM_DOTENV_KEY.
This variable must contain the key to decrypt the environment variables stored in the dotenv-vault file._

---

## React Client Application Routes
- Route `/`: Displays the home page
- Route `/proposals`: Displays the proposals for a student and a teacher
- Route `/insert-proposal`: Displays the proposal form for the teacher to insert a new thesis proposal.
- Route `/view-proposal/:id`: Displays the specific proposal to view.
- Route `/edit-proposal/:id`: Displays the specific proposal to view, allowing the logged-in supervisor teacher to edit it.
- Route `/applications`: Displays all the applications of students for thesis created by the logged-in teacher.

## API SERVER

### LOGIN
- HTTP Method: `POST` URL `/sso/callback`
- Description: Handles the callback from the SAML identity provider after the user is authenticated.
- Request body:
```json
        {
          "username": "rossi.marco@email.com",
          "password": "d279620"
        }
```
- Response: `201 CREATED` (success)
- Response body: _None_
- Error Response: `401 Unauthorized` ("Incorrect email and/or password")

### GET CURRENT LOGGED USER
- HTTP Method: `GET` URL `/api/user`
- Description: Retrieves information for the current user logged.
- Request body: _None_
- Response: `200 OK` (success)
- Response body: An object containing information on the actual logged user.
```json
        {
          "id": "s294301",
          "surname": "Rossi",
          "name": "Abbondanzio",
          "gender": "Male",
          "nationality": "Italian",
          "email": "rossi.abbondanzio@email.com",
          "cod_degree": "L-07",
          "enrollment_year": "2020"
        }
```
- Error Response: `401 Unauthorized` ("Not authenticated")

### LOGOUT
- HTTP Method: `POST` URL `/logout`
- Description: Closes current session.
- Request body: _None_
- Response: `204 NO CONTENT` (success)
- Response body:  _None_

## VIRTUAL CLOCK API

### GET VIRTUAL CLOCK
- HTTP Method: `GET` URL `/api/system/virtual-clock`
- Description: Returns information about the system's virtual clock.
- Request body: _None_
- Response: `200 OK` (success)
- Response body: 
```json
{
  "date": "2023-12-13T12:30:00.000Z",
  "offset": 0
}
```

### EDIT VIRTUAL CLOCK
- HTTP Method: `POST` URL `/api/system/virtual-clock`
- Description: Update the system's virtual clock with a new offset.
- Request body: The new offset in milliseconds. If omitted, a default value of 0 will be used
```json
{
  "newDate": 1639409400000
}
``````
- Response: `200 OK` (success)
- Response body: 
```json
{
  "date": "2023-12-13T12:30:00.000Z",
  "offset": 3600000
}

```

## THESIS API 

### INSERT NEW THESIS PROPOSAL
- HTTP Method: `POST` URL `/api/teacher/thesis_proposals`
- Description: Inserts new thesis proposal. 
- Details: Route only for logged teachers
- Request body:
```json
       {
          "title": "Title of the thesis",
          "internal_co_supervisors_id": ["id1", "id2"],
          "external_co_supervisors_id": ["id3", "id4"],
          "type": "Thesis Type",
          "description": "Detailed description of the thesis",
          "required_knowledge": "Reqired Knowledge",
          "notes": "Additional notes",
          "expiration": "2023-12-31",
          "level": "Bachelor's",
          "cds": "Course",
          "keywords": ["keyword1", "keyword2"]
        }

```
- Response: `201 CREATED` (success)
- Response body: An object containing information on the thesis proposal.
```json
        {
          "id": "Proposal ID",
          "title": "Title of the thesis",
          "supervisor_id": "Supervisor's_ID",
          "internal_co_supervisors_id": ["id1", "id2"],
          "external_co_supervisors_id": ["id3", "id4"],
          "type": "Thesis Type",
          "groups": ["Group1", "Group2"],
          "description": "Detailed description of the thesis",
          "required_knowledge": "Reqired Knowledge",
          "notes": "Additional notes",
          "expiration": "2023-12-31T23:59:59.999Z",
          "level": "Bachelor's",
          "cds": "Course",
          "keywords": ["keyword1", "keyword2"]
        }

```
- Error Responses: 
    - `401 Unauthorized` ("Not authorized")
    - `403 Forbidden` ("Unauthorized")
    - `400 Bad Request` ("Missing required fields")
    - `500 Internal Server Error` ("Failed to create thesis proposal.")
  
### GET LIST OF TEACHERS NOT LOGGED
- HTTP Method: `GET` URL `/api/teachers`
- Description: Retrieves list of teachers not logged.
- Details: Route only for logged teachers
- Request body: _None_
- Response: `200 OK` (success)
- Response body: An array of objects, each one containing information on the teacher.
```json
        {
          "teachers": 
          [
            {
              "id": "d370335",
              "surname": "Bianchi",
              "name": "Luca",
              "email": "bianchi.luca@email.com",
              "cod_group": "Group2",
              "cod_department": "Dep2"
            },
            {
              "id": "d350985",
              "surname": "Esposito",
              "name": "Andrea",
              "email": "esposito.andrea@email.com",
              "cod_group": "Group3",
              "cod_department": "Dep3"
            }
          ]
        }
```
Error Responses: 
    - `401 Unauthorized` ("Not authorized")
    - `403 Forbidden` ("Unauthorized")
    - `500 Internal Server Error` 

### GET LIST OF EXTERNAL CO-SUPERVISORS
- HTTP Method: `GET` URL `/api/externalCoSupervisors`
- Description: Obtains list of external Co-Supervisors.
- Details: Route only for logged teachers
- Request body: _None_
- Response: `200 OK` (success)
- Response body: An array of objects, contains the information of the external co-supervisors.
```json
       {
          "externalCoSupervisors": 
          [
            {
              "id": 1,
              "surname": "Amato",
              "name": "Alice",
              "email": "alice.amato@email.com"
            },
            {
              "id": 2,
              "surname": "Bianchi",
              "name": "Benjamin",
              "email": "benjamin.bianchi@email.com"
            }
          ]
        }
```
Error Responses: 
    - `401 Unauthorized` ("Not authorized")
    - `403 Forbidden` ("Unauthorized")
    - `500 Internal Server Error`
  
### GET ALL KEYWORDS
- HTTP Method: `GET` URL `/api/keywords`
- Description: Obtains list of all the keywords of a thesis.
- Details: Routes only for logged teachers
- Request body: _None_
- Response: `200 OK` (success)
- Response body: An array of string (keywords).
```json
        {
          "keywords": 
          [
            "chemistry",
            "sustainable",
            "fibers",
            "keyword"
          ]
        }
```
Error Responses: 
    - `401 Unauthorized` ("Not authorized")
    - `403 Forbidden` ("Unauthorized")
    - `500 Internal Server Error`

### GET ALL DEGREES
- HTTP Method: `GET` URL `/api/degrees`
- Description: Obtains list of all the degrees.
- Details: Routes only for logged teachers
- Request body: _None_
- Response: `200 OK` (success)
- Response body: An array of objects, each one containing info on the degrees.
```json
       [
        {
          "cod_degree": "L-07",
          "title_degree": "Ingegneria Civile e Ambientale"
        },
        {
          "cod_degree": "L-08",
          "title_degree": "Ingegneria Elettronica"
        }
       ]
```
Error responses:
    - `401 Unauthorized` ("Not authorized")
    - `403 Forbidden` ("Unauthorized")
    - `500 Internal Server Error` 

### SEARCH FOR THESIS PROPOSALS
- HTTP Method: `GET` URL `/api/thesis-proposals`
- Description: Obtains list of all the thesis proposals for the course of study of the logged-in student or all the proposals of which the logged-in teacher is supervisor .
- Details: Routes only for logged users
- Request body: _None_
- Response: `200 OK` (success)
- Response body: Some metadata (number of proposals found) and an array of objects, each one containing info on a proposal.
```json
       {
        "$metadata": {
          "index": 0,
          "count": 1,
          "total": 1,
          "currentPage": 1
        },
        "items": [
          {
            "id": 1,
            "title": "AI-GUIDED WEB CRAWLER FOR AUTOMATIC DETECTION OF MALICIOUS SITES",
            "status": "ACTIVE",
            "supervisor": {
              "id": "d279620",
              "name": "Marco",
              "surname": "Rossi",
              "email": "rossi.marco@email.com",
              "codGroup": "Group1",
              "codDepartment": "Dep1"
            }
          }
        ]
       }
```
Error responses:
    - `401 Unauthorized` ("Not authorized")
    - `403 Forbidden` ("Unauthorized")
    - `500 Internal Server Error` 

### GET THESIS PROPOSAL BY ID
- HTTP Method: `GET` URL `/api/thesis-proposals/:id`
- Description: Return the proposal with the given id related to a student degree (if exists) or the thesis withe the given id of which the teacher is supervisor.
- Details: Routes only for logged users
- Request body: _None_
- Response: `200 OK` (success)
- Response body: an object containing info on the proposal.
```json
{
  "id": 1,
  "title": "AI-GUIDED WEB CRAWLER FOR AUTOMATIC DETECTION OF MALICIOUS SITES",
  "status": "ACTIVE",
  "supervisor": {
    "id": "d279620",
    "name": "Marco",
    "surname": "Rossi",
    "email": "rossi.marco@email.com",
    "codGroup": "Group1",
    "codDepartment": "Dep1"
  },
  "coSupervisors": {
    "internal": [
      {
        "id": "d226682",
        "name": "Giulia",
        "surname": "Mancini",
        "email": "mancini.giulia@email.com",
        "codGroup": "Group1",
        "codDepartment": "Dep1"
      }
    ],
    "external": [
      {
        "proposal_id": 1,
        "co_supervisor_id": "1",
        "id": 1,
        "surname": "Amato",
        "name": "Alice",
        "email": "alice.amato@email.com"
      }
    ]
  },
  "type": "research project",
  "description": "This thesis focuses on developing an AI-guided web crawler for the automatic detection of malicious sites.",
  "expiration": "2024-11-10",
  "level": "LM",
  "cds": {
    "code": "LM-32",
    "title": "Ingegneria Informatica"
  },
  "keywords": [
    "AI",
    "research",
    "web development"
  ],
  "groups": [
    "Group1",
    "Group2",
    "Group3"
  ]
}
```
Error responses:
    - `401 Unauthorized` ("Not authorized")
    - `403 Forbidden` ("Unauthorized")
    - `404 Not Found` 
    - `500 Internal Server Error` 


### EDIT THESIS PROPOSAL BY ID (for the supervisor of the thesis proposal)
- HTTP Method: `PUT` URL `/api/thesis-proposals/:id`
- Description: Allows teachers to modify an existing thesis proposal..
- Details: Routes only for logged-in teacher
- Request body: 
```json
{
  "title": "AI-GUIDED WEB CRAWLER FOR AUTOMATIC DETECTION OF MALICIOUS SITES",
  "internal_co_supervisors_id": ["d226682"],
  "external_co_supervisors_id": ["1"],
  "type": "research project",
  "description": "This thesis focuses on developing an AI-guided web crawler for the automatic detection of malicious sites.",
  "expiration": "2024-11-10",
  "level": "LM",
  "cds": "LM-32",
  "keywords": [
    "AI",
    "research",
    "web development"
  ]
}
``````
- Response: `200 OK` (success)
- Response body: an object containing info on the proposal.
```json
{
  "title": "AI-GUIDED WEB CRAWLER FOR AUTOMATIC DETECTION OF MALICIOUS SITES",
  "supervisor": {
    "id": "d279620",
    "name": "Marco",
    "surname": "Rossi",
    "email": "rossi.marco@email.com",
    "codGroup": "Group1",
    "codDepartment": "Dep1"
  },
  "coSupervisors": {
    "internal": [
      {
        "id": "d226682",
        "name": "Giulia",
        "surname": "Mancini",
        "email": "mancini.giulia@email.com",
        "codGroup": "Group1",
        "codDepartment": "Dep1"
      }
    ],
    "external": [
      {
        "proposal_id": 1,
        "co_supervisor_id": "1",
        "id": 1,
        "surname": "Amato",
        "name": "Alice",
        "email": "alice.amato@email.com"
      }
    ]
  },
  "type": "research project",
  "description": "This thesis focuses on developing an AI-guided web crawler for the automatic detection of malicious sites.",
  "expiration": "2024-11-10",
  "level": "LM",
  "cds": {
    "code": "LM-32",
    "title": "Ingegneria Informatica"
  },
  "keywords": [
    "AI",
    "research",
    "web development"
  ],
  "groups": [
    "Group1",
    "Group2",
    "Group3"
  ]
}
```
Error responses:
    - `401 Unauthorized` ("Not authorized")
    - `403 Forbidden` ("Unauthorized")
    - `404 Not Found` 
    - `500 Internal Server Error` 

### DELETE THESIS PROPOSAL BY ID (for the supervisor of the thesis proposal)
- HTTP Method: `DELETE` URL `/api/thesis-proposals/:id`
- Description: Allows teachers to delete an existing thesis proposal..
- Details: Routes only for logged teacher
- Request body: _None_
- Response: `204 NO CONTENT` (success)
- Response body: _None_

Error responses:
    - `401 Unauthorized` ("Not authorized")
    - `403 Forbidden` ("Unauthorized")
    - `404 Not Found` 
    - `500 Internal Server Error` 

### ARCHIVE A THESIS PROPOSAL
- HTTP Method: `PATCH` URL `/api/thesis-proposals/archive/:id'`
- Description: Allows teachers to archive an existing thesis proposal, removing it from active listings.
- Details: Routes only for logged teacher
- Request body: _None_
- Response: `204 NO CONTENT` (success)
- Response body:  _None_
Error Responses: 
    - `401 Unauthorized` ("Not authorized")
    - `403 Forbidden` ("Unauthorized")
    - `404 Not Found`
    - `500 Internal Server Error` 


### APPLY FOR THESIS PROPOSAL
- HTTP Method: `POST` URL `/api/student/applications`
- Description: A student apply for a thesis proposal.
- Details: Routes only for logged students
- Request body: 
  ```json
  {
      "thesis_proposal_id": 2
  }
  ```
- Response: `201 CREATED` (success)
- Response body: An object containting the details of the application.
```json
        {
          "application_id": "ID-of-application",
          "thesis_proposal_id": 2,
          "student_id": "s304580",
          "status": "waiting for approval"
        }
```
Error Responses: 
    - `401 Unauthorized` ("Not authorized")
    - `403 Forbidden` ("Unauthorized")
    - `500 Internal Server Error` 
 

### LIST ALL APPLICATIONS FOR A TEACHER'S THESIS PROPOSAL
- HTTP Method: `POST` URL `/api/teacher/applications/:proposal_id`
- Description: Get the list of applications for the proposal of the logged teacher.
- Details: Routes only for logged teachers
- Request body: _None_
- Response: `200 OK` (success)
- Response body: An array containting all the applications for the proposal of the logged teacher.
```json
        [
          {
            "name": "Abenzio",
            "surname": "Esposito",
            "status": "waiting for approval",
            "id": "s288327"
          },
          {
            "name": "Abbondanzio",
            "surname": "Rossi",
            "status": "waiting for approval",
            "id": "s294301"
          }
        ]
```
Error Responses: 
    - `401 Unauthorized` ("Not authorized")
    - `403 Forbidden` ("Unauthorized")
    - `500 Internal Server Error` 

### GET STUDENT APPLICATIONS
- HTTP Method: `POST` URL `/api/student/active-application`
- Description: Get the list of applications of the logged student.
- Details: Routes only for logged students
- Request body: _None_
- Response: `200 OK` (success)
- Response body: An array containting all the applications of the logged user.
```json
        [
          {
            "proposal_id": 2
          }
        ]
```
Error Responses: 
    - `401 Unauthorized` ("Not authorized")
    - `403 Forbidden` ("Unauthorized")
    - `500 Internal Server Error` 


### ACCEPT AN APPLICATION
- HTTP Method: `PATCH` URL `api/teacher/applications/accept/:proposal_id`
- Description: A teacher accepts an application for a thesis proposal.
- Details: Routes only for logged teachers
- Request body: 
  ```json
  {
      "student_id": "s299119"
  }
  ```
- Response: `200 OK` (success)
- Response body: A message.
```json
        {
          "message": "Thesis accepted and others rejected successfully"
        }
```
Error Responses: 
    - `400 Bad Request` ("Missing required fields")
    - `401 Unauthorized` ("Not authorized")
    - `403 Forbidden` ("Unauthorized")
    - `500 Internal Server Error` 

###  REJECT AN APPLICATION
- HTTP Method: `PATCH` URL `api/teacher/applications/reject/:proposal_id`
- Description: A teacher rejects an application for a thesis proposal.
- Details: Routes only for logged teachers
- Request body: 
  ```json
  {
      "student_id": "s299119"
  }
  ```
- Response: `200 OK` (success)
- Response body: A message.
```json
        {
          "message": "Thesis successfully rejected"
        }
```
Error Responses: 
    - `400 Bad Request` ("Missing required fields")
    - `401 Unauthorized` ("Not authorized")
    - `403 Forbidden` ("Unauthorized")
    - `500 Internal Server Error` 

###  GET STUDENT APPLICATION DECISIONS
- HTTP Method: `GET` URL `/api/student/applications-decision`
- Description:Retrieves decisions on thesis proposals applications submitted by the student.
- Details: Routes only for logged students
- Request body: _None_
- Response: `200 OK` (success)
- Response body: An array containting all the decisions of applications of the logged student with other infos related to the thesis
```json
        [
          {
            "application_id": 1,
            "proposal_id": 1,
            "title": "AI-GUIDED WEB CRAWLER FOR AUTOMATIC DETECTION OF MALICIOUS SITES",
            "level": "LM",
            "teacher_name": "Marco",
            "teacher_surname": "Rossi",
            "status": "waiting for approval",
            "expiration": "2024-11-10T23:59:59.999Z"
          }
        ]

```
Error Responses: 
    - `400 Bad Request` ("Missing required fields")
    - `401 Unauthorized` ("Not authorized")
    - `403 Forbidden` ("Unauthorized")
    - `500 Internal Server Error` 

###  GET STUDENT'S CAREER
- HTTP Method: `GET` URL `/api/student/:id/career`
- Description: Retrieves career information for a specific student
- Request body: _None_
- Response: `200 OK` (success)
- Response body: An array containting all the decisions of applications of the logged student with other infos related to the thesis
```json
        [
  {
    "cod_course": "01PDWOV",
    "title_course": "Information Systems",
    "cfu": 6,
    "grade": 28,
    "date": "03/02/2022"
  },
  {
    "cod_course": "01SQJOV",
    "title_course": "Data Science and Database Technology",
    "cfu": 8,
    "grade": 29,
    "date": "20/01/2022"
  },
  {
    "cod_course": "01SQNOV",
    "title_course": "Software Engineering II",
    "cfu": 6,
    "grade": 30,
    "date": "03/03/2023"
  },
  //Others info on the career...
    ]


```
Error Responses: 
    - `400 Bad Request` ("Missing required fields")
    - `401 Unauthorized` ("Not authorized")
    - `403 Forbidden` ("Unauthorized")
    - `500 Internal Server Error` 

###  GET TEACHER UPLOADS
- HTTP Method: `GET` URL `/api/teacher/uploads/:stud_id/:app_id`
- Description: Retrieves uploads associated with a specific student's application for a teacher.
- Request body: _None_
- Response: `200 OK` (success)
- Response body:
  - If uploads exist: The file associated with the application will be sent in the response.
  - If no uploads exist: An empty JSON object will be sent in the response.
Error Responses: 
    - `400 Bad Request` ("Missing required fields")
    - `401 Unauthorized` ("Not authorized")
    - `403 Forbidden` ("Unauthorized")
    - `500 Internal Server Error` 



# DATABASE DOCUMENTATION

## Database File

The project includes a file named 'database.sqlite' located in the 'database' folder. This file contains the actual database used by the project.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Database Structure](#database-structure)
  - [Tables](#tables)
  - [Relationships](#relationships)

## Features

The database is a **relational database**, which means that it stores data in tables with defined relationships between them. This structure makes it easy to query and manage data, and it is also well-suited for storing complex relationships between entities like students, thesis proposals, supervisors, and co-supervisors.
  
It is **implemented using SQLite**, which is a lightweight, embedded SQL database engine that is often used for personal applications or for storing data within applications. It is a good choice for this project because it is easy to use and deploy, and it is also relatively efficient for the size of data that will be stored.
  
Key Features:
- _Data integrity_: Foreign key constraints are used to ensure referential integrity between tables, maintaining consistency and preventing orphaned records. This means that for example when a student is deleted, their thesis proposals are also deleted, and when a thesis proposal is deleted, the associated applications and start requests are also deleted. This helps to maintain data consistency.
- _Normalization_: The database is normalized to the third normal form, which means that it is well-organized and less likely to contain data anomalies. Redundancy and dependency issues in the data are minimized.
- _Auto-incrementing IDs_: Certain tables use auto-incrementing primary key IDs, ensuring the automatic generation of unique identifiers for each record.
- _Default values_: Default values are defined for certain columns, providing a fallback option if a value is not explicitly provided during record creation.

## Getting Started

In this section you will find instructions on how to set up, use and consult the database.

### Prerequisites

  In order to be able to generate and use the database *_sqlite3_* must be installed. This can be done with the command:
  ```bash
  npm install sqlite3
  ```

### Installation
  To generate the database, run the 'init.sql' file located in the 'scripts' subfolder within the 'database' directory. Execute the following command from the current location:
  ```bash
  cat init.sql | sqlite3 ..\database.sqlite
  ```

  An alternative for generating the db can also be to download sqlite3 on your computer from the [official site](https://www.sqlite.org/download.html), then place the file 'sqlite3.exe' in the database/scripts folder and run the following command:
  ```bash
  Get-Content init.sql | sqlite3.exe ..\database.sqlite
  ```
  and it will produce the same result.
    
  Once the db has been generated, it can be counsulted by opening the 'database.sqlite' file (an appropriate vscode exention is necessary - for example 'SQLite Viewer').

## Database Structure
In our database there are the following tables:

- configuration (**key**, value)
  
  → This table is necessary for the virtual clock management. The default value for the 'value' attribute is 0 (note that it's stringified value). This means that the virtual clock is disabled. When we change the date it will assume another value.
- student (**id**, surname, name, gender, nationality, email, cod_degree, enrollment_year)  
- teacher (**id**, surname, name, email, cod_group, cod_department)
- degree (**cod_degree**, title_degree)
- career (**id**, **cod_course**, title_course, cfu, grade, date)
  
  → the career table contains all the courses taken by the students. The field 'id' is the student id, so it is possible to know all the courses a specific student attended filtering by the id.
- thesisProposal (**proposal_id**, title, supervisor_id, type, description, required_knowledge, creation_date, expiration, level, is_deleted, is_archived)
  
  → this table contains all the relevant information for a thesis proposal. We can also be aware if a particular thesis is deleted or archived by the attributes 'is_deleted' and 'is_archived' (0 → non deleted/archived, 1 otherwise)
- proposalKeyword (**proposal_id**, **keyword**)
   
  → This table stores the keywords for each proposal, allowing multiple keywords for the same proposal. Similar tables exist for groups, degree programs, internal co-supervisors and external co-supervisors, enabling multiple entries for each category.
- proposalGroup (**proposal_id**, **cod_group**)
- proposalCds (**proposal_id**, **cod_degree**)
- thesisInternalCoSupervisor (**proposal_id**, **co_supervisor_id**)
- externalCoSupervisor (**id**, surname, name, email)
- thesisExternalCoSupervisor (**proposal_id**, **co_supervisor_id**)
- thesisApplication (**id**, proposal_id, student_id, creation_date, status)
    
  → this table stores the applications for the thesis proposals (related to a specific thesis proposal -> proposal_id and made by a specific student -> student_id). The status attribute is by defeault 'waiting for approval', but it can be set to 'approved' or 'rejected'.
- thesiStartRequest (**id**, student_id, application_id, proposal_id, title, description, supervisor_id, creation_date, approval_date, status)
    
  → this table captures comprehensive details to characterize a thesis start request. The student_id, supervisor_id, title, description and creation_date attributes are non-nullable because initiating a request necessitates essential information such as the student making the request, the professor to whom it is addressed, the title of the thesis to be started, a description of it and the date indicating when the request was made. On the other hand, all the other attributes can be null because we want to allow the possibility to make a start request and then complete all the information after discussing it (as requested by the specifications).
- thesisStartCosupervisor (**start_request_id**, **cosupervisor_id**)
   
  → this table allows to have multiple co-supervisors for the same thesis start request.



### Tables
Here, a more detailed visualisation of the tables:

#### Database Schema Documentation

##### Configuration Table

| Column | Type | Constraints |
| ------ | ---- | ----------- |
| key    | text | **PK**      |
| value  | text | **NOT NULL**|

---

##### Student Table

| Column          | Type    | Constraints                                   |
| --------------- | ------- | --------------------------------------------- |
| id              | text    | **PK**                                        |
| surname         | text    | **NOT NULL**                                  |
| name            | text    | **NOT NULL**                                  |
| gender          | text    | **NOT NULL**                                  |
| nationality    | text    | **NOT NULL**                                  |
| email           | text    | **NOT NULL**                                  |
| cod_degree      | text    | **NOT NULL, FK** [degree](#degree)(cod_degree)|
| enrollment_year | integer | **NOT NULL**                                  |

---

##### Teacher Table

| Column          | Type | Constraints     |
| --------------- | ---- | --------------- |
| id              | text | **PK**          |
| surname         | text | **NOT NULL**    |
| name            | text | **NOT NULL**    |
| email           | text | **NOT NULL**    |
| cod_group       | text | **NOT NULL**    |
| cod_department  | text | **NOT NULL**    |

---

##### Degree Table

| Column       | Type | Constraints       |
| ------------ | ---- | ----------------- |
| cod_degree   | text | **PK**            |
| title_degree | text | **NOT NULL, Unique**|

---

##### Career Table

| Column        | Type    | Constraints                                    |
| ------------- | ------- | ---------------------------------------------- |
| id            | text    | **NOT NULL, FK** [student](#student)(id)       |
| cod_course    | text    | **NOT NULL**                                   |
| title_course  | text    | **NOT NULL**                                   |
| cfu           | integer | **NOT NULL**                                   |
| grade         | real    | **NOT NULL**                                   |
| date          | text    | **NOT NULL**                                   |
| PRIMARY KEY   | id, cod_course                              |

---

##### Thesis Proposal Table

| Column             | Type   | Constraints                                             |
| ------------------ | ------ | ------------------------------------------------------- |
| proposal_id        | integer| **PK, Autoincrement**                                   |
| title              | text   | **NOT NULL**                                            |
| supervisor_id      | text   | **NOT NULL, FK** [teacher](#teacher)(id)                |
| type               | text   | **NOT NULL**                                            |
| description        | text   | **NOT NULL**                                            |
| required_knowledge | text   | **OPTIONAL**                                            |
| notes              | text   | **OPTIONAL**                                            |
| creation_date      | date   | **NOT NULL**                                            |
| expiration         | date   | **NOT NULL**                                            |
| level              | text   | **NOT NULL**                                            |
| is_deleted         | integer| **CHECK (is_deleted == 0 or is_deleted == 1) DEFAULT 0** |
| is_archived        | integer| **CHECK (is_archived == 0 or is_archived == 1) DEFAULT 0**|

---

##### Proposal Keyword Table

| Column        | Type   | Constraints                                             |
| ------------- | ------ | ------------------------------------------------------- |
| proposal_id   | integer| **NOT NULL, FK** [thesisProposal](#thesisProposal)(proposal_id) |
| keyword       | text   | **NOT NULL**                                            |
| PRIMARY KEY   | proposal_id, keyword                                   |

---

##### Proposal Group Table

| Column        | Type   | Constraints                                             |
| ------------- | ------ | ------------------------------------------------------- |
| proposal_id   | integer| **NOT NULL, FK** [thesisProposal](#thesisProposal)(proposal_id) |
| cod_group     | text   | **NOT NULL**                                            |
| PRIMARY KEY   | proposal_id, cod_group                                 |

---

##### Proposal Cds Table

| Column        | Type   | Constraints                                             |
| ------------- | ------ | ------------------------------------------------------- |
| proposal_id   | integer| **NOT NULL, FK** [thesisProposal](#thesisProposal)(proposal_id) |
| cod_degree    | text   | **NOT NULL, FK** [degree](#degree)(cod_degree)          |
| PRIMARY KEY   | proposal_id, cod_degree                                |

---

##### Thesis Internal Co-Supervisor Table

| Column            | Type   | Constraints                                             |
| ----------------- | ------ | ------------------------------------------------------- |
| proposal_id       | integer| **NOT NULL, FK** [thesisProposal](#thesisProposal)(proposal_id) |
| co_supervisor_id  | text   | **NOT NULL, FK** [teacher](#teacher)(id)                |
| PRIMARY KEY       | proposal_id, co_supervisor_id                           |

---

##### External Co-Supervisor Table

| Column   | Type   | Constraints             |
| -------- | ------ | ----------------------- |
| id       | integer| **PK, Autoincrement**   |
| surname  | text   | **NOT NULL**            |
| name     | text   | **NOT NULL**            |
| email    | text   | **NOT NULL**            |

---

##### Thesis External Co-Supervisor Table

| Column            | Type   | Constraints                                             |
| ----------------- | ------ | ------------------------------------------------------- |
| proposal_id       | integer| **NOT NULL, FK** [thesisProposal](#thesisProposal)(proposal_id) |
| co_supervisor_id  | text   | **NOT NULL, FK** [externalCoSupervisor](#externalCoSupervisor)(id) |
| PRIMARY KEY       | proposal_id, co_supervisor_id                           |

---

##### Thesis Application Table

| Column        | Type   | Constraints                                             |
| ------------- | ------ | ------------------------------------------------------- |
| id            | integer| **PK, Autoincrement**                                   |
| proposal_id   | integer| **NOT NULL, FK** [thesisProposal](#thesisProposal)(proposal_id) |
| student_id    | text   | **NOT NULL, FK** [student](#student)(id)                |
| creation_date | date   | **NOT NULL**                                            |
| status        | text   | **DEFAULT 'waiting for approval'**                      |

---

##### Thesis Start Request Table

| Column            | Type   | Constraints                                             |
| ----------------- | ------ | ------------------------------------------------------- |
| **id**            | integer| **PK, Autoincrement**                                   |
| student_id        | text   | **NOT NULL, FK** [student](#student)(**id**)            |
| application_id    | INTEGER|                                                         |
| proposal_id       | integer| **FK** [thesisProposal](#thesisProposal)(**proposal_id**) |
| title             | text   |             **NOT NULL**                                            |
| description       | text   |     **NOT NULL**                                                    |
| supervisor_id     | text   | **NOT NULL, FK** [teacher](#teacher)(**id**)            |
| creation_date     | date   | **NOT NULL**                                            |
| approval_date     | date   |                                                         |
| status            | text   | **DEFAULT 'waiting for approval'**                      |

---

##### Thesis Start Co-Supervisor Table

| Column            | Type   | Constraints                                             |
| ----------------- | ------ | ------------------------------------------------------- |
| start_request_id  | integer| **NOT NULL, FK** [thesisStartRequest](#thesisStartRequest)(**id**) |
| cosupervisor_id   | text   | **NOT NULL, FK** [teacher](#teacher)(**id**)            |
| PRIMARY KEY       | start_request_id, cosupervisor_id                  |


### Relationships

#### Degree and Student:
- **Relationship:** The `student` table has a foreign key `cod_degree` that references the `degree` table's primary key `cod_degree`.
- **Explanation:** This relationship indicates the academic degree program to which a student is enrolled.
---
#### Teacher and ThesisProposal:
- **Relationship:** The `thesisProposal` table has a foreign key `supervisor_id` that references the `teacher` table's primary key `id`.
- **Explanation:** This relationship establishes the connection between a thesis proposal and the teacher who serves as its supervisor (essentially the one who created the thesis proposal).
---
#### ThesisProposal and ThesisInternalCoSupervisor, ThesisExternalCoSupervisor, ProposalKeyword, ProposalGroup, ProposalCds:
- **Relationship:** These tables all have a foreign key `proposal_id` that references the `thesisProposal` table's primary key `proposal_id`.
- **Explanation:** This relationships connect internal/external co-supervisors, keywords, groups and cds-es to specific thesis proposals to allow a 1-n relationship with the same proposal.
---
#### Teacher and ThesisInternalCoSupervisor, thesisStartCosupervisor:
- **Relationship:** Both of these tables have a filed `cosupervisor_id` that references teacher `id` primary key.
- **Explanation:** This relationship establishes a connection between internal co-supervisors and existing teachers.
---
#### ThesisApplication and Student:
- **Relationship:** The `thesisApplication` table has a foreign key `student_id` that references the `student` table's primary key `id`.
- **Explanation:** This relationship links thesis applications to the specific students that made the application for a thesis.
---
#### ThesisApplication and ThesisProposal:
- **Relationship:** The `thesisApplication` table has a foreign key `proposal_id` that references the `thesisProposal` table's primary key `proposal_id`.
- **Explanation:** This relationship associates thesis applications with specific thesis proposals.
---
#### ThesisStartRequest and Teacher:
- **Relationship:** The `thesisStartRequest` table has a foreign key `supervisor_id` that references the `teacher` table's primary key `id`.
- **Explanation:** This relationship connects thesis start requests with the teacher who will be the supervisor.
---
