# DATABASE DOCUMENTATION

## Database File

Within the project, you will find a file named 'database.sqlite' situated in the 'database' directory. This file serves as the primary database for the project. Additionally, there is another database, 'test_database.sqlite,' which is exclusively employed for testing purposes.
The 'scripts' folder contains the two SQL files responsible for generating the respective databases.

## Table of Contents

- [Introduction](#introduction)
- [Key Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Database Structure](#database-structure)
  - [Tables](#tables)
  - [Relationships](#relationships)

## Introduction

The database is a **relational database**, which means that it stores data in tables with defined relationships between them. This structure makes it easy to query and manage data, and it is also well-suited for storing complex relationships between entities like students, thesis proposals, supervisors, and co-supervisors.
  
It is **implemented using SQLite**, which is a lightweight, embedded SQL database engine that is often used for personal applications or for storing data within applications. It is a good choice for this project because it is easy to use and deploy, and it is also relatively efficient for the size of data that will be stored.

## Key Features
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
- secretaryClerk(**id**, surname, name, email)
  
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

##### Secretary Clerk Table

| Column  | Type | Constraints       |
|---------|------|-------------------|
| id      | TEXT | **PK**            |
| surname | TEXT | **NOT NULL**      |
| name    | TEXT | **NOT NULL**      |
| email   | TEXT | **NOT NULL**      |

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
