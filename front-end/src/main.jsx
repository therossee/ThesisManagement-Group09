import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Setup dayjs library
import dayjs from "dayjs";
import Duration from "dayjs/plugin/duration";
dayjs.extend(Duration);
import UTC from "dayjs/plugin/utc";
dayjs.extend(UTC);
import Timezone from "dayjs/plugin/timezone";
dayjs.extend(Timezone);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
