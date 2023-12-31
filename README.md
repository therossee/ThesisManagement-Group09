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



## Database Tables
- Table `configuration`:
    | Column            | Type     | Constraints                           |
    | ----------------- | -------- | ------------------------------------- |
    | key               | text     | **PK**                                |
    | value             | text     | **NOT NULL**                          |

- Table `student`:
    | Column            | Type     | Constraints                           |
    | ----------------- | -------- | ------------------------------------- |
    | id                | text     | **PK**                                |
    | surname           | text     | **NOT NULL**                          |
    | name              | text     | **NOT NULL**                          |
    | gender            | text     | **NOT NULL**                          |
    | nationality      | text     | **NOT NULL**                          |
    | email            | text     | **NOT NULL**                          |
    | cod_degree        | text     | **NOT NULL**, **FK** [degree](#degree)(cod_degree)  |
    | enrollment_year   | integer     | **NOT NULL**                          |

- Table `teacher`
    | Column          | Type     | Constraints     |
    | --------------- | -------- | --------------- |
    | id              | text     | **PK**          |
    | surname         | text     | **NOT NULL**    |
    | name            | text     | **NOT NULL**    |
    | email           | text     | **NOT NULL**    |
    | cod_group       | text     | **NOT NULL**    |
    | cod_department  | text     | **NOT NULL**    |

- Table `degree`
    | Column       | Type     | Constraints           |
    | ------------ | -------- | --------------------- |
    | cod_degree   | text     | **PK**                |
    | title_degree | text     | **NOT NULL**, **Unique** |

- Table `career`
    | Column        | Type    | Constraints                                          |
    | ------------- | ------- | ---------------------------------------------------- |
    | id            | text    | **NOT NULL**, **FK** [student](#student)(id)         |
    | cod_course    | text    | **NOT NULL**                                         |
    | title_course  | text    | **NOT NULL**                                         |
    | cfu           | integer | **NOT NULL**                                         |
    | grade         | real    | **NOT NULL**                                         |
    | date          | text    | **NOT NULL**                                         |
    | PRIMARY KEY   | id, cod_course                                        |

- Table `thesisProposal`
    | Column             | Type     | Constraints                                           |
    | ------------------ | -------- | ----------------------------------------------------- |
    | proposal_id        | integer  | **PK, Autoincrement**                                 |
    | title              | text     | **NOT NULL**                                          |
    | supervisor_id      | text     | **NOT NULL, FK** [teacher](#teacher)(id)               |
    | type               | text     | **NOT NULL**                                          |
    | description        | text     | **NOT NULL**                                          |
    | required_knowledge | text     | **OPTIONAL**                                          |
    | notes              | text     | **OPTIONAL**                                          |
    | creation_date      | date     | **NOT NULL**                                          |
    | expiration         | date     | **NOT NULL**                                          |
    | level              | text     | **NOT NULL**                                          |
    | is_deleted         | integer  | **CHECK (is_deleted == 0 or is_deleted == 1) DEFAULT 0** |
    | is_archived        | integer  | **CHECK (is_archived == 0 or is_archived == 1) DEFAULT 0** |


- Table `proposalKeyword`
    | Column        | Type    | Constraints                                          |
    | ------------- | ------- | ---------------------------------------------------- |
    | proposal_id   | integer | **NOT NULL**, **FK** [thesisProposal](#thesisProposal)(proposal_id) |
    | keyword       | text    | **NOT NULL**                                         |
    | PRIMARY KEY   | proposal_id, keyword                                |

- Table `proposalGroup`
    | Column        | Type    | Constraints                                          |
    | ------------- | ------- | ---------------------------------------------------- |
    | proposal_id   | integer | **NOT NULL**, **FK** [thesisProposal](#thesisProposal)(proposal_id) |
    | cod_group     | text    | **NOT NULL**                                         |
    | PRIMARY KEY   | proposal_id, cod_group                              |

- Table `proposalCds`:
    | Column        | Type    | Constraints                                          |
    | ------------- | ------- | ---------------------------------------------------- |
    | proposal_id   | integer | **NOT NULL**, **FK** [thesisProposal](#thesisProposal)(proposal_id) |
    | cod_degree    | text    | **NOT NULL**, **FK** [degree](#degree)(cod_degree)   |
    | PRIMARY KEY   | proposal_id, cod_degree                             |


- Table `thesisInternalCoSupervisor`
    | Column            | Type     | Constraints                                         |
    | ----------------- | -------- | --------------------------------------------------- |
    | proposal_id       | integer  | **NOT NULL**, **FK** [thesisProposal](#thesisProposal)(proposal_id) |
    | co_supervisor_id  | text     | **NOT NULL**, **FK** [teacher](#teacher)(id)         |
    | PRIMARY KEY       | proposal_id, co_supervisor_id                        |

- Table `externalCoSupervisor`
    | Column   | Type    | Constraints                        |
    | -------- | ------- | ---------------------------------- |
    | id       | integer | **PK**, **Autoincrement**           |
    | surname  | text    | **NOT NULL**                       |
    | name     | text    | **NOT NULL**                       |
    | email    | text    | **NOT NULL**                       |

- Table `thesisExternalCoSupervisor`
    | Column            | Type     | Constraints                                         |
    | ----------------- | -------- | --------------------------------------------------- |
    | proposal_id       | integer  | **NOT NULL**, **FK** [thesisProposal](#thesisProposal)(proposal_id) |
    | co_supervisor_id  | text     | **NOT NULL**, **FK** [externalCoSupervisor](#externalCoSupervisor)(id) |
    | PRIMARY KEY       | proposal_id, co_supervisor_id                        |

- Table `thesisApplication`:
    | Column        | Type    | Constraints                                          |
    | ------------- | ------- | ---------------------------------------------------- |
    | id            | integer | **PK, Autoincrement**                               |
    | proposal_id   | integer | **NOT NULL, FK** [thesisProposal](#thesisProposal)(proposal_id) |
    | student_id    | text    | **NOT NULL, FK** [student](#student)(id)             |
    | creation_date | date    | **NOT NULL**                                         |
    | status        | text    | **DEFAULT 'waiting for approval'**         |

