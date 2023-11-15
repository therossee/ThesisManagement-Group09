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
