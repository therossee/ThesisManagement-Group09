# Thesis Management System - Frontend

![GitHub contributors](https://img.shields.io/github/contributors/therossee/ThesisManagement-Group09)



## Frontend

Welcome to the frontend of our project! hosts the user interface and client-side logic that enables users to interact with the backend seamlessly. 

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Test](#test)
- [Backend Project Structure](#backend-project-structure)
  - [src directory](#src-directory)
  - [test tirectory](#test-directory)
- [Middlewares](#middlewares)
- [API Endpoints](#api-endpoints)
- [Test](#test)
  - [Testing Overview](#testing-overview)
  - [Running Tests](#running-tests)
  - [Test Coverage Report](#test-coverage-report)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The frontend is developed with a dynamic user interface using React, with Ant Design serving as our primary component library. 

The main goal of our frontend is to provide an intuitive and responsive user experience. By leveraging React and Ant Design, we've created a visually appealing and efficient interface for users, whether they are students, teachers, secretary clerk or administrators.

Whether you're a developer eager to contribute or a user seeking insights into the frontend workings, this README will guide you through essential information about our frontend architecture, setup, and usage.

Let's dive into the details! 🚀

## Features

1. **Intuitive User Interface with Ant Design and React**
    <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" height="22">
    <img src="https://img.shields.io/badge/Ant%20Design-1890FF?style=for-the-badge&logo=antdesign&logoColor=white" alt="Antd" height="22">
    </p>
    
    Our frontend boasts an intuitive and user-friendly interface, meticulously crafted using React as the foundation and Ant Design for a cohesive set of components.
    While not replicating the exact design of the Politecnico di Torino website, our frontend is crafted to enhance the user experience by providing a cohesive and unified design language. This ensures consistency in functionality, making interactions seamless for students, teachers, and administrators.

2. **Responsive Design**
    
    The frontend is meticulously designed to be responsive, guaranteeing a consistent and optimal user experience across various devices and screen sizes, including a completely new mobile view.

3. **Collaborative Development with GitHub**

    ![GitHub Development](https://img.shields.io/badge/Collaboration-GitHub-blue?style=plastic)

    The development process has been a collaborative effort, utilizing the GitHub platform for version control, code contributions, and issue tracking. This approach fosters transparency and effective teamwork, allowing for a streamlined and organized development process.


## Getting Started

Instructions on how to set up and run the frontend.

### Prerequisites

<p>
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=plastic&logo=vite&logoColor=FFD62E">
  <img src="https://img.shields.io/badge/npm-CB3837?style=plastic&logo=npm&logoColor=white">
</p>

Before running the frontend, ensure you have the following prerequisites installed:

- [Vite](https://vitejs.dev/) 
- [npm](https://www.npmjs.com/) (Node Package Manager)
   

### Installation
  <p>
    <img src="https://img.shields.io/badge/mac%20os-000000?style=plastic&logo=apple&logoColor=white" alt="Mac OS" height='30px'>
    <img src="https://img.shields.io/badge/Windows-0078D6?style=plastic&logo=windows&logoColor=white" alt="Windows" height='30px'>
    <img src="https://img.shields.io/badge/Linux-FCC624?style=plastic&logo=linux&logoColor=black"  alt="Linux" height='30px'>
  </p>

1. **Clone the repository**: 

   ```bash
   git clone https://github.com/therossee/ThesisManagement-Group09.git
   ```
2. **Go inside the frontend directory**:
   ```bash
   cd front-end
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```

### Usage

To run the frontend, follow these steps:

1. Ensure you have completed the installation steps mentioned above.

2. Run the following command (in the frontend directory) to start:
   ```bash
   npm run dev
   ```
The frontend will start, and you should see console logs indicating that the vite framework is running.

## Frontend Project Structure
The frontend project is structured for clarity and maintainability:
`src` directory: Contains the main source code for the frontend.
- `components` => Houses the main and reusable UI components.
- `mob_components`=> Contains components specifically designed for the mobile view.
- `routes`=> Manages the application routing, considering authentication.

## React Routes
Content within the MainLayout.jsx component:
- Route `/`: display the home page
- Route `/admin/virtual-clock`: reference page to change the virtual clock of the entire system
- Route `/proposals`: display the active thesis proposals relevant to the logged-in user. The behavior differs based on the user's role:
    - For a teacher, it shows the active thesis proposals where the teacher serves as a supervisor.
    - For a student, it presents the available thesis proposals that the student can apply to, ensuring they are not expired or archived.
- Route `/applications`: Displays all the applications of students based on the user's role:
    - For a teacher, it displays all applications from students for the theses supervised by the logged-in teacher.
    - For a student, it showcases the history of their submitted applications for various theses.
- Route `/insert-proposal/`: Displays the proposal form for the teacher to insert a new thesis proposal.
- Route `/insert-proposal/:id`: If an ID is present, the form fields for inserting a proposal are populated with the corresponding values. Otherwise, if no ID is provided, the insert proposal form remains blank, similar to the previous state
- Route `/view-proposal/:id`: Displays the specific proposal to view.
- Route `/edit-proposal/:id`: Displays the form with the specific proposal to edit.
- Route`/*`: Error page 

## UI Components
- `Authentication` : Folder with three components: login button, logout button and usaAuth for the authentication provider
- `InsertThesisProposal`: Form to insert new thesis proposal by a teacher or copy a proposal with a given id.
It is divided in a 3 step form:
   - `InsertBody.jsx` : Designed to handle the creation of data related to thesis proposals.
   - `ReviewProposals.jsx` : Designed to view and review the data of a thesis proposal. Uses a table to show proposal details, including title, internal/external supervisors, keywords, type, description, and other associated fields.
   - `UploadResult.jsx`: Designed to display a result message after attempting to upload a thesis proposal. Depending on the result (success or error), it shows an appropriate message along with a button to return to the main page.
- `EditThesisProposal` : Allows the logged-in teacher to view the form to edit a specific thesis Proposal.
- `SideBar.jsx` : Definition of the Side bar.
- `StudentApplications.jsx`: View the history of student application requests. It shows a list of thesis proposals with their status, allowing students to track the status of their applications.
- `StudentCV` : Designed to display the curriculum vitae (CV) of a student. It provides an interface to view information about the student's exams, including the date, course code, teaching, mark, and credit units (CFU). The component also offers the ability to view an attached PDF document.
- `StudentThesisProposals.jsx`: Allows students to view and filter available thesis proposals. It includes features for searching by title, applying advanced filters, and displaying each proposal in detail.
- `TeacherApplications.jsx`: Allows faculty to view and manage thesis applications submitted by students. Provides functionality to accept or reject pending applications. 
- `TeacherThesisProposals.jsx`: Allows teachers to view and manage thesis proposals. Provides a table with detailed information on thesis proposals, allowing quick access to the visualization and editing actions of each proposal.
- `TopBar.jsx` : Definition for the TopBar with:
  - `LoginForm` : Form for the login inserted in the topbar.
  - `IsLoggedInForm` : Form when the user has alredy logged in.
- `ViewThesisProposal` : Allows users to view specific details of a thesis proposal. Provides a detailed view of the proposal, including title, level, type, expiration date, description, required knowledge, supervisor, co-supervisors, groups, notes, keywords and, if the user is a lecturer, also the course of study (CdS).
- `App.jsx` : Main component of the application. It manages user authentication, sets notifications for API errors during login, and defines the basic structure of the application.
- `main.jsx` : root render for the App
- `MainLayout.jsx` : Principal structure of the app, including the sidebar (SideBar), the top bar (TopBar), and the main content area.

## Routes Folder
- `Applications.jsx` : React conditional component that dynamically filters its content based on the role of the logged-in user. Depending on the user's role, the component either renders the `TeacherApplications` or `StudentApplications`.
- `EditProposal.jsx` : specifically designed for editing a Thesis Proposal. This component is accessible exclusively to professors, ensuring that only authorized users with the appropriate role can utilize its functionality.
- `Errors.jsx` :  React component for displaying different error messages based on a provided error code:
   - `403`: Not authorized to access the page
   - `404`: Page doesn't exist
   - `500`: Server error
- `Home.jsx` : React component for the home page.
- `InsertProposal.jsx` : React conditional component that dynamically filters its content based on the role of the logged-in user. Specifically, it allows teachers to access the InsertThesisProposal section, while displaying an error for other roles.
- `Proposals.jsx` : React conditional component that dynamically adjusts its content based on the role of the logged-in user.Depending on the user's role, the component either renders the `TeacherThesisProposals` or `StudentThesisProposals`.
- `ViewProposal.jsx` : React component for view a ThesisProposal. This component is designed to cater to both students and teachers.
- `VirtualClock.jsx` :  React component for virtual clock management. Only for tester users.

## APIs
- `API.jsx` : Main API functions as:
  - APIs for auth:
     - `getUser`: Fetches user information from the server.
     - `logOut`: Initiates the logout process by sending a POST request to the appropriate endpoint
     - `redirectToLogin`: Redirects the user to the login page
  - Virtual Clock APIs :
      - `getClock`: function to obtain the setted data and offset 
      - `updateClock`: function to update the system virtual clock
  - Thesis Proposals APIs
      - `getThesisProposals`: Gets the thesis proposals for a user.
      - `getThesisProposalById`: Gets a specific thesis proposal with a given Id
      - `insertProposal`: function to insert a proposal in the database
      - `applyForProposal`: Function to apply to a proposal with a given Id and possibly upload a file.
      - `archiveProposalById`: Function to archive a proposal with the given id
      - `deleteProposalById`: Funcion to delete a proposal with a given id
      - `updateProposal`: Function to update an edited proposal with a given id
  - Applications APIs
      - `getStudentActiveApplication`: Gets all the active application for a student
      - `getTeacherThesisApplications` : Gets all the application for a proposal with a given Id
      - `acceptThesisApplications` : function to accept Student Applications on a Thesis Proposal and automatically reject all the other student applied.
      - `rejectThesisApplications` : function to reject Student Applications on a Thesis Proposal
      - `getStudentApplicationsHistory` : function to get all the applications with thesis infos done by the logged-in student
  - Get APIs to retrieve others infos:
      - `getExtCoSupervisors`: Gets all the External CoSupervisors
      - `getTeachers` : Gets all the teachers 
      - `getAllKeywords` : Gets all the keywords
      - `getAllDegrees` : Gets all the degrees
      - `getStudentCVById`: Get student career with a given id
      - `getPDF`: Get all the document in pdf format uploaded by the student with a given student_id for a specific application (application_id)


## Contributing
Thank you for expressing your interest in contributing to the frontend project! Your contributions are highly valued, and by participating, you acknowledge and agree that your efforts will be governed by the chosen licensing terms of the project. Your collaborative spirit contributes to maintaining an open and inclusive environment, and we genuinely appreciate your support!

#### Important notes:

- License
  - Ensure that your contributions comply with the project's license (GNU GPL 3.0). Include the license header in new files.

- Be Respectful:
  - Be respectful and inclusive in your interactions. We embrace a diverse community.

Thanks for being part of our project! 🚀

## License
This project is licensed under the [GNU General Public License v3.0](https://opensource.org/licenses/GPL-3.0) - see the LICENSE.md file for details.

![GitHub License](https://img.shields.io/github/license/therossee/ThesisManagement-Group09?style=plastic&color=green)

