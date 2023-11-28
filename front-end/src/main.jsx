import React from 'react'
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
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

const root = createRoot(document.getElementById('root'));

root.render(
<Auth0Provider
    domain="thesis-management-09.eu.auth0.com"
    clientId="o5I1QNTABwbX6g1xc2lxota9aZQEsOvA"
    authorizationParams={{
			redirect_uri: window.location.origin,
			audience: 'https://thesis-management-09.eu.auth0.com/api/v2/',
			scope: 'read:current_user update:current_user_metadata',
		}}
		cacheLocation='localstorage'
  >
    <App />
</Auth0Provider>,
);
