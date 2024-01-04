# DATABASE DOCUMENTATION

## Database File

The project includes a file named 'database.sqlite' located in the 'database' folder. This file contains the actual database used by the project. You can explore the tables and fields described in this documentation section by opening the 'database.sqlite' file.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Database Structure](#database-structure)
  - [Tables](#tables)
  - [Relationships](#relationships)
- [Sample Queries](#sample-queries)

## Introduction



## Features

Highlight key features and capabilities of the database (database type, technology, ...).

## Getting Started

Instructions on how to set up and use the database. (how to install sqlite3 and see the content)

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
  Once the db has been generated, it can be counsulted by opening the 'database.sqlite' file (an appropriate vscode exention is necessary - for example 'SQLite Viewer').

## Database Structure
In our database there are the following tables:

- configuration(**key**, value)
  → This table is necessary for the virtual clock management. The default value for the 'value' attribute is 0 (note that it's stringified value). This means that the virtual clock is disabled. When we change the date it will assume another value.
- student(**id**, surname, name, gender, nationality, email, cod_degree, enrollment_year)  
- teacher(**id**, surname, name, email, cod_group, cod_department)
- degree(**cod_degree**, title_degree)
- career(**id**, **cod_course**, title_course, cfu, grade, date)
  → the career table contains all the courses taken by the students. The field 'id' is the student id, so it is possible to know all the courses a specific student attended filtering by the id.
- thesisProposal(**proposal_id**, title, supervisor_id, type, description, required_knowledge, creation_date, expiration, level, is_deleted, is_archived)
  → this table contains all the relevant information for a thesis proposal. We can also be aware if a particular thesis is deleted or archived by the attributes 'is_deleted' and 'is_archived' (0 → non deleted/archived, 1 otherwise)
- proposalKeyword(**proposal_id**, **keyword**)
  - proposalKeyword(**proposal_id**, **keyword**)
    → This table stores the keywords for each proposal, allowing multiple keywords for the same proposal. Similar tables exist for groups, degree programs, internal co-supervisors and external co-supervisors, enabling multiple entries for each category.
- proposalGroup(**proposal_id**, **cod_group**)
- proposalCds(**proposal_id**, **cod_degree**)
- thesisInternalCoSupervisor(**proposal_id**, **co_supervisor_id**)
- externalCoSupervisor(**id**, surname, name, email)
- thesisExternalCoSupervisor(**proposal_id**, **co_supervisor_id**)
- thesisApplication(**id**, proposal_id, student_id, creation_date, status)
  → this table stores the applications for the thesis proposals (related to a specific thesis proposal -> proposal_id and made by a specific student -> student_id). The status attribute is by defeault 'waiting for approval', but it can be set to 'approved' or 'rejected'.
- thesiStartRequest(**id**, student_id, application_id, proposal_id, title, description, supervisor_id, creation_date, approval_date, status)
  → this table captures comprehensive details to characterize a thesis start request. The student_id, supervisor_id, and creation_date attributes are non-nullable because initiating a request necessitates essential information such as the student making the request, the professor to whom it is addressed, and the date indicating when the request was made. On the other hand, all the other attributes can be null because we want to allow the possibility to make a start request and then complete all the information after discussing it (as requested by the specifications).
- thesisStartCosupervisor(**start_request_id**, **cosupervisor_id**)
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
| title             | text   |                                                         |
| description       | text   |                                                         |
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
Explain the relationships between different tables.

## Sample Queries
Include sample SQL queries to demonstrate basic operations and common use cases.