-- Enable foreign key support
PRAGMA foreign_keys = ON;

-- ------------------------------------------
--                  WARNING
--   Do not change schema without updating
--     "init.sql" since it should be the
--                  mirror
-- ------------------------------------------

-- Drop the existing tables if they exist
DROP TABLE IF EXISTS thesisStartCosupervisor;
DROP TABLE IF EXISTS thesisStartRequest;
DROP TABLE IF EXISTS thesisApplication;
DROP TABLE IF EXISTS proposalGroup;
DROP TABLE IF EXISTS proposalKeyword;
DROP TABLE IF EXISTS proposalCds;
DROP TABLE IF EXISTS thesisExternalCoSupervisor;
DROP TABLE IF EXISTS thesisInternalCoSupervisor;
DROP TABLE IF EXISTS thesisProposal;
DROP TABLE IF EXISTS career;
DROP TABLE IF EXISTS externalCoSupervisor;
DROP TABLE IF EXISTS secretaryClerk;
DROP TABLE IF EXISTS teacher;
DROP TABLE IF EXISTS student;
DROP TABLE IF EXISTS degree;
DROP TABLE IF EXISTS configuration;

-- Create the configuration table
CREATE TABLE configuration (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL -- Stringified value
);

-- Create the degree table
CREATE TABLE degree (
    cod_degree TEXT PRIMARY KEY,
    title_degree TEXT NOT NULL UNIQUE
);

-- Create the student table
CREATE TABLE student (
    id TEXT PRIMARY KEY,
    surname TEXT NOT NULL,
    name TEXT NOT NULL,
    gender TEXT NOT NULL,
    nationality TEXT NOT NULL,
    email TEXT NOT NULL,
    cod_degree TEXT NOT NULL,
    enrollment_year INTEGER NOT NULL,
    FOREIGN KEY(cod_degree) REFERENCES degree(cod_degree)
);

-- Create the teacher table
CREATE TABLE teacher (
    id TEXT PRIMARY KEY,
    surname TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    cod_group TEXT NOT NULL,
    cod_department TEXT NOT NULL
);

-- Create the secretaryClerk table
CREATE TABLE secretaryClerk (
    id TEXT PRIMARY KEY,
    surname TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL
);

-- Create the externalCoSupervisor table
CREATE TABLE externalCoSupervisor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    surname TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL
);

-- Create the career table
CREATE TABLE career (
    id TEXT NOT NULL,
    cod_course TEXT NOT NULL,
    title_course TEXT NOT NULL,
    cfu INTEGER NOT NULL,
    grade INTEGER NOT NULL,
    date TEXT NOT NULL,
    FOREIGN KEY(id) REFERENCES student(id),
    PRIMARY KEY(id, cod_course)
);

-- Create the thesisProposal table
CREATE TABLE thesisProposal (
    proposal_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    supervisor_id TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    required_knowledge TEXT,
    notes TEXT,
    creation_date DATE NOT NULL,
    expiration DATE NOT NULL,
    level TEXT NOT NULL,
    is_deleted INTEGER CHECK ( is_deleted == 0 or is_deleted == 1 ) DEFAULT 0,
    is_archived INTEGER CHECK(is_archived == 0 OR is_archived == 1) DEFAULT 0,
    FOREIGN KEY(supervisor_id) REFERENCES teacher(id)
);

-- Create the thesisInternalCoSupervisor table
CREATE TABLE thesisInternalCoSupervisor (
    proposal_id INTEGER NOT NULL,
    co_supervisor_id TEXT NOT NULL,
    FOREIGN KEY(proposal_id) REFERENCES thesisProposal(proposal_id),
    FOREIGN KEY(co_supervisor_id) REFERENCES teacher(id),
    PRIMARY KEY (proposal_id, co_supervisor_id)
);

-- Create the thesisExternalCoSupervisor table
CREATE TABLE thesisExternalCoSupervisor (
    proposal_id INTEGER NOT NULL,
    co_supervisor_id TEXT NOT NULL,
    FOREIGN KEY(proposal_id) REFERENCES thesisProposal(proposal_id),
    FOREIGN KEY(co_supervisor_id) REFERENCES externalCoSupervisor(id),
    PRIMARY KEY (proposal_id, co_supervisor_id)
);

-- Create the proposalCds table
CREATE TABLE proposalCds(
    proposal_id INTEGER NOT NULL,
    cod_degree TEXT NOT NULL,
    FOREIGN KEY (proposal_id) REFERENCES thesisProposal(proposal_id),
    FOREIGN KEY (cod_degree) REFERENCES degree(cod_degree),
    PRIMARY KEY(proposal_id, cod_degree)
);

-- Create the proposalKeyword table
CREATE TABLE proposalKeyword (
    proposal_id INTEGER NOT NULL,
    keyword TEXT NOT NULL,
    FOREIGN KEY(proposal_id) REFERENCES thesisProposal(proposal_id),
    PRIMARY KEY (proposal_id, keyword)
);

-- Create the proposalGroup table
CREATE TABLE proposalGroup (
    proposal_id INTEGER NOT NULL,
    cod_group TEXT NOT NULL,
    FOREIGN KEY(proposal_id) REFERENCES thesisProposal(proposal_id),
    PRIMARY KEY (proposal_id, cod_group)
);

-- Create the thesisApplication table
CREATE TABLE thesisApplication (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    proposal_id INTEGER NOT NULL,
    student_id TEXT NOT NULL,
    creation_date DATE NOT NULL,
    status TEXT DEFAULT 'waiting for approval',
    FOREIGN KEY(proposal_id) REFERENCES thesisProposal(proposal_id),
    FOREIGN KEY(student_id) REFERENCES student(id)
);

-- Create the thesisStartRequest table
CREATE TABLE thesisStartRequest (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT NOT NULL,
    application_id INTEGER,
    proposal_id INTEGER,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    supervisor_id TEXT NOT NULL,
    creation_date DATE NOT NULL,
    approval_date DATE,
    status TEXT DEFAULT 'waiting for approval',
    FOREIGN KEY(student_id) REFERENCES student(id),
    FOREIGN KEY(application_id) REFERENCES thesisApplication(id),
    FOREIGN KEY(proposal_id) REFERENCES thesisProposal(proposal_id),
    FOREIGN KEY(supervisor_id) REFERENCES teacher(id)
);

-- Create the thesisStartCosupervisor table
CREATE TABLE thesisStartCosupervisor (
    start_request_id INTEGER NOT NULL,
    cosupervisor_id TEXT NOT NULL,
    PRIMARY KEY (start_request_id, cosupervisor_id),
    FOREIGN KEY(start_request_id) REFERENCES thesisStartRequest(id),
    FOREIGN KEY(cosupervisor_id) REFERENCES teacher(id)
);

-- Insert Data

-- Insert data into the configuration table
INSERT INTO configuration (key, value)
VALUES
    ('virtual_clock_offset', '0');

-- Insert data into the degree table
INSERT INTO degree (cod_degree, title_degree)
VALUES
    ('L-08', 'Ingegneria Elettronica'),
    ('LM-31', 'Ingegneria dell''Automazione');

-- Insert data into the student table
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year)
VALUES
    ('s320213', 'Barbato', 'Luca', 'Male', 'Italian', 's320213@studenti.polito.it', 'LM-31', 2020),
    ('s321529', 'Ladrat', 'Matteo', 'Male', 'French', 's321529@studenti.polito.it', 'L-08', 2020),
    ('s318952', 'Molinatto', 'Sylvie', 'Female', 'Italian', 's318952@studenti.polito.it', 'L-08', 2020);

-- Insert data into the teacher table
INSERT INTO teacher (id, surname, name, email, cod_group, cod_department)
VALUES
    ('d279620', 'Rossi', 'Marco', 'd279620@polito.it', 'Group1', 'Dep1'),
    ('d370335', 'Bianchi', 'Luca', 'd370335@polito.it', 'Group2', 'Dep2');

-- Insert data into the secretaryClerk table
INSERT INTO secretaryClerk (id, surname, name, email)
VALUES
    ('sc12345', 'Rossi', 'Abbondanzio', 'abbondanzio.rossi@polito.it');

-- Insert data into the externalCoSupervisor table
INSERT INTO externalCoSupervisor (id, surname, name, email)
VALUES
    (1, 'Amato', 'Alice', 'alice.amato@email.com'),
    (2, 'Bianchi', 'Benjamin', 'benjamin.bianchi@email.com'),
    (3, 'Colombo', 'Chiara', 'chiara.colombo@email.com');

-- Insert data into the career table
INSERT INTO career (id, cod_course, title_course, cfu, grade, date)
VALUES ('s318952', 'COURSE_CODE_1', 'Course Title 1', 5, 30, '2023-01-01'),
       ('s318952', 'COURSE_CODE_2', 'Course Title 2', 4, 25, '2023-02-01'),
       ('s318952', 'COURSE_CODE_3', 'Course Title 3', 3, 27, '2023-03-01');

-- Insert data into the thesisProposal table
INSERT INTO thesisProposal (proposal_id, title, supervisor_id, type, description, required_knowledge, notes, creation_date, expiration, level)
VALUES
    (1, 'AI-GUIDED WEB CRAWLER FOR AUTOMATIC DETECTION OF MALICIOUS SITES', 'd279620', 'research project',
     'This thesis focuses on developing an AI-guided web crawler for the automatic detection of malicious sites. The research aims to leverage artificial intelligence to enhance the efficiency and accuracy of web crawling in identifying and cataloging potentially harmful websites.',
     'web development, cybersecurity, and machine learning',
     'The project involves implementing machine learning algorithms for pattern recognition, collaborating with cybersecurity experts, and optimizing web crawling algorithms for real-time detection',
     '2023-10-10T10:45:50.121Z', '2024-11-10T23:59:59.999Z', 'LM'),

    (2, 'PERFORMANCE EVALUATION OF KAFKA CLIENTS USING A REACTIVE API', 'd279620', 'research project',
     'This thesis focuses on the performance evaluation of Kafka clients using a reactive API. The research aims to assess and enhance the efficiency of Kafka clients by implementing a reactive programming approach. The study explores how a reactive API can improve responsiveness and scalability in real-time data streaming applications.',
     'networking protocols, congestion control algorithms, and familiarity with QUIC',
     'The study involves simulations, performance evaluations, and an in-depth analysis of the effectiveness of different congestion control schemes in QUIC',
     '2023-08-22T13:43:56.236Z', '2025-12-24T23:59:59.999Z', 'LM'),

    (3, 'A STUDY OF CONGESTION CONTROL SCHEMES ON QUIC', 'd279620', 'research project',
     'This research paper delves into a comprehensive study of congestion control schemes on QUIC (Quick UDP Internet Connections). The investigation aims to analyze and compare various congestion control strategies within the QUIC protocol, shedding light on their impact on network performance and efficiency.',
     'Strong understanding of web development principles, Proficiency in cybersecurity concepts and best practices, Familiarity with machine learning algorithms and pattern recognition, Knowledge of data structures and algorithms for efficient web crawling.',
     'The project involves implementing cutting-edge machine learning algorithms to enhance the accuracy of malicious site detection. Collaboration with cybersecurity experts is essential to ensure the crawlers effectiveness against evolving threats. Optimization of web crawling algorithms for real-time detection requires a deep understanding of both web technologies and performance optimization techniques.',
     '2023-09-17T21:37:01.176Z', '2026-04-01T23:59:59.999Z', 'LM');

-- Insert data into the thesisExternalCoSupervisor table
INSERT INTO thesisExternalCoSupervisor (proposal_id, co_supervisor_id)
VALUES
    (1, 1),
    (2, 2);

-- Insert data into the proposalCds table
INSERT INTO proposalCds(proposal_id, cod_degree)
VALUES
    (1, 'L-08'),
    (2, 'L-08'),
    (3, 'LM-31');

-- Insert data into the proposalKeyword table
INSERT INTO proposalKeyword (proposal_id, keyword)
VALUES
    (1, 'AI'),
    (1, 'web development'),
    (1, 'research'),
    (2, 'AI'),
    (2, 'reactive API'),
    (3, 'QUIC');

-- Insert data into the proposalGroup table
INSERT INTO proposalGroup (proposal_id, cod_group)
VALUES
    (1, 'Group1'),
    (2, 'Group1'),
    (3, 'Group1');

-- Insert data into the thesisApplication table
INSERT INTO thesisApplication (proposal_id, student_id, creation_date, status)
VALUES
    (3, 's320213', '2021-03-17T21:37:01.176Z', 'accepted');

-- Insert data into the thesisStartRequest table
INSERT INTO thesisStartRequest(student_id, application_id, proposal_id, title, description, supervisor_id, creation_date)
VALUES
    ('s320213', 1, 1, 'AI-GUIDED WEB CRAWLER FOR AUTOMATIC DETECTION OF MALICIOUS SITES', 'This thesis focuses on developing an AI-guided web crawler for the automatic detection of malicious sites. The research aims to leverage artificial intelligence to enhance the efficiency and accuracy of web crawling in identifying and cataloging potentially harmful websites.', 'd279620', '2023-12-12T23:59:59.999Z');


-- Create a trigger that check that the proposal_id of the thesisApplication table is present in the thesisProposal table
-- and that the proposal is not deleted or archived for the insertion and the update
CREATE TRIGGER check_proposal_id_in_application
BEFORE INSERT ON thesisApplication
FOR EACH ROW
WHEN (NEW.proposal_id NOT IN (SELECT proposal_id FROM thesisProposal WHERE is_deleted = 0)
        AND NEW.proposal_id NOT IN (SELECT proposal_id FROM thesisProposal WHERE is_archived = 0))
BEGIN
    SELECT RAISE(ABORT, 'The proposal_id is not present in the thesisProposal table or the proposal is deleted');
END;

CREATE TRIGGER check_proposal_id_in_application_update
BEFORE UPDATE ON thesisApplication
FOR EACH ROW
WHEN (NEW.proposal_id <> OLD.proposal_id
    AND NEW.proposal_id NOT IN (SELECT proposal_id FROM thesisProposal WHERE is_deleted = 0)
    AND NEW.proposal_id NOT IN (SELECT proposal_id FROM thesisProposal WHERE is_archived = 0)
)
BEGIN
    SELECT RAISE(ABORT, 'The proposal_id is not present in the thesisProposal table or the proposal is deleted or archived');
END;