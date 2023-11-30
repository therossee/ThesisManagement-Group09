# Front End

## Description
This is the front end of the project. It is a mobile/web interface  developed using React and Vite as the frontend framework and leverages Ant Design for the user interface design. 

## Installation
1. Run `npm install` in the front-end directory
2. Run `npm run dev` to start the app in development mode.

## React Routes
- Route `/`: display the home page
- Route `/proposals`: display the active proposals of a teacher
- Route `/insert-proposal/:id`: Displays the proposal form for the teacher to insert a new thesis proposal.
- Route `/view-proposal/:id`: Displays the specific proposal to view.
- Route `/applications`: Displays all the applications of students for thesis created by the logged-in teacher.

## routes
- `Errors.jsx` :  React component for displaying different error messages based on a provided error code.
- `Home.jsx` : React component for the home page.
- `InsertProposal.jsx` : React conditional component to filter if a teacher enters InsertThesisProposal, otherwise error.
- `Proposals.jsx` : React conditional component to filter if a logged-in user is a student. In this case enters ThesisProposals, otherwise error.
- `ViewProposal.jsx` : React component for viewThesisProposal.
- `Applications.jsx` : React conditional component to filter if a logged-in user is a teacher. In this case enters ApplicationsProposals, otherwise error.
  
## components
- `SideBar.jsx` : Definition of the Side bar.
- `Thesis.jsx` : Definition of the main functions of the frontend related to the Thesis as:
      -`InsertThesisProposal`: Form to insert new thesis proposal by a teacher divided in a 3 step form.
      -`InsertBody` : Body of the form with every form item.
      -`ReviewProposal`: Retrieves the data of the form inserted in insert body to show it in the second step of the form.
      -`Done`: Final bottom of the last step of the form to finish it.
      -`ThesisProposals`: Search and filters for search thesis proposal.
      -`ViewThesisProposal` : Shows the selected thesis proposal.
- `TopBar.jsx` : Definition for the TopBar with:
      -`LoginForm` : Form for the login inserted in the topbar.
      -`IsLoggedInForm` : Form when the user has alredy logged in.
- `Applications.jsx` : Definition of the main functions of the frontend related to the Application of a Thesis as:
      -`ThesisApplications`: Shows all applications of the thesis created by the logged-in tacher and the students that made an application request to a thesis.

## Main React Components
- `API.jsx` : Main API functions as:
      APIs for auth:
      -`logIn`: Authentication function for logging in.
      - `logOut`: logout Function.
      - `getUserInfo`: retrieves user information.
     End APIs for auth:
      - `getStudentThesisProposals`: Gets the thesis proposals for a user.
- `App.jsx` : Logic for user in the React App with authentication.
- `main.jsx` : root render for the App
- `MainLayout.jsx` : Principal structure of the app.

## Technology   
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
