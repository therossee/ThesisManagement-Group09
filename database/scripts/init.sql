-- Enable foreign key support
PRAGMA foreign_keys = ON;

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
DROP TABLE IF EXISTS teacher_auth0;
DROP TABLE IF EXISTS teacher;
DROP TABLE IF EXISTS student_auth0;
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

-- Create the student_auth0 table
CREATE TABLE student_auth0 (
    id TEXT PRIMARY KEY,
    id_auth0 TEXT NOT NULL,
    FOREIGN KEY(id) REFERENCES student(id)
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

-- Create the teacher_auth0 table
CREATE TABLE teacher_auth0 (
    id TEXT PRIMARY KEY,
    id_auth0 TEXT NOT NULL,
    FOREIGN KEY(id) REFERENCES teacher(id)
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
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    proposal_id INTEGER NOT NULL,
    student_id TEXT NOT NULL,
    creation_date DATE NOT NULL,
    status TEXT DEFAULT 'waiting for approval',
    FOREIGN KEY(proposal_id) REFERENCES thesisProposal(proposal_id),
    FOREIGN KEY(student_id) REFERENCES student(id)
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

-- Insert data into the teacher_auth0 table
INSERT INTO teacher_auth0 (id, id_auth0)
VALUES 
    ('d279620', 'auth0|6564f83a022f6b2083b6b8c9'),
    ('d370392', 'auth0|656621f156336a62dd8aaced'),
    ('d226682', 'auth0|656621a2022f6b2083b7a522'),
    ('d258293', 'auth0|656621466d87729b6b4216b5'),
    ('d320694', 'auth0|656620f16d87729b6b42167c'),
    ('d284435', 'auth0|656620a756336a62dd8aac0e'),
    ('d258761', 'auth0|6566205c56336a62dd8aabe1'),
    ('d237188', 'auth0|65661fff6d87729b6b4215e5'),
    ('d392000', 'auth0|65661fb356336a62dd8aab82'),
    ('d292715', 'auth0|65661ee656336a62dd8aaaf5'),
    ('d357587', 'auth0|65661e84022f6b2083b7a341'),
    ('d255269', 'auth0|65661e2156336a62dd8aaa70'),
    ('d350985', 'auth0|65661dde56336a62dd8aaa4c'),
    ('d370335', 'auth0|65661d4e022f6b2083b7a267');

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
    ('s320213', 'Barbato', 'Luca', 'Male', 'Italian', 's320213@studenti.polito.it', 'LM-31', 2020),
    ('s321607', 'Beltran', 'Juan Carlos', 'Male', 'Colombian', 's321607@studenti.polito.it', 'L-09', 2020),
    ('s314796', 'De Rossi', 'Daniele', 'Male', 'Italian', 's314796@studenti.polito.it', 'LM-32', 2020),
    ('s318771', 'Husanu', 'Diana', 'Female', 'Romanian', 's318771@studenti.polito.it', 'LM-33', 2020),
    ('s321529', 'Ladrat', 'Matteo', 'Male', 'French', 's321529@studenti.polito.it', 'L-08', 2020),
    ('s318952', 'Molinatto', 'Sylvie', 'Female', 'Italian', 's318952@studenti.polito.it', 'LM-34', 2020),
    ('s319355', 'Schiavone', 'Michele', 'Male', 'Italian', 's319355@studenti.polito.it', 'LM-35', 2020);

-- Insert data into the student_auth0 table
INSERT INTO student_auth0 (id, id_auth0) 
VALUES 
    ('s318952', 'auth0|65635d036d87729b6b3ffe83'),
    ('s321529', 'auth0|6564f6ba6d87729b6b412740'),
    ('s319355', 'auth0|6564f6efd5c067abfc7e6096'),
    ('s318771', 'auth0|6564f687022f6b2083b6b500'),
    ('s314796', 'auth0|6564f6476d87729b6b412613'),
    ('s321607', 'auth0|6564f613d5c067abfc7e5e8a'),
    ('s320213', 'auth0|6564f5db6d87729b6b412520');


-- Insert data into the career table
INSERT INTO career (id, cod_course, title_course, cfu, grade, date)
VALUES
    ('s320213', '01DSHOV', 'Big data processing and analytics', 6, 29, '1/12/2022'),
    ('s320213', '01URTOV', 'Machine learning and pattern recognition', 6, 29, '2/12/2022'),
    ('s321607','01NYHOV', 'System and device programming', 10, 30, '1/09/2023'),
    ('s318771', '01PFPOV', 'Mobile application development', 6, 25, '02/09/2023'),
    ('s321607', '01SQNOV', 'Software Engineering II', 6, 28, '03/03/2023'),
    ('s314796', '01SQNOV', 'Software Engineering II', 6, 28, '03/03/2023'),
    ('s321529', '01SQNOV', 'Software Engineering II', 6, 28, '03/03/2023'),
    ('s314796', '01TXYOV', 'Web Applications I', 6, 30, '05/06/2023'),
    ('s321529', '01TXYOV', 'Web Applications I', 6, 30, '05/06/2023'),
    ('s318952', '01TXYOV', 'Web Applications I', 6, 30, '05/06/2023'),
    ('s318952', '01TYMOV', 'Information systems security', 6, 30, '05/06/2023'),
    ('s319355', '01TYMOV', 'Information systems security', 6, 30, '05/06/2023');

-- Insert data into the thesisProposal table
INSERT INTO thesisProposal (title, supervisor_id, type, description, required_knowledge, notes, creation_date, expiration, level)
VALUES
    ('AI-GUIDED WEB CRAWLER FOR AUTOMATIC DETECTION OF MALICIOUS SITES', 'd279620', 'research project',
    'This thesis focuses on developing an AI-guided web crawler for the automatic detection of malicious sites. The research aims to leverage artificial intelligence to enhance the efficiency and accuracy of web crawling in identifying and cataloging potentially harmful websites.',
    'web development, cybersecurity, and machine learning',
    'The project involves implementing machine learning algorithms for pattern recognition, collaborating with cybersecurity experts, and optimizing web crawling algorithms for real-time detection',
    '2023-10-10T10:45:50.121Z', '2024-11-10T23:59:59.999Z', 'LM'),

    ('PERFORMANCE EVALUATION OF KAFKA CLIENTS USING A REACTIVE API', 'd370335', 'research project',
    'This thesis focuses on the performance evaluation of Kafka clients using a reactive API. The research aims to assess and enhance the efficiency of Kafka clients by implementing a reactive programming approach. The study explores how a reactive API can improve responsiveness and scalability in real-time data streaming applications.',
    'networking protocols, congestion control algorithms, and familiarity with QUIC',
    'The study involves simulations, performance evaluations, and an in-depth analysis of the effectiveness of different congestion control schemes in QUIC',
    '2023-08-22T13:43:56.236Z', '2025-12-24T23:59:59.999Z', 'LM'),

    ('A STUDY OF CONGESTION CONTROL SCHEMES ON QUIC', 'd350985', 'research project',
    'This research paper delves into a comprehensive study of congestion control schemes on QUIC (Quick UDP Internet Connections). The investigation aims to analyze and compare various congestion control strategies within the QUIC protocol, shedding light on their impact on network performance and efficiency.',
    'Strong understanding of web development principles, Proficiency in cybersecurity concepts and best practices, Familiarity with machine learning algorithms and pattern recognition, Knowledge of data structures and algorithms for efficient web crawling.',
    'The project involves implementing cutting-edge machine learning algorithms to enhance the accuracy of malicious site detection. Collaboration with cybersecurity experts is essential to ensure the crawlers effectiveness against evolving threats. Optimization of web crawling algorithms for real-time detection requires a deep understanding of both web technologies and performance optimization techniques.',
    '2023-09-17T21:37:01.176Z', '2026-04-01T23:59:59.999Z', 'LM'),

    ('ULTRA-LOW-POWER ACOUSTIC SENSOR FRONTEND A DIGITAL TRANSCONDUCTANCE AMPLIFIER APPROACH', 'd255269', 'dissertation',
    'This dissertation focuses on the design and implementation of an ultra-low-power acoustic sensor frontend using a digital transconductance amplifier approach. The research aims to explore novel methods in signal processing and circuit design to achieve highly efficient and low-power acoustic sensing capabilities.',
    'analog and digital circuit design, signal processing, and low-power electronics',
    'The project involves the development of a digital transconductance amplifier, integration with an acoustic sensor frontend, and extensive testing for ultra-low-power performance',
    '2023-11-01T23:59:32.155Z', '2027-09-29T23:59:59.999Z', 'LM'),

    ('PRELIMINARY DESIGN OF AN ARCJET IN THE 1KW CLASS FOR SPACE APPLICATION', 'd357587', 'engineering project',
    'This engineering project involves the preliminary design of an arcjet in the 1kW class for space applications. The research aims to conceptualize and outline the key parameters, components, and specifications required for the development of a high-powered arcjet propulsion system suitable for space missions.',
    'propulsion systems, plasma physics, and aerospace engineering',
    'The project includes conceptual design, performance modeling, and consideration of thermal management aspects for the arcjet propulsion system.',
    '2023-11-15T22:44:51.199Z', '2025-03-23T23:59:59.999Z', 'LM'),

    ('OPTIMIZATION OF CHECK-IN PROCESSES IN AMAZON LOGISTICS', 'd292715', 'electronic pubblication',
    'This thesis analyzes and proposes solutions for optimizing check-in processes in Amazon''s logistics, focusing on RFID technology. It compares the proposed solution with Amazon''s development, emphasizing efficiency and cost considerations.',
    'logistics, RFID technology, process optimization',
    'The project explores the use of RFID for check-in efficiency, considering costs and benefits. Amazon''s parallel development is discussed, highlighting economic and operational contrasts.',
    '2023-11-27T22:44:51.199Z', '2026-05-29T23:59:59.999Z', 'L'),

    ('PREDICTIVE MODELING FOR INFOTAINMENT SYSTEM PERFORMANCE OPTIMIZATION', 'd292715', 'electronic pubblication',
    'This thesis addresses the challenge of sizing a system to meet specified requirements at the lowest possible cost, focusing on infotainment systems in automotive settings. The proposed predictive model, based on a novel formulation of performance improvement, factors in Voluntary and Unvoluntary Context Switches, providing insights into computational resource allocation and system cost optimization.',
    'system sizing, predictive modeling, automotive systems, statistical analysis',
    'The study introduces a statistical approach to gather insights into thread behavior within infotainment suites, proposing a method for generating "RUN-WAIT" sequences. Results indicate the feasibility of statistically modeling thread behavior, encouraging the application of this method to assess the impact of introducing computational capacity increments in infotainment systems.',
    '2023-11-27T22:44:51.199Z', '2026-05-29T23:59:59.999Z', 'L'),

    ('DESIGN AND IMPLEMENTATION OF ENTERPRISE SOFTWARE DEFINED DATACENTER NETWORKS', 'd292715', 'electronic pubblication',
    'This work describes the high-level and domain-specific requirements for an Enterprise Software Defined Datacenter network. Then the practical design principles and technical solutions are introduced providing a high-level description of all the common features and tools that should be implemented in a modern Enterprise datacenter network. Finally, a service delivery model for the Enterprise DCN and three different designs implementing the requirements using the previously described technologies are presented and compared.',
    'Enterprise networking, Software Defined Datacenter, network design, service delivery models',
    'The study explores the design and implementation of an Enterprise Software Defined Datacenter network, emphasizing practical solutions and comparing different designs. It requires knowledge in networking, software-defined technologies, and datacenter architecture.',
    '2023-11-27T22:44:51.199Z', '2026-05-29T23:59:59.999Z', 'L'),

    ('ROLE OF TECHNOLOGY IN ADVANCING E-COMMERCE SUPPLY CHAIN', 'd392000', 'research project',
    'Over the last 30 years, the supply chain has played a pivotal role in various sectors, with increasing emphasis on operational processes driven by IT advancements. E-commerce platforms, where the supply chain is strategic, particularly impact customer experience, revenue generation, and cost reduction. This thesis explores the evolving expectations of customers, focusing on delivery speed, cost efficiency, and the crucial role of technology in supporting supply chain operations. Leading companies invest significantly in efficient and precise systems, and the challenges of sustainability and waste reduction are addressed. The study anticipates a growing use of e-commerce platforms, requiring the supply chain to adapt to increasing volumes. Artificial Intelligence is identified as a key enabler, enhancing flexibility and speed in the supply chain by automating daily operational decisions, optimizing supply procurement, network deployment, and reducing costs and consumption.',
    'supply chain management, e-commerce, technology impact, sustainability, Artificial Intelligence',
    'The research delves into the transformative role of technology in e-commerce supply chains, addressing operational challenges and the integration of Artificial Intelligence. Knowledge in supply chain management, e-commerce, and technology is essential for understanding and analyzing the proposed solutions.',
    '2023-11-27T22:44:51.199Z', '2029-11-27T23:59:59.999Z', 'LM'),

    ('CONTROL AND REINFORCEMENT LEARNING FOR INVERTED PENDULUM SYSTEMS', 'd392000', 'research project',
    'The inverted pendulum system poses a classic control challenge, involving stabilizing a pendulum on a movable base. This thesis project addresses the problem from multiple angles. Firstly, an OpenAI Gym environment will be created, utilizing Proximal Policy Optimization (PPO) reinforcement learning to control the pendulum''s balance. Secondly, a MATLAB/Simulink mathematical model of the cartpole system will be developed using Lagrangian mechanics, enabling the design and implementation of control strategies such as PID and LQR. Thirdly, these control strategies will be tested on a real model with a dedicated HW/SW system using the PYNQ-Z1 FPGA board, integrating hardware and software components for real-time control. The project contributes to understanding control strategies and reinforcement learning applications in inverted pendulum systems, enhancing practical implementation knowledge.',
    'control systems, reinforcement learning, MATLAB/Simulink, PID, LQR, FPGA programming',
    'This research requires knowledge in control systems, reinforcement learning, MATLAB/Simulink, and FPGA programming. The integration of hardware and software components showcases practical implementation skills.',
    '2023-11-27T22:44:51.199Z', '2025-12-20T23:59:59.999Z', 'LM'),

    ('SEMANTIC EXTRACTION AND INDEXING OF ETHEREUM DATA WITH DGRAPH', 'd237188', 'company-based thesis',
    'Blockchain technology, notably Ethereum, has gained prominence with decentralized applications and smart contracts. This thesis focuses on extracting and semantically indexing Ethereum data using Dgraph, an open-source distributed graph database. A custom Rust-based tool, eth2dgraph, was developed to optimize the extraction process, including smart contract ABI indexing. The project addresses the challenge of open and efficient analysis of blockchain data, providing an alternative solution. The open-source nature encourages collaborative development, and insights gained from analyzing indexed data highlight the need for distributed approaches in handling the growing volume of Ethereum blockchain data.',
    'blockchain technology, Ethereum, smart contracts, Dgraph, Rust programming, data analysis',
    'This research requires knowledge in blockchain technology, Ethereum, smart contracts, Dgraph, Rust programming, and data analysis. The project''s open-source nature allows for further collaboration and development.',
    '2023-11-27T22:44:51.199Z', '2025-01-20T23:59:59.999Z', 'LM'),

    ('VIRTUAL REALITY SIMULATION FOR CBRN OPERATOR TRAINING', 'd237188', 'research project',
    'Virtual Reality (VR) is increasingly utilized for education and training, overcoming physical, economic, and safety limitations in traditional exercises. This thesis project aims to develop an immersive simulation replicating the RECCE (Reconnaissance) procedure used by the Italian Air Force Third Wing in Villafranca di Verona for Chemical, Biological, Radiological, and Nuclear (CBRN) risk management. The simulation provides realistic training and serves as a cost-effective, practical, and repeatable evaluation tool. The RECCE procedure involves preparation, agent detection, and contaminated area delimitation for creating a safe corridor for subsequent qualified operators. The project covers all phases from operator preparation to radiological hotspot containment, focusing on decision-making and activities in contaminated areas. The simulation, accessible in single-player and multi-player modes, offers five roles with varying tasks. Developed in the XR Lab at the LINKS Foundation with supervision from the VR@POLITO lab at Politecnico di Torino, the simulation replaces a previous version, emphasizing design, graphics, procedures, interactivity, and choice variety to align with Air Force requirements and become an official training tool.',
    'Virtual Reality (VR), CBRN training, simulation development, XR Lab, VR@POLITO, procedural design, interaction design',
    'This research requires knowledge in Virtual Reality, CBRN training procedures, simulation development, XR Lab technologies, VR@POLITO methodologies, procedural and interaction design. The project emphasizes alignment with Air Force requirements for official training recognition.',
    '2023-11-27T22:44:51.199Z', '2025-02-25T23:59:59.999Z', 'LM'),

    ('INTEGRATION OF LEAN, SIX SIGMA, AND INDUSTRY 4.0 IN MANUFACTURING', 'd258761', 'company-based thesis',
    'This research project explores the integration of Lean Manufacturing, Six Sigma, and Industry 4.0 in the manufacturing sector. Industry 4.0, the fourth industrial revolution, leverages cyber-physical systems and IoT for smart production lines and intelligent devices. The study examines how the combination of Lean and Industry 4.0, known as Lean Industry 4.0, can enhance production processes, addressing the challenges posed by increasing operational complexity. Successful implementation of Lean Industry 4.0 is shown to potentially improve conversion costs by approximately 40% in five to ten years. Additionally, the study explores the application of Six Sigma, a statistical quality improvement approach, to handle big data generated by Industry 4.0. The goal is to maximize efficiency, process improvement, and quality orientation within the context of future manufacturing excellence.',
    'Lean Manufacturing, Six Sigma, Industry 4.0, smart production, IoT, data analysis, DMAIC, process improvement',
    'This study requires knowledge in Lean Manufacturing, Six Sigma methodology, Industry 4.0 technologies, data analysis, and process improvement. The integration of Lean, Six Sigma, and Industry 4.0 aims to make manufacturing processes more robust, quality-oriented, and capable of addressing future challenges.',
    '2023-11-27T22:44:51.199Z', '2025-02-25T23:59:59.999Z', 'LM'),

    ('METALLOGRAPHIC ASSESSMENT OF LIQUID METAL EMBRITTLEMENT IN RESISTANCE SPOT WELDING OF ADVANCED HIGH STRENGTH STEELS', 'd284435', 'research project',
    'This research project focuses on the metallographic assessment of Liquid Metal Embrittlement (LME) in Resistance Spot Welding (RSW) joints of Advanced High Strength Steels (AHSS). Car manufacturers aim to reduce vehicle weight for improved fuel efficiency and lower carbon dioxide emissions while ensuring occupant safety. AHSS, known for its high strength and crash attributes, is commonly used in vehicle manufacturing. However, during RSW of zinc-coated AHSS, especially in dissimilar joining, the LME phenomenon occurs, leading to AHSS cracking and failure. The investigation aims to replicate LME in a laboratory environment, develop metallographic assessment methods for resulting cracks, illustrate cracking morphology, and identify vulnerable weld microstructures, considering various welding parameters.',
    'Material science, metallurgy, welding technology, metallography, advanced high strength steels, liquid metal embrittlement, resistance spot welding',
    'This study requires knowledge in material science, metallurgy, welding technology, and metallography. The investigation aims to enhance understanding of the processes behind LME in RSW joints, contributing to advancements in lightweight material development for vehicle manufacturing.',
    '2023-11-27T22:44:51.199Z', '2025-02-25T23:59:59.999Z', 'LM'),

    ('IMPACT OF AIRBNB ON THE LOCAL REAL ESTATE MARKET: A CASE STUDY OF TURIN', 'd320694', 'research project',
    'This research project focuses on investigating the impact of Airbnb on the local real estate market in Turin. It begins with an introduction to the sharing economy, shifting to Airbnb, covering its business model, relationship with the hotel industry, and regulatory issues. The study then delves into the Italian real estate market, exploring homeownership habits, market trends, transactions, and prices. Literature review on the relationship between Airbnb and real estate markets sets the context. Data from AirDNA, Idealista, and OMI are used for analysis. Key statistics, findings, and econometric analyses are presented, examining factors influencing listing profitability and the impact on rent and sale prices in different neighborhoods. The final chapter summarizes main findings and conclusions.',
    'Economics, real estate, econometrics, statistical analysis, data analysis, sharing economy, Airbnb, Turin real estate market',
    'This study requires knowledge in economics, real estate, econometrics, statistical analysis, and data analysis. The research aims to contribute insights into the impact of Airbnb on the local real estate market in Turin, providing valuable information for policymakers and stakeholders.',
    '2023-11-27T22:44:51.199Z', '2025-02-25T23:59:59.999Z', 'LM'),

    ('EVALUATION OF E-ADVISOR IMPACT ON MRF REQUEST MANAGEMENT AT LORO PIANA & C. SPA', 'd258293', 'research project',
    'This thesis focuses on the impact evaluation of Loro Piana & C. Spa\''s "E-advisor" project, which aims to provide online consultation services by a real salesperson. The specific case under consideration is the management of MRF (Material Request Form) requests. The study delves into how the introduction of the new service has modified the management processes, outlining the entire process structure. The primary objectives are to assess if the service, as designed, is adequately sized to meet the demand of incoming requests and to evaluate the performance of the new process. A performance measurement system has been designed for monitoring activities, utilizing the Balanced Scorecard as a conceptual model. This involves perspectives such as financial, customer, internal processes, and learning and growth. The study identifies 30 performance indicators, synthesizing them to 12 key indicators, of which only 8 are currently monitored by the company. Results obtained over a 6-month period from the project''s initiation are presented and discussed. The analysis and direct management of the process at the company have revealed limitations in the current method, particularly in terms of data tracking, leading to proposed improvement solutions for the near future.',
    'Business process management, performance measurement, Balanced Scorecard, data analysis, project management, customer service',
    'This research requires knowledge in business process management, performance measurement methodologies, Balanced Scorecard, data analysis techniques, project management, and customer service. The study aims to provide insights into the impact and performance of the "E-advisor" project at Loro Piana & C. Spa.',
    '2023-11-27T22:44:51.199Z', '2025-05-27T23:59:59.999Z', 'LM'),

    ('ANALYSIS OF RETURNABLE PACKAGING FOR OVERSEAS TRANSPORT IN THE AUTOMOTIVE SUPPLY CHAIN', 'd226682', 'electronic publication',
    'This research project, conducted at the FCA company, focuses on analyzing the usage of returnable packaging (metal or plastic) for overseas transport, as a substitute for disposable packaging (wooden and cardboard). The study covers both standard dimension packaging and specific item packaging. The primary objective is to assess the advantages and challenges associated with implementing returnable packaging, particularly for overseas customers with long distances and lead times.',
    'Supply chain management, packaging processes, returnable packaging, overseas transport logistics',
    'The study requires a solid understanding of supply chain management, packaging processes, and logistics related to overseas transport. It provides insights into the feasibility and implications of adopting returnable packaging in the automotive supply chain for international shipments.',
    '2023-11-27T22:44:51.199Z', '2026-12-31T23:59:59.999Z', 'LM'),

    ('ENHANCING COCHLEAR IMPLANTATION OUTCOMES: A COMPREHENSIVE SOLUTION THROUGH INTERNATIONAL COLLABORATION', 'd370392', 'research project',
    'This thesis project focuses on Cochlear Implants (CI) and their pivotal role in restoring hearing function for individuals who are profoundly deaf or severely hard of hearing. The project aims to provide a comprehensive overview of human hearing, covering the structural anatomy of the normal hearing system, the challenges in a deaf ear, and the Cochlear Implantation process. The primary objective is to assess existing complications and propose a comprehensive solution, including the establishment of an international agency for professionals, a telemedicine platform for continuity assistance, and a network of training and experiential exchanges to unify rehabilitation protocols.',
    'Audiology, Cochlear Implants, Telemedicine, Rehabilitation Protocols, Human Hearing Anatomy',
    'The study requires a background in audiology, cochlear implants, telemedicine, and an understanding of rehabilitation protocols. It aims to address the determinants of success in cochlear implantation, considering factors such as patients’ hearing history, post-lingual or pre-lingual status, age, learning ability, health and cochlear structure, and intelligence. The proposed solutions aim to enhance the rehabilitation process after CI surgery and address the lack of public information on this matter worldwide.',
    '2023-11-27T22:44:51.199Z', '2024-06-30T23:59:59.999Z', 'LM');


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
    (5, 'Group5'),
    (6, 'Group3'),
    (7, 'Group3'),
    (8, 'Group3'),
    (9, 'Group5'),
    (10, 'Group5'),
    (11, 'Group6'),
    (12, 'Group6'),
    (13, 'Group5'),
    (14, 'Group4'),
    (15, 'Group3'),
    (16, 'Group2'),
    (17, 'Group1'),
    (18, 'Group5');


-- Insert into thesisApplication
INSERT INTO thesisApplication (proposal_id, student_id, creation_date)
VALUES
    (1, 's320213', '2023-11-28T08:08:16.123Z'),
    (2, 's321607', '2023-11-28T12:45:58.200Z'),
    (3, 's318952', '2023-11-28T13:01:22.156Z'),
    (4, 's318771', '2023-11-28T20:20:20.144Z'),
    (5, 's314796', '2023-11-28T09:35:21.132Z'),
    (6, 's321607', '2023-11-28T18:56:39.186Z'),
    (7, 's321529', '2023-11-28T16:30:00.171Z');

INSERT INTO proposalCds(proposal_id, cod_degree)
VALUES
    (1, 'LM-31'),
    (2, 'LM-32'),
    (2, 'LM-33'),
    (3, 'LM-34'),
    (4, 'LM-33'),
    (5, 'LM-32'),
    (6, 'L-08'),
    (6, 'L-09'),
    (7, 'L-08'),
    (7, 'L-09'),
    (8, 'L-08'),
    (8, 'L-09'),
    (9, 'LM-31'),
    (10, 'LM-31'),
    (11, 'LM-32'),
    (12, 'LM-32'),
    (13, 'LM-33'),
    (14, 'LM-33'),
    (15, 'LM-34'),
    (16, 'LM-34'),
    (16, 'LM-35'),
    (17, 'LM-35'),
    (18, 'LM-35');
