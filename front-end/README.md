# Front End

## Description
This is the front end of the project. It is a mobile/web interface  developed using React and Vite as the frontend framework and leverages Ant Design for the user interface design. 

## Installation
1. Run `npm install` in the front-end directory
2. Run `npm run dev` to start the app in development mode.

## React Routes
- Route `/`: Displays the home page
- Route `/proposals`: Displays the proposals for a student
- Route `/insert-proposal/:id`: Displays the proposal form for the teacher to insert a new thesis proposal.

## Main React Components
- `Thesis` : Definition of the main functions of the frontend related to the Thesis as:
      ## Insert Thesis Proposal:
      -`InsertThesisProposal`: Form to insert new thesis proposal by a teacher divided in a 3 step form.
      -`InsertBody` : Body of the form with every form item.
      -`ReviewProposal`: Retrieves the data of the form inserted in insert body to show it in the second step of the form.
      -`Done`: Final bottom of the last step of the form to finish it.
      ## Search Proposals:
      -`ThesisProposals`: Search and filters for search thesis proposal.


## Technology   
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
