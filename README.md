<html>
  <div align="center">
    <p>
      <img src="./images/cover.png" alt="Thesis Management System" height="350">
    </p>
    <p>
      <img src="https://forthebadge.com/images/badges/made-with-javascript.svg" alt="Made with Javascript" height="30">
      <img src="https://forthebadge.com/images/badges/not-a-bug-a-feature.svg" alt="Not a Bug a Feature" height="30">
      <img src="https://forthebadge.com/images/featured/featured-built-with-love.svg" alt="Built with love" height="30">
    </p>
    <p>
    <h1>Thesis Management System</h1>
    </p>
    <p>
      <a href="#overview">Overview</a>
      </li> | <a href="#how-to-run">How to run the project</a>
      </li> | <a href="#frontend-documentation">Frontend Documentation</a>
      </li> | <a href="#backend-documentation">Backend Documentation</a>
      </li> | <a href="#database-documentation">Database Documentation</a>
      </li> | <a href="#contributors">Contributors</a>
    </p>
    <p>
      <img src="https://img.shields.io/github/contributors/therossee/ThesisManagement-Group09" alt="Contributors" height="20">
      <img src="https://img.shields.io/tokei/lines/github/therossee/ThesisManagement-Group09" alt="Code Lines" height="20">
      <img src="https://img.shields.io/github/issues-pr-closed/therossee/ThesisManagement-Group09" alt="Total PR Closed" height="20">
    </p>
    <p>
      <img src="https://sonarcloud.io/api/project_badges/measure?project=therossee_ThesisManagement-Group09&metric=alert_status" alt="SonarCloud" height="20">
    </p>
  </div>
  <div id="overview" align="center">
    <h2>Overview</h2>
    <h3>Welcome to our project! We're thrilled to have you here.</h3>
    <p>We are Group 9, and we're excited to present our innovative software designed to simplify the lives of students and teachers!</p>
    <p>Our software offers a comprehensive suite of features, including the ability to create and manage thesis proposals, submit and handle student application, and generate and manage thesis start requests. It also comes with a stunning integrated email notification system and a visually appealing mobile interface for convenience and ease of use!</p>
    <p>
      <img src="./images/1.png" alt="1" height="225">
      <img src="./images/2.png" alt="2" height="225">
    </p>
    <p>
      <img src="./images/3.png" alt="3" height="225">
      <img src="./images/4.png" alt="4" height="225">
    </p>
    <p>
      <img src="./images/5.png" alt="5" height="225">
      <img src="./images/6.png" alt="6" height="225">
    </p>
    <p>
      <img src="./images/7.png" alt="7" height="250">
      <img src="./images/8.png" alt="8" height="250">
      <img src="./images/9.png" alt="9" height="250">
    </p>
  </div>
  <div id="how-to-run" align="center">
    <h2>How to run the Project</h2>
    <p>
      <a href="#env-variables">Set up environmental variables</a>
      </li> | <a href="#backend">Backend Setup</a>
      </li> | <a href="#frontend">Frontend Setup</a>
      </li> | <a href="#docker">Use Docker</a>
    </p>
  </div>
  <div id="env-variables" align="left">
    <h3>Set up environmental variables</h3>
    In order to work properly, the application requires the following environment variables to be set:

  - `TM_SMTP_SERVICE_NAME` = The name of the SMTP service to use (e.g. "gmail")
  - `TM_SMTP_HOST` = The host of the SMTP service to use (e.g. "smtp.gmail.com")
  - `TM_SMTP_USERNAME` = The username of the SMTP service to use (e.g. the email address for a Gmail account)
  - `TM_SMTP_PASSWORD` = The password of the SMTP service to use
  - `TM_SMTP_PORT` = The port of the SMTP service to use (e.g. 587)
  - `TM_SMTP_SECURE` = Whether to use a secure connection to the SMTP service (e.g. "true")

  ⚠️ _The service supports the use of dotenv-vault and therefore allows you to set only one environment variable: `TM_DOTENV_KEY`. This variable must contain the key to decrypt the environment variables stored in the dotenv-vault file._
  </div>

  ---

  <div id="backend" align="left">
    <h3>Backend Setup</h3>
    <p>Execute the following commands in a Command Shell:</p>
    <p>
      <code>cd backend</code> - Enter the folder
    </p>
    <p>
      <code>npm install</code> - Install all the dependencies
    </p>
    <p>
      <code>npm start</code> - Start the server
    </p>
    <p>⚠️ <em>If you don't have npm installed you can download it from here: <a href="https://www.npmjs.com/get-npm">npm</a>
      </em>
    </p>
  </div>
  
  ---
  
  <div id="frontend" align="left">
    <h3>Frontend Setup</h3>
    <p>Execute the following commands in a Command Shell:</p>
    <p>
      <code>cd front-end</code> - Enter the folder
    </p>
    <p>
      <code>npm install</code> - Install all the dependencies
    </p>
    <p>
      <code>npm run build</code> - Build the project for production
    </p>
    <p>
      <code>npm run preview</code> - Preview the production build
    </p>
    <p>⚠️ <em>If you don't have npm installed you can download it from <a href="https://www.npmjs.com/get-npm">here</a>
      </em>
    </p>
  </div>
  
  ---
  
  <div id="docker" align="left">
    <h3>Docker</h3>
    <p>This project supports the use of Docker to run the application. Beware that you still need to set up <a href="#env-variables">environmental variables</a>. The following instructions assume that you already have Docker correctly installed on your machine: </p>
    <p>
      <code>docker build -t apokalypt/09_thesis_management .</code> - Build the image
    </p>
    <p>
      <code>docker run -p 5173:5173 -p 3000:3000 --name thesis_management -e <...> apokalypt/09_thesis_management </code> - Run the container
    </p>
    <p>
      <code>npm run build</code> - Build the project for production
    </p>
    <p>
      <code>npm run preview</code> - Preview the production build
    </p>
    <p>⚠️ <em>A working image is available on <a href="https://hub.docker.com/r/apokalypt/09_thesis_management">Docker Hub</a>
      </em>
    </p>
  </div>
  <div id="fontend-documentation" align="center">
    <h2>Frontend Documentation</h2>
    <p>For a more datailed documentation regarding the Frontend, please <a href="https://github.com/therossee/ThesisManagement-Group09/tree/main/front-end">read here</a>
    </p>
  </div>
  <div id="backend-documentation" align="center">
    <h2>Backend Documentation</h2>
    <p>For a more datailed documentation regarding the Backend, please <a href="https://github.com/therossee/ThesisManagement-Group09/tree/main/backend">read here</a>
    </p>
  </div>
  <div id="database-documentation" align="center">
    <h2>Database Documentation</h2>
    <p>For a more datailed documentation regarding the Backend, please <a href="https://github.com/therossee/ThesisManagement-Group09/tree/main/database">read here</a>
    </p>
  </div>
  <div id="contributors" align="center">
    <h2>Contributors</h2>
    <p>
      <a href="https://github.com/lucabubi">Barbato Luca (320213)</a>
      </li> | <a href="https://github.com/Pancasx">Beltrán Juan Carlos (321607)</a>
      </li> | <a href="https://github.com/therossee">De Rossi Daniele (314796)</a>
      </li> | <a href="https://github.com/DianaHus">Husanu Diana Alexandra (318771)</a>
      </li> | <a href="https://github.com/Apokalypt">Ladrat Mattéo (321529)</a>
      </li> | <a href="https://github.com/Sylvie-Molinatto">Molinatto Sylvie (318952)</a>
      </li> | <a href="https://github.com/micheleschiavone00">Schiavone Michele (319355)</a>
    </p>
  </div>
</html>