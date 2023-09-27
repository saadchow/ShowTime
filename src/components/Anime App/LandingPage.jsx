import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const LandingPage = () => {
  const handleSuccess = (response) => {
    console.log(response);
  };

  const handleError = (response) => {
    console.error(response);
  };

  return (
    <div>
      <h1>Welcome to ShowTime</h1>
      <p>Your one-stop platform for all things anime.</p>
      <GoogleLogin
        clientId={process.env.REACT_APP_CLIENT_ID}
        buttonText="Sign in with Google"
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
};

export default LandingPage;
