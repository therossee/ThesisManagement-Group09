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

## React Client Application Routes
- Route `/`: Displays the home page
- Route `/proposals`: Displays the proposals for a student
- Route `/insert-proposal/:id`: Displays the proposal form for the teacher to insert a new thesis proposal.

## API SERVER
### Teacher Login
- HTTP Method: `POST` URL `/api/sessions`
- Description: Validates Login information for the teacher.
- Request body:
```
        {
        "username": "rossi.marco@email.com",
        "password": "d279620"
        }
```
- Response: `201 CREATED` (success)
- Response body: An array of objects, each one containing information on the session user.
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

### STUDENT LOGIN
- HTTP Method: `POST` URL `/api/sessions`
- Description: Validates Login information for the student.
- Request body:
```
        {
        "username": "rossi.abbondanzio@email.com",
        "password": "s294301"
        }
```
- Response: `201 CREATED` (success)
- Response body: An array of objects, each one containing information on the session user.
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
- Error Response: `401 Unauthorized` ("Incorrect email and/or password")
### CURRENT LOGGED USER
- HTTP Method: `GET` URL `/api/sessions/current`
- Description: Retrieves information for the current student logged.
- Request body: _None_
- Response: `200 OK` (success)
- Response body: An array of objects, each one containing information on the actual session user.
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
- Error Response: `401 Unauthorized` ("Incorrect email and/or password")
### LOGOUT
- HTTP Method: `DELETE` URL `/api/sessions/current`
- Description: Closes current session.
- Request body: _None_
- Response: `204 NO CONTENT` (success)
- Response body:  _None_

### INSERT NEW THESIS PROPOSAL
- HTTP Method: `POST` URL `/api/teacher/thesis_proposals`
- Description: Inserts new thesis proposal.
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
- Response body: An array of objects, each one containing information on the thesis proposal.
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
- Error Response: `401 Unauthorized` ("Not authorized")
  
### LIST OF TEACHERS NOT LOGGED
- HTTP Method: `GET` URL `/api/teachers`
- Description: Retrieves list of teachers not logged.
- Request body: _None_
- Response: `200 OK` (success)
- Response body: An array of objects, each one containing information on the not logged teacher.
```
       {
          "teachers": [
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
- Error Response: `401 Unauthorized` ("Not authorized")
### GET LIST OF EXTERNAL CO-SUPERVISORS
- HTTP Method: `GET` URL `/api/externalCoSupervisors`
- Description: Obtains list of external Co-Supervisors..
- Request body: _None_
- Response: `200 OK` (success)
- Response body: An array of objects, contains the information of the external co-supervisors.
```
       {
          "externalCoSupervisors": [
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
- Error Response: `401 Unauthorized` ("Not authorized")
  
### GET ALL KEYWORDS
- HTTP Method: `GET` URL `/api/keywords`
- Description: Obtains list of all the keywords of a thesis.
- Request body: _None_
- Response: `200 OK` (success)
- Response body: An array of objects, contains the keywords.
```
        {
          "keywords": [
            "chemistry",
            "sustainable",
            "fibers",
            "keyword"
          ]
        }
```
- Error Response: `401 Unauthorized` ("Not authorized")
  
### LIST ALL THESIS PROPOSALS OF A TEACHER (supervisor)
- HTTP Method: `GET` URL `/api/thesis_proposals`
- Description: Obtains list of all the thesis proposals of a teacher.
- Request body: _None_
- Response: `200 OK` (success)
- Response body: An array of objects, contains the proposals.
```
        {
            "proposal_id": 2,
            "title": "TitoloTesi",
            "supervisor_id": "d279620",
            "type": "compilativa",
            "description": "description",
            "required_knowledge": "required knowledge",
            "notes": "notes",
            "expiration": "28/11/2023",
            "level": "Bachelor's",
            "cds": "LM-29"
          }
```
- Error Response: `401 Unauthorized` ("Not authorized")

### LIST ALL APPLICATIONS FOR A TEACHER'S THESIS PROPOSAL
- HTTP Method: `GET` URL `/api/teacher/applications`
- Description: Obtains list of all applications for a teacher's proposal.
- Request body: _None_
- Response: `200 OK` (success)
- Response body: An array of objects, contains the applications.
```
        {
        (not implemented yet)
          }
```
- Error Response: `401 Unauthorized` ("Not authorized")

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
