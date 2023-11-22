-- Drop the existing tables if they exist
DROP TABLE IF EXISTS thesisApplication;
DROP TABLE IF EXISTS proposalGroup;
DROP TABLE IF EXISTS proposalKeyword;
DROP TABLE IF EXISTS proposalCds;
DROP TABLE IF EXISTS thesisExternalCoSupervisor;
DROP TABLE IF EXISTS thesisInternalCoSupervisor;
DROP TABLE IF EXISTS thesisProposal;
DROP TABLE IF EXISTS career;
DROP TABLE IF EXISTS externalCoSupervisor;
DROP TABLE IF EXISTS teacher;
DROP TABLE IF EXISTS student;
DROP TABLE IF EXISTS degree;


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

CREATE TABLE proposalCds(
    proposal_id INTEGER NOT NULL,
    cod_degree TEXT NOT NULL,
    FOREIGN KEY (proposal_id) REFERENCES thesisProposal(proposal_id),
    FOREIGN KEY (cod_degree) REFERENCES degree(cod_degree),
    PRIMARY KEY(proposal_id, cod_degree)
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
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s294301', 'Rossi', 'Abbondanzio', 'Male', 'Italian', 'rossi.abbondanzio@email.com', 'L-07', 2020);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s309429', 'Ferrari', 'Abbondio', 'Male', 'Italian', 'ferrari.abbondio@email.com', 'L-08', 2024);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s322044', 'Russo', 'Abelardo', 'Male', 'Italian', 'russo.abelardo@email.com', 'L-09', 2023);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s288327', 'Esposito', 'Abenzio', 'Male', 'Italian', 'esposito.abenzio@email.com', 'L-09', 2021);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s287107', 'Bianchi', 'Abramio', 'Male', 'Italian', 'bianchi.abramio@email.com', 'L-08', 2022);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s288512', 'Romano', 'Acacio', 'Male', 'Italian', 'romano.acacio@email.com', 'LM-22', 2021);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s318894', 'Gallo', 'Accursio', 'Male', 'Italian', 'gallo.accursio@email.com', 'LM-30', 2018);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s299838', 'Costa', 'Acilio', 'Male', 'Italian', 'costa.acilio@email.com', 'LM-33', 2023);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s301938', 'Fontana', 'Caldo', 'Male', 'Italian', 'fontana.caldo@email.com', 'LM-27', 2022);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s322276', 'Conti', 'Acrisio', 'Male', 'Italian', 'conti.acrisio@email.com', 'LM-34', 2021);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s317988', 'Ricci', 'Adalberto', 'Male', 'Italian', 'ricci.adalberto@email.com', 'LM-34', 2023);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s304823', 'Bruno', 'Adalgiso', 'Male', 'Italian', 'bruno.adalgiso@email.com', 'LM-28', 2019);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s289041', 'De Luca', 'Adamo', 'Male', 'Italian', 'de luca.adamo@email.com', 'LM-24', 2021);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s297117', 'Moretti', 'Adelardo', 'Male', 'Italian', 'moretti.adelardo@email.com', 'LM-21', 2021);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s293605', 'Marino', 'Adelchi', 'Male', 'Italian', 'marino.adelchi@email.com', 'LM-33', 2024);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s324327', 'Greco', 'Adelgardo', 'Male', 'Italian', 'greco.adelgardo@email.com', 'LM-21', 2021);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s289300', 'Barbieri', 'Adeodato', 'Male', 'Italian', 'barbieri.adeodato@email.com', 'LM-35', 2021);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s313395', 'Lombardi', 'Adone', 'Male', 'Italian', 'lombardi.adone@email.com', 'LM-30', 2019);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s313562', 'Giordano', 'Adrione', 'Male', 'Italian', 'giordano.adrione@email.com', 'LM-30', 2022);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s317577', 'Cassano', 'Agabio', 'Male', 'Italian', 'cassano.agabio@email.com', 'LM-23', 2024);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s329608', 'Colombo', 'Agapito', 'Male', 'Italian', 'colombo.agapito@email.com', 'LM-30', 2022);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s308631', 'Mancini', 'Agenore', 'Male', 'Italian', 'mancini.agenore@email.com', 'LM-31', 2022);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s291500', 'Longo', 'Agostino', 'Male', 'Italian', 'longo.agostino@email.com', 'LM-35', 2021);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s303712', 'Marchetti', 'Aiace', 'Male', 'Italian', 'marchetti.aiace@email.com', 'LM-35', 2021);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s296014', 'Martini', 'Aimone', 'Male', 'Italian', 'martini.aimone@email.com', 'LM-24', 2021);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s323519', 'Galli', 'Albano', 'Male', 'Italian', 'galli.albano@email.com', 'LM-25', 2024);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s290090', 'Gatti', 'Alamanno', 'Male', 'Italian', 'gatti.alamanno@email.com', 'LM-27', 2021);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s301590', 'Mariani', 'Alarico', 'Male', 'Italian', 'mariani.alarico@email.com', 'LM-24', 2023);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s313048', 'Ferrara', 'Alberico', 'Male', 'Italian', 'ferrara.alberico@email.com', 'LM-34', 2021);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s321096', 'Santoro', 'Albino', 'Male', 'Italian', 'santoro.albino@email.com', 'LM-27', 2024);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s314291', 'Marini', 'Albrico', 'Male', 'Italian', 'marini.albrico@email.com', 'LM-21', 2020);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s286993', 'Bianco', 'Alceste', 'Male', 'Italian', 'bianco.alceste@email.com', 'LM-25', 2024);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s290692', 'Conte', 'Alcide', 'Male', 'Italian', 'conte.alcide@email.com', 'LM-34', 2021);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s314288', 'Serra', 'Aldo', 'Male', 'Italian', 'serra.aldo@email.com', 'LM-26', 2024);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s325784', 'Farina', 'Aleandro', 'Male', 'Italian', 'farina.aleandro@email.com', 'LM-24', 2021);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s302797', 'Gentile', 'Aleramo', 'Male', 'Italian', 'gentile.aleramo@email.com', 'LM-23', 2018);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s304535', 'Caruso', 'Alessio', 'Male', 'Italian', 'caruso.alessio@email.com', 'LM-34', 2023);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s303129', 'Morelli', 'Alfonso', 'Male', 'Italian', 'morelli.alfonso@email.com', 'LM-21', 2024);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s290817', 'Ferri', 'Algiso', 'Male', 'Italian', 'ferri.algiso@email.com', 'LM-29', 2021);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s325645', 'Testa', 'Almerigo', 'Male', 'Italian', 'testa.almerigo@email.com', 'LM-28', 2019);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s298289', 'Ferraro', 'Aloisio', 'Male', 'Italian', 'ferraro.aloisio@email.com', 'LM-29', 2019);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s314494', 'Pellegrini', 'Alviero', 'Male', 'Italian', 'pellegrini.alviero@email.com', 'LM-25', 2022);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s316149', 'Grassi', 'Amelio', 'Male', 'Italian', 'grassi.amelio@email.com', 'LM-29', 2018);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s300790', 'Rossetti', 'Amabile', 'Male', 'Italian', 'rossetti.amabile@email.com', 'LM-29', 2024);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s318074', 'D''Angelo', 'Amando', 'Male', 'Italian', 'd''angelo.amando@email.com', 'LM-24', 2018);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s324576', 'Bernardi', 'Amaranto', 'Male', 'Italian', 'bernardi.amaranto@email.com', 'LM-28', 2021);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s294596', 'Mazza', 'Amatore', 'Male', 'Italian', 'mazza.amatore@email.com', 'LM-22', 2019);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s327923', 'Rizzi', 'Ambrogio', 'Male', 'Italian', 'rizzi.ambrogio@email.com', 'LM-34', 2022);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s319225', 'Natale', 'Amedeo', 'Male', 'Italian', 'natale.amedeo@email.com', 'LM-35', 2023);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s304580', 'Rizzo', 'Amerigo', 'Male', 'Italian', 'rizzo.amerigo@email.com', 'LM-32', 2023);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s322753', 'Seta', 'Amilcare', 'Male', 'Italian', 'seta.amilcare@email.com', 'LM-26', 2020);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s303116', 'Setaro', 'Amleto', 'Male', 'Italian', 'setaro.amleto@email.com', 'LM-28', 2021);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s313347', 'Severini', 'Barbara', 'Female', 'Italian', 'severini.barbara@email.com', 'LM-23', 2020);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s312234', 'Severino', 'Beatrice', 'Female', 'Italian', 'severino.beatrice@email.com', 'LM-32', 2024);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s316031', 'Severo', 'Bella', 'Female', 'Italian', 'severo.bella@email.com', 'LM-23', 2018);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s292717', 'Sferra', 'Benedetta', 'Female', 'Italian', 'sferra.benedetta@email.com', 'LM-26', 2022);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s318174', 'Sferrazza', 'Bianca', 'Female', 'Italian', 'sferrazza.bianca@email.com', 'LM-24', 2020);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s294228', 'Sforza', 'Jasmine', 'Female', 'Italian', 'sforza.jasmine@email.com', 'LM-23', 2021);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s298114', 'Sgambati', 'Jessica', 'Female', 'Italian', 'sgambati.jessica@email.com', 'LM-24', 2019);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s295800', 'Sgarlata', 'Rita', 'Female', 'Italian', 'sgarlata.rita@email.com', 'LM-32', 2020);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s306042', 'Sibilia', 'Roberta', 'Female', 'Italian', 'sibilia.roberta@email.com', 'LM-26', 2022);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s309619', 'Sica', 'Romina', 'Female', 'Italian', 'sica.romina@email.com', 'LM-30', 2021);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s295416', 'Sicignano', 'Rosa', 'Female', 'Italian', 'sicignano.rosa@email.com', 'LM-22', 2019);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s290387', 'Sicilia', 'Rosalba', 'Female', 'Italian', 'sicilia.rosalba@email.com', 'LM-27', 2023);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s296477', 'Pontarelli', 'Rosalinda', 'Female', 'Italian', 'pontarelli.rosalinda@email.com', 'LM-34', 2018);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s327367', 'Pontecorvo', 'Rosanna', 'Female', 'Italian', 'pontecorvo.rosanna@email.com', 'LM-28', 2019);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s324696', 'Ponti', 'Rosaria', 'Female', 'Italian', 'ponti.rosaria@email.com', 'LM-32', 2018);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s316864', 'Ponticello', 'Rossana', 'Female', 'Italian', 'ponticello.rossana@email.com', 'LM-34', 2024);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s308704', 'Pontillo', 'Nerina', 'Female', 'Italian', 'pontillo.nerina@email.com', 'LM-34', 2021);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s311745', 'Pontrelli', 'Nicoletta', 'Female', 'Italian', 'pontrelli.nicoletta@email.com', 'LM-33', 2018);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s323472', 'Ponzi', 'Nina', 'Female', 'Italian', 'ponzi.nina@email.com', 'LM-20', 2020);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s306020', 'Ponzio', 'Noemi', 'Female', 'Italian', 'ponzio.noemi@email.com', 'LM-35', 2019);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s315182', 'Ponzo', 'Nora', 'Female', 'Italian', 'ponzo.nora@email.com', 'LM-33', 2023);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s297229', 'Popolizio', 'Paola', 'Female', 'Italian', 'popolizio.paola@email.com', 'LM-24', 2022);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s323077', 'Poppa', 'Patrizia', 'Female', 'Italian', 'poppa.patrizia@email.com', 'LM-20', 2023);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s303285', 'Ventola', 'Penelope', 'Female', 'Italian', 'ventola.penelope@email.com', 'LM-33', 2024);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s323929', 'Ventre', 'Perla', 'Female', 'Italian', 'ventre.perla@email.com', 'LM-32', 2024);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s324883', 'Ventrella', 'Petra', 'Female', 'Italian', 'ventrella.petra@email.com', 'LM-30', 2018);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s326660', 'Ventresca', 'Piera', 'Female', 'Italian', 'ventresca.piera@email.com', 'LM-21', 2023);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s319815', 'Ventrone', 'Preziosa', 'Female', 'Italian', 'ventrone.preziosa@email.com', 'LM-35', 2024);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s294198', 'Ventura', 'Priscilla', 'Female', 'Italian', 'ventura.priscilla@email.com', 'LM-22', 2022);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s297502', 'Venturella', 'Licia', 'Female', 'Italian', 'venturella.licia@email.com', 'LM-25', 2021);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s286802', 'Venturelli', 'Lidia', 'Female', 'Italian', 'venturelli.lidia@email.com', 'LM-25', 2023);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s314576', 'Venturi', 'Liliana', 'Female', 'Italian', 'venturi.liliana@email.com', 'LM-20', 2024);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s305644', 'Venturini', 'Linda', 'Female', 'Italian', 'venturini.linda@email.com', 'LM-34', 2020);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s295137', 'Venturino', 'Lisa', 'Female', 'Italian', 'venturino.lisa@email.com', 'LM-34', 2019);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s300060', 'Venturo', 'Livia', 'Female', 'Italian', 'venturo.livia@email.com', 'LM-22', 2022);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s300558', 'Venuti', 'Loredana', 'Female', 'Italian', 'venuti.loredana@email.com', 'LM-30', 2023);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s308898', 'Venuto', 'Lorella', 'Female', 'Italian', 'venuto.lorella@email.com', 'LM-30', 2018);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s319332', 'Zarella', 'Lorena', 'Female', 'Italian', 'zarella.lorena@email.com', 'LM-20', 2021);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s308699', 'Zarlengo', 'Lorenza', 'Female', 'Italian', 'zarlengo.lorenza@email.com', 'LM-31', 2020);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s313316', 'Zaro', 'Luana', 'Female', 'Italian', 'zaro.luana@email.com', 'LM-31', 2022);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s319540', 'Zarrella', 'Emma', 'Female', 'Italian', 'zarrella.emma@email.com', 'LM-20', 2021);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s290157', 'Zarrilli', 'Enrica', 'Female', 'Italian', 'zarrilli.enrica@email.com', 'LM-25', 2023);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s299119', 'Zarro', 'Erica', 'Female', 'Italian', 'zarro.erica@email.com', 'LM-34', 2023);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s290592', 'Zavaglia', 'Ermenegilda', 'Female', 'Italian', 'zavaglia.ermenegilda@email.com', 'LM-22', 2022);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s315270', 'Zecca', 'Erminia', 'Female', 'Italian', 'zecca.erminia@email.com', 'LM-35', 2024);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s296510', 'Zegarelli', 'Ermione', 'Female', 'Italian', 'zegarelli.ermione@email.com', 'LM-28', 2019);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s290989', 'Giacomo', 'Ersilia', 'Female', 'Italian', 'giacomo.ersilia@email.com', 'LM-29', 2022);
INSERT INTO student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES ('s305475', 'Giacona', 'Eugenia', 'Female', 'Italian', 'giacona.eugenia@email.com', 'LM-23', 2024);

-- Insert data into the career table
INSERT INTO career (id, cod_course, title_course, cfu, grade, date)
VALUES
    ('s309429', '01DSHOV', 'Big data processing and analytics', 6, 29, '1/12/2022'),
    ('s309429', '01URTOV', 'Machine learning and pattern recognition', 6, 29, '2/12/2022');

-- Insert data into the thesisProposal table
INSERT INTO thesisProposal (title, supervisor_id, type, description, required_knowledge, notes, expiration, level)
VALUES
    ('AI-GUIDED WEB CRAWLER FOR AUTOMATIC DETECTION OF MALICIOUS SITES', 'd279620', 'research project',
    'This thesis focuses on developing an AI-guided web crawler for the automatic detection of malicious sites. The research aims to leverage artificial intelligence to enhance the efficiency and accuracy of web crawling in identifying and cataloging potentially harmful websites.',
    'web development, cybersecurity, and machine learning',
    'The project involves implementing machine learning algorithms for pattern recognition, collaborating with cybersecurity experts, and optimizing web crawling algorithms for real-time detection',
    '2024-11-10', 'LM'),

    ('PERFORMANCE EVALUATION OF KAFKA CLIENTS USING A REACTIVE API', 'd370335', 'research project',
    'This thesis focuses on the performance evaluation of Kafka clients using a reactive API. The research aims to assess and enhance the efficiency of Kafka clients by implementing a reactive programming approach. The study explores how a reactive API can improve responsiveness and scalability in real-time data streaming applications.',
    'networking protocols, congestion control algorithms, and familiarity with QUIC',
    'The study involves simulations, performance evaluations, and an in-depth analysis of the effectiveness of different congestion control schemes in QUIC',
    '2025-12-24', 'LM'),

    ('A STUDY OF CONGESTION CONTROL SCHEMES ON QUIC', 'd350985', 'research project',
    'This research paper delves into a comprehensive study of congestion control schemes on QUIC (Quick UDP Internet Connections). The investigation aims to analyze and compare various congestion control strategies within the QUIC protocol, shedding light on their impact on network performance and efficiency.',
    'Strong understanding of web development principles, Proficiency in cybersecurity concepts and best practices, Familiarity with machine learning algorithms and pattern recognition, Knowledge of data structures and algorithms for efficient web crawling.',
    'The project involves implementing cutting-edge machine learning algorithms to enhance the accuracy of malicious site detection. Collaboration with cybersecurity experts is essential to ensure the crawlers effectiveness against evolving threats. Optimization of web crawling algorithms for real-time detection requires a deep understanding of both web technologies and performance optimization techniques.',
    '2026-04-01', 'LM'),

    ('ULTRA-LOW-POWER ACOUSTIC SENSOR FRONTEND A DIGITAL TRANSCONDUCTANCE AMPLIFIER APPROACH', 'd255269', 'dissertation',
    'This dissertation focuses on the design and implementation of an ultra-low-power acoustic sensor frontend using a digital transconductance amplifier approach. The research aims to explore novel methods in signal processing and circuit design to achieve highly efficient and low-power acoustic sensing capabilities.',
    'analog and digital circuit design, signal processing, and low-power electronics',
    'The project involves the development of a digital transconductance amplifier, integration with an acoustic sensor frontend, and extensive testing for ultra-low-power performance',
    '2027-09-29', 'LM'),

    ('PRELIMINARY DESIGN OF AN ARCJET IN THE 1KW CLASS FOR SPACE APPLICATION', 'd357587', 'engineering project',
    'This engineering project involves the preliminary design of an arcjet in the 1kW class for space applications. The research aims to conceptualize and outline the key parameters, components, and specifications required for the development of a high-powered arcjet propulsion system suitable for space missions.',
    'propulsion systems, plasma physics, and aerospace engineering',
    'The project includes conceptual design, performance modeling, and consideration of thermal management aspects for the arcjet propulsion system.',
    '2025-03-23', 'LM');


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
    (1, 'Group5'),
    (2, 'Group1'),
    (2, 'Group2'),
    (3, 'Group3'),
    (3, 'Group5'),
    (3, 'Group6'),
    (4, 'Group3'),
    (4, 'Group4'),
    (5, 'Group5');


-- Insert into thesisApplication
INSERT INTO thesisApplication (proposal_id, student_id)
VALUES
    (1, 's294301'), 
    (1, 's309429'), 
    (1, 's322044'),
    (2, 's309429'),
    (2, 's295416'),
    (2, 's318894'),
    (1, 's288327'),
    (4, 's297117'),
    (1, 's304823');

INSERT INTO proposalCds(proposal_id, cod_degree)
VALUES
    (1, 'LM-29'),
    (2, 'LM-29'),
    (2, 'LM-30'),
    (3, 'LM-31'),
    (4, 'LM-32'),
    (5, 'LM-32');