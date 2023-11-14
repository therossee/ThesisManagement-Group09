-- Drop the existing tables if they exist
DROP TABLE IF EXISTS student;
DROP TABLE IF EXISTS teacher;
DROP TABLE IF EXISTS externalCoSupervisor;
DROP TABLE IF EXISTS degree;
DROP TABLE IF EXISTS career;
DROP TABLE IF EXISTS thesisProposal;
DROP TABLE IF EXISTS thesisInternalCoSupervisor;
DROP TABLE IF EXISTS thesisExternalCoSupervisor;
DROP TABLE IF EXISTS proposalKeyword;
DROP TABLE IF EXISTS proposalGroup;
DROP TABLE IF EXISTS thesisApplication;

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
    expiration DATE NOT NULL,
    level TEXT NOT NULL,
    cds TEXT NOT NULL,
    FOREIGN KEY(supervisor_id) REFERENCES teacher(id),
    FOREIGN KEY(cds) REFERENCES degree(cod_degree)
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
    proposal_id INTEGER NOT NULL,
    student_id TEXT NOT NULL,
    status TEXT DEFAULT 'waiting for approval',
    FOREIGN KEY(proposal_id) REFERENCES thesisProposal(proposal_id),
    FOREIGN KEY(student_id) REFERENCES student(id),
    PRIMARY KEY (proposal_id, student_id)
);



-- Insert Data

-- Insert data into the degree table
INSERT INTO degree (cod_degree, title_degree)
VALUES
    ('L-07', 'Ingegneria Civile e Ambientale'),
    ('L-08', 'Ingegneria Elettronica'),
    ('L-09', 'Ingegneria dell''Informazione'),
    ('LM-20', 'Ingegneria Chimica'),
    ('LM-21', 'Ingegneria dei Materiali'),
    ('LM-22', 'Ingegneria Meccanica'),
    ('LM-23', 'Ingegneria Aerospaziale'),
    ('LM-24', 'Ingegneria Nucleare'),
    ('LM-25', 'Ingegneria dei Trasporti e della Logistica'),
    ('LM-26', 'Ingegneria Matematica'),
    ('LM-27', 'Ingegneria delle Telecomunicazioni'),
    ('LM-28', 'Ingegneria Biomedica'),
    ('LM-29', 'Ingegneria Gestionale'),
    ('LM-30', 'Ingegneria dell''Energia'),
    ('LM-31', 'Ingegneria dell''Automazione'),
    ('LM-32', 'Ingegneria Informatica'),
    ('LM-33', 'Ingegneria dell''Automazione e dei Sistemi di Controllo'),
    ('LM-34', 'Ingegneria dell''Informazione per l''Organizzazione Aziendale'),
    ('LM-35', 'Ingegneria della Produzione Industriale');


-- Insert data into the teacher table
INSERT INTO teacher (id, surname, name, email, cod_group, cod_department)
VALUES
    ('d279620', 'Rossi', 'Marco', 'rossi.marco@email.com', 'Group1', 'Dep1'),
    ('d370335', 'Bianchi', 'Luca', 'bianchi.luca@email.com', 'Group2', 'Dep2'),
    ('d350985', 'Esposito', 'Andrea', 'esposito.andrea@email.com', 'Group3', 'Dep3'),
    ('d255269', 'Romano', 'Giovanni', 'romano.giovanni@email.com', 'Group4', 'Dep4'),
    ('d357587', 'Ricci', 'Matteo', 'ricci.matteo@email.com', 'Group5', 'Dep1'),
    ('d250665', 'Conti', 'Alessandro', 'conti.alessandro@email.com', 'Group6', 'Dep2'),
    ('d277137', 'Colombo', 'Davide', 'colombo.davide@email.com', 'Group1', 'Dep3'),
    ('d314371', 'Bruno', 'Francesco', 'bruno.francesco@email.com', 'Group2', 'Dep4'),
    ('d270993', 'Moretti', 'Paolo', 'moretti.paolo@email.com', 'Group3', 'Dep1'),
    ('d342424', 'Luci', 'Simone', 'luci.simone@email.com', 'Group4', 'Dep2'),
    ('d370392', 'Martini', 'Maria', 'martini.maria@email.com', 'Group5', 'Dep3'),
    ('d226172', 'Ferretti', 'Anna', 'ferretti.anna@email.com', 'Group6', 'Dep4'),
    ('d226682', 'Mancini', 'Giulia', 'mancini.giulia@email.com', 'Group1', 'Dep1'),
    ('d258293', 'Barbieri', 'Francesca', 'barbieri.francesca@email.com', 'Group2', 'Dep2'),
    ('d320694', 'Rinaldi', 'Sofia', 'rinaldi.sofia@email.com', 'Group3', 'Dep3'),
    ('d284435', 'Caruso', 'Laura', 'caruso.laura@email.com', 'Group4', 'Dep4'),
    ('d258761', 'Ferrara', 'Valentina', 'ferrara.valentina@email.com', 'Group5', 'Dep1'),
    ('d237188', 'Marini', 'Alessia', 'marini.alessia@email.com', 'Group6', 'Dep2'),
    ('d392000', 'Santoro', 'Chiara', 'santoro.chiara@email.com', 'Group5', 'Dep3'),
    ('d292715', 'Gatti', 'Isabella', 'gatti.isabella@email.com', 'Group3', 'Dep4');


-- Insert data into the externalCoSupervisor table
INSERT INTO externalCoSupervisor (surname, name, email)
VALUES
    ('Amato', 'Alice', 'alice.amato@email.com'),
    ('Bianchi', 'Benjamin', 'benjamin.bianchi@email.com'),
    ('Colombo', 'Chiara', 'chiara.colombo@email.com'),
    ('Deluca', 'Davide', 'davide.deluca@email.com'),
    ('Esposito', 'Elena', 'elena.esposito@email.com'),
    ('Ferrari', 'Federico', 'federico.ferrari@email.com'),
    ('Greco', 'Giulia', 'giulia.greco@email.com'),
    ('Moretti', 'Luca', 'luca.moretti@email.com'),
    ('Rossi', 'Isabella', 'isabella.rossi@email.com'),
    ('Russo', 'Marco', 'marco.russo@email.com');

-- Insert data into the student table
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year)
VALUES
    ('s294301', 'Rossi', 'Abbondanzio', 'Male', 'Italian', 'rossi.abbondanzio@email.com', 'L-07', 2020),
    ('s309429', 'Ferrari', 'Abbondio', 'Male', 'Italian', 'ferrari.abbondio@email.com', 'L-08', 2024),
    ('s322044', 'Russo', 'Abelardo', 'Male', 'Italian', 'russo.abelardo@email.com', 'L-09', 2023),
    ('s288327', 'Esposito', 'Abenzio', 'Male', 'Italian', 'esposito.abenzio@email.com', 'L-09', 2021),
    ('s287107', 'Bianchi', 'Abramio', 'Male', 'Italian', 'bianchi.abramio@email.com', 'L-08', 2022),
    ('s288512', 'Romano', 'Acacio', 'Male', 'Italian', 'romano.acacio@email.com', 'LM-22', 2021),
    ('s318894', 'Gallo', 'Accursio', 'Male', 'Italian', 'gallo.accursio@email.com', 'LM-30', 2018),
    ('s299838', 'Costa', 'Acilio', 'Male', 'Italian', 'costa.acilio@email.com', 'LM-33', 2023),
    ('s301938', 'Fontana', 'Caldo', 'Male', 'Italian', 'fontana.caldo@email.com', 'LM-27', 2022),
    ('s322276', 'Conti', 'Acrisio', 'Male', 'Italian', 'conti.acrisio@email.com', 'LM-34', 2021),
    ('s317988', 'Ricci', 'Adalberto', 'Male', 'Italian', 'ricci.adalberto@email.com', 'LM-34', 2023),
    ('s304823', 'Bruno', 'Adalgiso', 'Male', 'Italian', 'bruno.adalgiso@email.com', 'LM-28', 2019),
    ('s289041', 'De Luca', 'Adamo', 'Male', 'Italian', 'de luca.adamo@email.com', 'LM-24', 2021),
    ('s297117', 'Moretti', 'Adelardo', 'Male', 'Italian', 'moretti.adelardo@email.com', 'LM-21', 2021),
    ('s293605', 'Marino', 'Adelchi', 'Male', 'Italian', 'marino.adelchi@email.com', 'LM-33', 2024),
    ('s324327', 'Greco', 'Adelgardo', 'Male', 'Italian', 'greco.adelgardo@email.com', 'LM-21', 2021),
    ('s289300', 'Barbieri', 'Adeodato', 'Male', 'Italian', 'barbieri.adeodato@email.com', 'LM-35', 2021),
    ('s313395', 'Lombardi', 'Adone', 'Male', 'Italian', 'lombardi.adone@email.com', 'LM-30', 2019),
    ('s313562', 'Giordano', 'Adrione', 'Male', 'Italian', 'giordano.adrione@email.com', 'LM-30', 2022),
    ('s317577', 'Cassano', 'Agabio', 'Male', 'Italian', 'cassano.agabio@email.com', 'LM-23', 2024),
    ('s329608', 'Colombo', 'Agapito', 'Male', 'Italian', 'colombo.agapito@email.com', 'LM-30', 2022),
    ('s308631', 'Mancini', 'Agenore', 'Male', 'Italian', 'mancini.agenore@email.com', 'LM-31', 2022),
    ('s291500', 'Longo', 'Agostino', 'Male', 'Italian', 'longo.agostino@email.com', 'LM-35', 2021),
    ('s303712', 'Marchetti', 'Aiace', 'Male', 'Italian', 'marchetti.aiace@email.com', 'LM-35', 2021),
    ('s296014', 'Martini', 'Aimone', 'Male', 'Italian', 'martini.aimone@email.com', 'LM-24', 2021),
    ('s323519', 'Galli', 'Albano', 'Male', 'Italian', 'galli.albano@email.com', 'LM-25', 2024),
    ('s290090', 'Gatti', 'Alamanno', 'Male', 'Italian', 'gatti.alamanno@email.com', 'LM-27', 2021),
    ('s319332', 'Zarella', 'Lorena', 'Female', 'Italian', 'zarella.lorena@email.com', 'LM-20', 2021),
    ('s308699', 'Zarlengo', 'Lorenza', 'Female', 'Italian', 'zarlengo.lorenza@email.com', 'LM-31', 2020),
    ('s313316', 'Zaro', 'Luana', 'Female', 'Italian', 'zaro.luana@email.com', 'LM-31', 2022),
    ('s319540', 'Zarrella', 'Emma', 'Female', 'Italian', 'zarrella.emma@email.com', 'LM-20', 2021),
    ('s290157', 'Zarrilli', 'Enrica', 'Female', 'Italian', 'zarrilli.enrica@email.com', 'LM-25', 2023),
    ('s299119', 'Zarro', 'Erica', 'Female', 'Italian', 'zarro.erica@email.com', 'LM-34', 2023),
    ('s290592', 'Zavaglia', 'Ermenegilda', 'Female', 'Italian', 'zavaglia.ermenegilda@email.com', 'LM-22', 2022),
    ('s315270', 'Zecca', 'Erminia', 'Female', 'Italian', 'zecca.erminia@email.com', 'LM-35', 2024),
    ('s296510', 'Zegarelli', 'Ermione', 'Female', 'Italian', 'zegarelli.ermione@email.com', 'LM-28', 2019),
    ('s290989', 'Giacomo', 'Ersilia', 'Female', 'Italian', 'giacomo.ersilia@email.com', 'LM-29', 2022),
    ('s305475', 'Giacona', 'Eugenia', 'Female', 'Italian', 'giacona.eugenia@email.com', 'LM-23', 2024);



-- Insert data into the career table
INSERT INTO career (id, cod_course, title_course, cfu, grade, date)
VALUES
    ('s309429', '01DSHOV', 'Big data processing and analytics', 6, 29, '1/12/2022'),
    ('s309429', '01URTOV', 'Machine learning and pattern recognition', 6, 29, '2/12/2022');

-- Insert data into the thesisProposal table
INSERT INTO thesisProposal (title, supervisor_id, type, description, required_knowledge, notes, expiration, level, cds)
VALUES
    ('AI-GUIDED WEB CRAWLER FOR AUTOMATIC DETECTION OF MALICIOUS SITES', 'd279620', 'research project',
    'This thesis focuses on developing an AI-guided web crawler for the automatic detection of malicious sites. The research aims to leverage artificial intelligence to enhance the efficiency and accuracy of web crawling in identifying and cataloging potentially harmful websites.',
    'web development, cybersecurity, and machine learning',
    'The project involves implementing machine learning algorithms for pattern recognition, collaborating with cybersecurity experts, and optimizing web crawling algorithms for real-time detection',
    '2024-11-10', 'LM', 'LM-32'),

    ('PERFORMANCE EVALUATION OF KAFKA CLIENTS USING A REACTIVE API', 'd370335', 'research project',
    'This thesis focuses on the performance evaluation of Kafka clients using a reactive API. The research aims to assess and enhance the efficiency of Kafka clients by implementing a reactive programming approach. The study explores how a reactive API can improve responsiveness and scalability in real-time data streaming applications.',
    'networking protocols, congestion control algorithms, and familiarity with QUIC',
    'The study involves simulations, performance evaluations, and an in-depth analysis of the effectiveness of different congestion control schemes in QUIC',
    '2025-12-24', 'LM', 'LM-32'),

    ('A STUDY OF CONGESTION CONTROL SCHEMES ON QUIC', 'd350985', 'research project',
    'This research paper delves into a comprehensive study of congestion control schemes on QUIC (Quick UDP Internet Connections). The investigation aims to analyze and compare various congestion control strategies within the QUIC protocol, shedding light on their impact on network performance and efficiency.',
    'Strong understanding of web development principles, Proficiency in cybersecurity concepts and best practices, Familiarity with machine learning algorithms and pattern recognition, Knowledge of data structures and algorithms for efficient web crawling.',
    'The project involves implementing cutting-edge machine learning algorithms to enhance the accuracy of malicious site detection. Collaboration with cybersecurity experts is essential to ensure the crawlers effectiveness against evolving threats. Optimization of web crawling algorithms for real-time detection requires a deep understanding of both web technologies and performance optimization techniques.',
    '2026-04-01', 'LM', 'LM-32'),

    ('ULTRA-LOW-POWER ACOUSTIC SENSOR FRONTEND A DIGITAL TRANSCONDUCTANCE AMPLIFIER APPROACH', 'd255269', 'dissertation',
    'This dissertation focuses on the design and implementation of an ultra-low-power acoustic sensor frontend using a digital transconductance amplifier approach. The research aims to explore novel methods in signal processing and circuit design to achieve highly efficient and low-power acoustic sensing capabilities.',
    'analog and digital circuit design, signal processing, and low-power electronics',
    'The project involves the development of a digital transconductance amplifier, integration with an acoustic sensor frontend, and extensive testing for ultra-low-power performance',
    '2027-09-29', 'LM', 'LM-31'),

    ('PRELIMINARY DESIGN OF AN ARCJET IN THE 1KW CLASS FOR SPACE APPLICATION', 'd357587', 'engineering project',
    'This engineering project involves the preliminary design of an arcjet in the 1kW class for space applications. The research aims to conceptualize and outline the key parameters, components, and specifications required for the development of a high-powered arcjet propulsion system suitable for space missions.',
    'propulsion systems, plasma physics, and aerospace engineering',
    'The project includes conceptual design, performance modeling, and consideration of thermal management aspects for the arcjet propulsion system.',
    '2025-03-23', 'LM', 'LM-23');


-- Insert data into the proposalKeyword table
INSERT INTO proposalKeyword (proposal_id, keyword)
VALUES
    (1, 'AI'),
    (1, 'web development'),
    (1, 'research'),
    (2, 'kafka'),
    (2, 'reactive API'),
    (2, 'performance'),
    (2, 'network protocols'),
    (3, 'congestion'),
    (4, 'design'),
    (4, 'aerospace'),
    (4, 'arcjet propulsion system');


-- Insert data into thesisInternalCoSupervisor table
INSERT INTO thesisInternalCoSupervisor (proposal_id, co_supervisor_id)
VALUES
    (1, 'd277137'),
    (1, 'd226682'),
    (1, 'd392000'),
    (2, 'd226682'),
    (2, 'd258293'),
    (3, 'd237188'),
    (3, 'd392000'),
    (3, 'd292715'),
    (4, 'd350985'),
    (4, 'd255269');


-- Insert data into thesisExternalCoSupervisor table
INSERT INTO thesisExternalCoSupervisor (proposal_id, co_supervisor_id)
VALUES
    (1, 1),
    (1, 3),
    (1, 2),
    (1, 7),
    (3, 4),
    (4, 5);

-- Insert data into proposalGroup table
INSERT INTO proposalGroup (proposal_id, cod_group)
VALUES
    (1, 'Group1'),
    (1, 'Group2'),
    (1, 'Group3'),
    (2, 'Group2'),
    (3, 'Group1'),
    (2, 'Group1');

-- Insert into thesisApplication
INSERT INTO thesisApplication (proposal_id, student_id)
VALUES
    (1, 's290817'),
    (1, 's298289'),
    (1, 's314494'),
    (2, 's305475'),
    (2, 's295416'),
    (2, 's318894'),
    (1, 's322044'),
    (4, 's313347'),
    (1, 's306042');
