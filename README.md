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
docker run -p 5173:5173 -p 3000:3000 --name thesis_management apokalypt/09_thesis_management
```
### External documentation
- [Docker](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

---

## React Client Application Routes
- Route `/`: Displays the home page
- Route `/proposals`: Displays the proposals for a student
- Route `/insert-proposal`: Displays the proposal form for the teacher to insert a new thesis proposal.

## API SERVER

### LOGIN
- HTTP Method: `POST` URL `/api/sessions`
- Description: Validates Login information for the user.
- Request body:
```
        {
          "username": "rossi.marco@email.com",
          "password": "d279620"
        }
```
- Response: `201 CREATED` (success)
- Response body: An object containing information on the user logged in.
```
        {
          "id": "d279620",
          "surname": "Rossi",
          "name": "Marco",
          "email": "rossi.marco@email.com",
          "cod_group": "Group1",
          "cod_department": "Dep1"
        }
```
- Error Response: `401 Unauthorized` ("Incorrect email and/or password")

### GET CURRENT LOGGED USER
- HTTP Method: `GET` URL `/api/sessions/current`
- Description: Retrieves information for the current user logged.
- Request body: _None_
- Response: `200 OK` (success)
- Response body: An object containing information on the actual logged user.
```
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
- HTTP Method: `DELETE` URL `/api/sessions/current`
- Description: Closes current session.
- Request body: _None_
- Response: `204 NO CONTENT` (success)
- Response body:  _None_

### INSERT NEW THESIS PROPOSAL
- HTTP Method: `POST` URL `/api/teacher/thesis_proposals`
- Description: Inserts new thesis proposal. 
- Details: Route only for logged teachers
- Request body:
```
       {
          "title": "TitoloTesi",
          "supervisor_id": "d279620",
          "internal_co_supervisors_id": ["d370335"],
          "external_co_supervisors_id": ["1"],
          "type": "compilativa",
          "description": "description",
          "required_knowledge": "required knowledge",
          "notes": "notes",
          "expiration": "28/11/2023",
          "level": "Bachelor's",
          "cds" : "LM-29",
          "keywords": ["keyword"]
        }
```
- Response: `201 CREATED` (success)
- Response body: An object containing information on the thesis proposal.
```
        {
          "id": 2,
          "title": "TitoloTesi",
          "supervisor_id": "d279620",
          "internal_co_supervisors_id": [
            "d370335"
          ],
          "external_co_supervisors_id": [
            "1"
          ],
          "type": "compilativa",
          "groups": [
            "Group1",
            "Group2"
          ],
          "description": "description",
          "required_knowledge": "required knowledge",
          "notes": "notes",
          "expiration": "28/11/2023",
          "level": "Bachelor's",
          "cds": "LM-29",
          "keywords": [
            "keyword"
          ]
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
```
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
```
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
```
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
```
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
- Description: Obtains list of all the thesis proposals for the course of study of the logged student.
- Details: Routes only for logged students
- Request body: _None_
- Response: `200 OK` (success)
- Response body: Some metadata (number of proposals found) and an array of objects, each one containing info on a proposal.
```
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

### GET THESIS PROPOSAL BY ID (for student belonging to the same cds of the proposal)
- HTTP Method: `GET` URL `/api/thesis-proposals/:id`
- Description: Return the proposal with the given id related to a student degree (if exists).
- Details: Routes only for logged students
- Request body: _None_
- Response: `200 OK` (success)
- Response body: an object containing info on the proposal.
```
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

### APPLY FOR THESIS PROPOSAL
- HTTP Method: `POST` URL `/api/student/applications`
- Description: A student apply for a thesis proposal.
- Details: Routes only for logged students
- Request body: 
  ```
  {
      "thesis_proposal_id": 2
  }
  ```
- Response: `201 CREATED` (success)
- Response body: An object containting the details of the application.
```
        {
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
- HTTP Method: `POST` URL `/api/teacher/thesis_proposals`
- Description: Get the list of proposals of the logged teacher.
- Details: Routes only for logged teachers
- Request body: _None_
- Response: `200 OK` (success)
- Response body: An array containting all the proposals of the logged teacher.
```
        [
          {
            "proposal_id": 1,
            "title": "AI-GUIDED WEB CRAWLER FOR AUTOMATIC DETECTION OF MALICIOUS SITES",
            "supervisor_id": "d279620",
            "type": "research project",
            "description": "This thesis focuses on developing an AI-guided web crawler for the automatic detection of malicious sites.",
            "expiration": "2024-11-10",
            "level": "LM",
            "cds": "LM-32"
          }
        ]
```
Error Responses: 
    - `401 Unauthorized` ("Not authorized")
    - `403 Forbidden` ("Unauthorized")
    - `500 Internal Server Error` 

### LIST ALL APPLICATIONS FOR A TEACHER'S THESIS PROPOSAL
- HTTP Method: `POST` URL `/api/teacher/applications/:id`
- Description: Get the list of applications for the proposal of the logged teacher.
- Details: Routes only for logged teachers
- Request body: _None_
- Response: `200 OK` (success)
- Response body: An array containting all the applications for the proposal of the logged teacher.
```
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
- HTTP Method: `POST` URL `/api/student/applications`
- Description: Get the list of applications of the logged student.
- Details: Routes only for logged students
- Request body: _None_
- Response: `200 OK` (success)
- Response body: An array containting all the applications of the logged user.
```
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
  ```
  {
      "student_id": "s299119"
  }
  ```
- Response: `200 OK` (success)
- Response body: A message.
```
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
  ```
  {
      "student_id": "s299119"
  }
  ```
- Response: `200 OK` (success)
- Response body: A message.
```
        {
          "message": "Thesis successfully rejected"
        }
```
Error Responses: 
    - `400 Bad Request` ("Missing required fields")
    - `401 Unauthorized` ("Not authorized")
    - `403 Forbidden` ("Unauthorized")
    - `500 Internal Server Error` 

## Database Tables

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
    | proposal_id        | integer  | **PK**, **Autoincrement**                             |
    | title              | text     | **NOT NULL**                                          |
    | supervisor_id      | text     | **NOT NULL**, **FK** [teacher](#teacher)(id)          |
    | type               | text     | **NOT NULL**                                          |
    | description        | text     | **NOT NULL**                                          |
    | required_knowledge | text     | **OPTIONAL**                                          |
    | notes              | text     | **OPTIONAL**                                          |
    | expiration         | text     | **NOT NULL**                                          |
    | level              | text     | **NOT NULL**                                          |
    | cds                | text     | **NOT NULL**, **FK** [degree](#degree)(cod_degree)    |

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
    | proposal_id   | integer | **NOT NULL**, **FK** [thesisProposal](#thesisProposal)(proposal_id) |
    | student_id    | text    | **NOT NULL**, **FK** [student](#student)(id)         |
    | status        | text    | **DEFAULT 'waiting for approval' NOT NULL**         |
    | PRIMARY KEY   | proposal_id, student_id                             |
