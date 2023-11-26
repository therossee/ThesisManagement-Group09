// Import necessary dependencies
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

// Functional component with a login button
const LoginButton = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    // Render the login button only if the user is not authenticated
    !isAuthenticated && (
      <button onClick={() => loginWithRedirect()}>
        Log In
      </button>
    )
  );
};

export default LoginButton;
