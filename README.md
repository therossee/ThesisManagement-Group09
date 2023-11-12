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

## API SERVER

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
    | enrollment_year   | text     | **NOT NULL**                          |

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
    | cod_degree   | TEXT     | **PK**                |
    | title_degree | TEXT     | **NOT NULL**, **Unique** |

- Table `career`
    | Column        | Type    | Constraints                                          |
    | ------------- | ------- | ---------------------------------------------------- |
    | id            | TEXT    | **NOT NULL**, **FK** [student](#student)(id)         |
    | cod_course    | TEXT    | **NOT NULL**                                         |
    | title_course  | TEXT    | **NOT NULL**                                         |
    | cfu           | INTEGER | **NOT NULL**                                         |
    | grade         | REAL    | **NOT NULL**                                         |
    | date          | TEXT    | **NOT NULL**                                         |
    | PRIMARY KEY   | id, cod_course                                        |

- Table `thesisProposal`
    | Column             | Type     | Constraints                                           |
    | ------------------ | -------- | ----------------------------------------------------- |
    | proposal_id        | INTEGER  | **PK**, **Autoincrement**                             |
    | title              | TEXT     | **NOT NULL**                                          |
    | supervisor_id      | TEXT     | **NOT NULL**, **FK** [teacher](#teacher)(id)          |
    | type               | TEXT     | **NOT NULL**                                          |
    | description        | TEXT     | **NOT NULL**                                          |
    | required_knowledge | TEXT     |                                                       |
    | notes              | TEXT     |                                                       |
    | expiration         | TEXT     | **NOT NULL**                                          |
    | level              | TEXT     | **NOT NULL**                                          |
    | cds                | TEXT     | **NOT NULL**, **FK** [degree](#degree)(cod_degree)    |

- Table `proposalKeyword`
    | Column        | Type    | Constraints                                          |
    | ------------- | ------- | ---------------------------------------------------- |
    | proposal_id   | INTEGER | **NOT NULL**, **FK** [thesisProposal](#thesisProposal)(proposal_id) |
    | keyword       | TEXT    | **NOT NULL**                                         |
    | PRIMARY KEY   | proposal_id, keyword                                |

- Table `proposalGroup`
    | Column        | Type    | Constraints                                          |
    | ------------- | ------- | ---------------------------------------------------- |
    | proposal_id   | INTEGER | **NOT NULL**, **FK** [thesisProposal](#thesisProposal)(proposal_id) |
    | cod_group     | TEXT    | **NOT NULL**                                         |
    | PRIMARY KEY   | proposal_id, cod_group                              |

- Table `thesisInternalCoSupervisor`
    | Column            | Type     | Constraints                                         |
    | ----------------- | -------- | --------------------------------------------------- |
    | proposal_id       | INTEGER  | **NOT NULL**, **FK** [thesisProposal](#thesisProposal)(proposal_id) |
    | co_supervisor_id  | TEXT     | **NOT NULL**, **FK** [teacher](#teacher)(id)         |
    | PRIMARY KEY       | proposal_id, co_supervisor_id                        |

- Table `externalCoSupervisor`
    | Column   | Type    | Constraints                        |
    | -------- | ------- | ---------------------------------- |
    | id       | INTEGER | **PK**, **Autoincrement**           |
    | surname  | TEXT    | **NOT NULL**                       |
    | name     | TEXT    | **NOT NULL**                       |
    | email    | TEXT    | **NOT NULL**                       |

- Table `thesisExternalCoSupervisor`
    | Column            | Type     | Constraints                                         |
    | ----------------- | -------- | --------------------------------------------------- |
    | proposal_id       | INTEGER  | **NOT NULL**, **FK** [thesisProposal](#thesisProposal)(proposal_id) |
    | co_supervisor_id  | TEXT     | **NOT NULL**, **FK** [externalCoSupervisor](#externalCoSupervisor)(id) |
    | PRIMARY KEY       | proposal_id, co_supervisor_id                        |
