-- Enable foreign key support
PRAGMA foreign_keys = ON;

-- ------------------------------------------
--                  WARNING
--   Do not change schema without updating
--     "init_test.sql" since it should be
--                 the mirror
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
DROP TABLE IF EXISTS teacher;
DROP TABLE IF EXISTS student;
DROP TABLE IF EXISTS degree;
DROP TABLE IF EXISTS configuration;

-- Create the degree table
CREATE TABLE configuration (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL -- Stringified value
);

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

CREATE TABLE thesisStartRequest (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT NOT NULL,
    application_id INTEGER,
    proposal_id INTEGER,
    title TEXT NO NULL,
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
    ('L-07', 'Civil and Environmental Engineering'),
    ('L-08', 'Electronic Engineering'),
    ('L-09', 'Information Engineering'),
    ('LM-20', 'Chemical Engineering'),
    ('LM-21', 'Materials Engineering'),
    ('LM-22', 'Mechanical Engineering'),
    ('LM-23', 'Aerospace Engineering'),
    ('LM-24', 'Nuclear Engineering'),
    ('LM-25', 'Transport and Logistics Engineering'),
    ('LM-26', 'Mathematical Engineering'),
    ('LM-27', 'Telecommunication Engineering'),
    ('LM-28', 'Biomedical Engineering'),
    ('LM-29', 'Management Engineering'),
    ('LM-30', 'Energy Engineering'),
    ('LM-31', 'Automation Engineering'),
    ('LM-32', 'Computer Engineering'),
    ('LM-33', 'Automation and Control Systems Engineering'),
    ('LM-34', 'Information Engineering for Business Organization'),
    ('LM-35', 'Industrial Production Engineering');


-- Insert data into the teacher table
INSERT INTO teacher (id, surname, name, email, cod_group, cod_department)
VALUES
    ('d279620', 'Rossi', 'Marco', 'd279620@polito.it', 'Group1', 'Dep1'),
    ('d370335', 'Bianchi', 'Luca', 'd370335@polito.it', 'Group2', 'Dep2'),
    ('d350985', 'Esposito', 'Andrea', 'd350985@polito.it', 'Group3', 'Dep3'),
    ('d255269', 'Romano', 'Giovanni', 'd255269@polito.it', 'Group4', 'Dep4'),
    ('d357587', 'Ricci', 'Matteo', 'd357587@polito.it', 'Group5', 'Dep1'),
    ('d277137', 'Colombo', 'Davide', 'd277137@polito.it', 'Group1', 'Dep3'),
    ('d370392', 'Martini', 'Maria', 'd370392@polito.it', 'Group5', 'Dep3'),
    ('d226682', 'Mancini', 'Giulia', 'd226682@polito.it', 'Group1', 'Dep1'),
    ('d258293', 'Barbieri', 'Francesca', 'd258293@polito.it', 'Group2', 'Dep2'),
    ('d320694', 'Rinaldi', 'Sofia', 'd320694@polito.it', 'Group3', 'Dep3'),
    ('d284435', 'Caruso', 'Laura', 'd284435@polito.it', 'Group4', 'Dep4'),
    ('d258761', 'Ferrara', 'Valentina', 'd258761@polito.it', 'Group5', 'Dep1'),
    ('d237188', 'Marini', 'Alessia', 'd237188@polito.it', 'Group6', 'Dep2'),
    ('d392000', 'Santoro', 'Chiara', 'd392000@polito.it', 'Group5', 'Dep3'),
    ('d292715', 'Gatti', 'Isabella', 'd292715@polito.it', 'Group3', 'Dep4');

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

-- Insert data into the career table
INSERT INTO career (id, cod_course, title_course, cfu, grade, date)
VALUES
    ('s320213', '06AWPMU', 'Corporate Finance', 8, 26, '30/01/2023'),
    ('s320213', '03BNCMU', 'Logistics', 12, 30, '11/02/2023'),
    ('s320213', '01NJVMU', 'Management and Development of Innovation Projects', 10, 29, '17/01/2023'),
    ('s320213', '01NJUMU', 'International Marketing', 10, 24, '28/01/2023'),
    ('s321607', '16ACFPI', 'Mathematical Analysis I', 10, 20, '20/01/2023'),
    ('s321607', '16AHMPI', 'Chemistry', 8, 28, '15/01/2023'),
    ('s321607', '14BHDPI', 'Computer Science', 8, 23, '18/01/2023'),
    ('s321607', '01RKCPI', 'Linear Algebra and Geometry', 10, 28, '18/06/2023'),
    ('s321607', '09ARHPI', 'Economics and Business Organization', 8, 27, '25/06/2023'),
    ('s321607', '15AXOPI', 'Physics I', 10, 18, '01/07/2023'),
    ('s314796', '01PDWOV', 'Information Systems', 6, 28, '03/02/2022'),
    ('s314796', '02GOLOV', 'Computer System Architectures', 10, 30, '28/01/2022'),
    ('s314796', '01SQJOV', 'Data Science and Database Technology', 8, 29, '20/01/2022'),
    ('s314796', '02KPNOV', 'Computer Network Technologies and Services', 6, 26, '10/02/2022'),
    ('s314796', '02JEUOV', 'Formal Languages and Compilers', 6, 28, '18/06/2022'),
    ('s314796', '04GSPOV', 'Software Engineering', 8, 30, '24/06/2022'),
    ('s314796', '01TXYOV', 'Web Applications I', 6, 30, '20/06/2022'),
    ('s314796', '02GRSOV', 'System and Device Programming', 10, 18, '07/09/2022'),
    ('s314796', '01SQNOV', 'Software Engineering II', 6, 30, '03/03/2023'),
    ('s321529', '16ACFPI', 'Mathematical Analysis I', 10, 30, '20/01/2022'),
    ('s321529', '16AHMPI', 'Chemistry', 8, 30, '15/01/2022'),
    ('s321529', '14BHDPI', 'Computer Science', 8, 30, '18/01/2022'),
    ('s321529', '01RKCPI', 'Linear Algebra and Geometry', 10, 30, '18/06/2022'),
    ('s321529', '09ARHPI', 'Economics and Business Organization', 8, 30, '25/06/2022'),
    ('s321529', '15AXOPI', 'Physics I', 10, 18, '01/07/2022'),
    ('s321529', '23ACIPL', 'Mathematical Analysis II', 8, 30, '03/02/2023'),
    ('s321529', '14AFQPL', 'Database Basics', 8, 30, '25/01/2023'),
    ('s318952', '04PBVPG', 'Analysis of Economic Systems', 8, 28, '29/01/2023'),
    ('s318952', '09AQGPG', 'Business Economics', 8, 30, '09/02/2023'),
    ('s318952', '02CIXPG', 'Business Information Systems', 8, 30, '19/02/2023'),
    ('s318952', '01PDYPG', 'Analysis and Management of Production Systems', 8, 27, '22/06/2023'),
    ('s318952', '02ANYPG', 'Commercial Law', 8, 24, '06/07/2023'),
    ('s318771', '05MRPLO', 'Numerical Modelling and Simulation', 8, 30, '23/01/2023'),
    ('s318771', '01USHLO', 'Driver Assistance System Design', 12, 19, '13/02/2023'),
    ('s319355', '02ILSMZ', 'Metallurgical Plants', 6, 19, '13/01/2023'),
    ('s319355', '01NGFMZ', 'Materials Engineering', 10, 23, '10/02/2023'),
    ('s319355', '02CFUMZ', 'Science and Technology of Composite Materials', 10, 30, '16/02/2023'),
    ('s319355', '02NGKMZ', 'Technology of Polymer Materials', 10, 27, '16/06/2023');

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
    (4, 'arcjet propulsion system'),
    (5, 'propulsion systems'),
    (5, 'plasma physics'),
    (5, 'aerospace engineering'),
    (6, 'logistics'),
    (6, 'RFID technology'),
    (6, 'process optimization'),
    (7, 'system sizing'),
    (7, 'predictive modeling'),
    (7, 'automotive systems'),
    (7, 'statistical analysis'),
    (8, 'enterprise networking'),
    (8, 'software defined datacenter'),
    (8, 'network design'),
    (9, 'supply chain management'),
    (9, 'e-commerce'),
    (9, 'technology impact'),
    (9, 'artificial intelligence'),
    (10, 'control systems'),
    (10, 'reinforcement learning'),
    (10, 'MATLAB/Simulink'),
    (10, 'PID'),
    (10, 'LQR'),
    (10, 'FPGA programming'),
    (11, 'blockchain technology'),
    (11, 'Ethereum'),
    (11, 'smart contracts'),
    (11, 'Dgraph'),
    (11, 'Rust programming'),
    (11, 'data analysis'),
    (12, 'virtual reality'),
    (12, 'CBRN training'),
    (12, 'simulation development'),
    (12, 'XR Lab'),
    (12, 'procedural design'),
    (12, 'interaction design'),
    (13, 'lean manufacturing'),
    (13, 'Six Sigma'),
    (13, 'industry 4.0'),
    (13, 'smart production'),
    (13, 'IoT'),
    (13, 'data analysis'),
    (13, 'DMAIC'),
    (13, 'process improvement'),
    (14, 'material science'),
    (14, 'metallurgy'),
    (14, 'welding technology'),
    (14, 'metallography'),
    (15, 'economics'),
    (15, 'real estate'),
    (15, 'econometrics'),
    (15, 'statistical analysis'),
    (15, 'sharing economy'),
    (15, 'Airbnb'),
    (15, 'Turin real estate market'),
    (16, 'business process management'),
    (16, 'performance measurement'),
    (16, 'Balanced Scorecard'),
    (16, 'data analysis'),
    (16, 'project management'),
    (16, 'customer service'),
    (17, 'supply chain management'),
    (17, 'packaging processes'),
    (17, 'returnable packaging'),
    (17, 'overseas transport logistics'),
    (18, 'audiology'),
    (18, 'cochlear implants'),
    (18, 'telemedicine'),
    (18, 'rehabilitation protocols'),
    (18, 'human hearing anatomy');


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
    (6, 's321607', '2023-11-28T12:45:58.200Z'),
    (2, 's314796', '2023-11-28T13:01:22.156Z'),
    (4, 's318771', '2023-11-28T20:20:20.144Z'),
    (7, 's321529', '2023-11-28T09:35:21.132Z'),
    (15, 's318952', '2023-11-28T18:56:39.186Z'),
    (18, 's319355', '2023-11-28T16:30:00.171Z');

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

INSERT INTO thesisStartRequest(student_id, application_id, proposal_id, title, description, supervisor_id, creation_date)
VALUES
    ('s320213', 1, 1, 'start request for ai-guided web crawler thesis', 'will to start the thesis in january for which application is accepted', 'd279620', '2023-12-12T23:59:59.999Z'),
    ('s321607', 2, 6, 'start request for optimization of check-in process in amazon thesis', 'will to start the thesis as soon as possible', 'd292715', '2023-11-30T23:59:59.999Z');

INSERT INTO thesisStartRequest(student_id, title, description, supervisor_id, creation_date)
VALUES
    ('s319355', 'start request for a thesis to be defined', 'i''d like to start a thesis concerning numerical modelling and simulations with professor Ricci', 'd357587', '2023-11-30T23:59:59.999Z'); 

INSERT INTO thesisStartCosupervisor(start_request_id, cosupervisor_id)
VALUES
    (1, 'd277137'),
    (1, 'd226682'),
    (1, 'd392000');

    
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


-- Trigger that checks if the student_id in thesisStartRequest matches the student_id in thesisApplication
CREATE TRIGGER check_student_id_in_start_request
BEFORE INSERT ON thesisStartRequest
FOR EACH ROW
WHEN (NEW.application_id IS NOT NULL AND NEW.student_id NOT IN (SELECT student_id FROM thesisApplication WHERE application_id = NEW.application_id))
BEGIN
    SELECT RAISE(ABORT, 'The student_id does not match the student_id in thesisApplication');
END;

-- Trigger that checks if the supervisor_id in thesisStartRequest matches the supervisor_id in thesisProposal
CREATE TRIGGER check_supervisor_id_in_start_request
BEFORE INSERT ON thesisStartRequest
FOR EACH ROW
WHEN (NEW.proposal_id IS NOT NULL AND NEW.supervisor_id NOT IN (SELECT supervisor_id FROM thesisProposal WHERE proposal_id = NEW.proposal_id))
BEGIN
    SELECT RAISE(ABORT, 'The supervisor_id does not match the supervisor_id in thesisProposal');
END;

-- Trigger to check if the thesisStartCosupervisor(cosupervisor_id) matches thesisInternalCosupevisors(co_supervisor_id)
CREATE TRIGGER check_cosupervisor_id_in_start_cosupervisor
BEFORE INSERT ON thesisStartCoSupervisor
FOR EACH ROW
WHEN (NEW.cosupervisor_id NOT IN (SELECT co_supervisor_id FROM thesisInternalCosupevisors WHERE proposal_id = NEW.proposal_id))
BEGIN
    SELECT RAISE(ABORT, 'The cosupervisor_id does not match the co_supervisor_id in thesisInternalCosupevisors');
END;