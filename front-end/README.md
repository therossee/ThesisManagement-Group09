# Front End

## Description
This is the front end of the project. It is a mobile/web interface  developed using React and Vite as the frontend framework and leverages Ant Design for the user interface design. 

## Installation
1. Run `npm install` in the front-end directory
2. Run `npm run dev` to start the app in development mode.

## React Routes
- Route `/`: display the home page
- Route `/admin/virtual-clock`: reference page to change the virtual clock of the entire system
- Route `/proposals`: display the active proposals of a teacher
- Route `/applications`: Displays all the applications of students for thesis created by the logged-in teacher.
- Route `/insert-proposal/`: Displays the proposal form for the teacher to insert a new thesis proposal.
- Route `/view-proposal/:id`: Displays the specific proposal to view.
- Route`/*`: Error page 


## routes
- `Errors.jsx` :  React component for displaying different error messages based on a provided error code:
      - `403`: Not authorized to access the page
      - `404`: Page doesn't exist
      - `500`: Server error
- `Home.jsx` : React component for the home page.
- `InsertProposal.jsx` : React conditional component to filter if a teacher enters InsertThesisProposal, otherwise error.
- `Proposals.jsx` : React conditional component to filter if a logged-in user is a student. In this case enters ThesisProposals, otherwise error.
- `ViewProposal.jsx` : React component for viewThesisProposal.
- `Applications.jsx` : React conditional component to filter if a logged-in user is a teacher. In this case enters ApplicationsProposals, otherwise error.
- `VirtualClock.jsx` :  React component for virtual clock management
  
## components
- `Authentication` : Folder with three components: login button, logout button and usaAuth for the authentication provider
- `InsertThesisProposal`: Form to insert new thesis proposal by a teacher divided in a 3 step form:
      - `InsertBody.jsx` : Designed to handle the creation of data related to thesis proposals.
      - `ReviewProposals.jsx` : Designed to view and review the data of a thesis proposal. Uses a table to show proposal details, including title, internal/external supervisors, keywords, type, description, and other associated fields.
      - `UploadResult.jsx`: Designed to display a result message after attempting to upload a thesis proposal. Depending on the result (success or error), it shows an appropriate message along with a button to return to the main page.
- `SideBar.jsx` : Definition of the Side bar.
- `StudentApplications.jsx`: View the history of student application requests. It shows a list of thesis proposals with their status, allowing students to track the status of their applications.
- `StudentThesisProposals.jsx`: Allows students to view and filter available thesis proposals. It includes features for searching by title, applying advanced filters, and displaying each proposal in detail.
- `TeacherApplications.jsx`: Allows faculty to view and manage thesis applications submitted by students. Provides functionality to accept or reject pending applications. 
Main functions:
      - `acceptApplication` : Accepts the thesis application from a student
      - `rejectApplication` : Reject the thesis application from a student
- `TeacherThesisProposals.jsx`: Allows teachers to view and manage thesis proposals. Provides a table with detailed information on thesis proposals, allowing quick access to the visualization and editing actions of each proposal.
- `TopBar.jsx` : Definition for the TopBar with:
      - `LoginForm` : Form for the login inserted in the topbar.
      - `IsLoggedInForm` : Form when the user has alredy logged in.
- `ViewThesisProposal` : Allows users to view specific details of a thesis proposal. Provides a detailed view of the proposal, including title, level, type, expiration date, description, required knowledge, supervisor, co-supervisors, groups, notes, keywords and, if the user is a lecturer, also the course of study (CdS). Students have the opportunity to apply for the proposal..


## Main React Components
- `API.jsx` : Main API functions as:
      - APIs for auth:
            - `getUserInfo`: retrieves user information.
      - Virtual Clock APIs :
            - `getClock`: function to obtain the setted data and offset 
            - `updateClock`: function to update the system virtual clock
      - Thesis Proposals APIs
            - `getThesisProposals`: Gets the thesis proposals for a user.
            - `getThesisProposalById`: Gets a specific thesis proposal with a given Id
            - `applyForProposal`: Function to apply to a proposal with a given Id
      - Applications APIs
            - `getStudentActiveApplication`: Gets all the active application for a student
            - `getTeacherThesisApplications` : Gets all the application for a  proposal with a given Id
            - `insertProposal`: function to insert a proposal in the database
            - `acceptThesisApplications` : function to accept Student Applications on a Thesis Proposal and automatically reject all the other student applied.
            - `rejectThesisApplications` : function to reject Student Applications on a Thesis Proposal
            - `getStudentApplicationsHistory` : function to get all the applications with thesis infos done by the logged-in student
      - Get APIs to retrieve others infos:
            - `getExtCoSupervisors`: Gets all the External CoSupervisors
            - `getTeachers` : Gets all the teachers 
            - `getAllKeywords` : Gets all the keywords
            - `getAllDegrees` : Gets all the degrees
     
- `App.jsx` : Main component of the application. It manages user authentication, sets notifications for API errors during login, and defines the basic structure of the application.
- `main.jsx` : root render for the App
- `MainLayout.jsx` : Principal structure of the app, including the sidebar (SideBar), the top bar (TopBar), and the main content area.

## Technology   
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
