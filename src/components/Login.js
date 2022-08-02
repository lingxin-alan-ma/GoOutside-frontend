import React from 'react';
// import { useGoogleLogin, GoogleLogin } from 'react-google-login';
// import { GoogleLogin } from 'react-google-login';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function Login({ setUser }) {

  // const onSuccess = (res) => {
  //   console.log('Login Success: currentUSER:', res.profileObj);
  //   setUser(res.profileObj)
  // };

  const onSuccess = (res) => {
    var tokenData = jwt_decode(res.credential);
    var loginData = {
      googleId: tokenData.sub,
      ...tokenData
    }
    setUser(loginData);
    localStorage.setItem("login", JSON.stringify(loginData));
  };

  const onFailure = (res) => {
    console.log('Login failed: res:', res);
  }

  // userGoogleLogin({
  //   onSuccess,
  //   onFailure,
  //   clientId,
  // })

  return (
    <div>
    <GoogleLogin
      clientId={clientId}
      buttonText="Login"
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy={'single_host_origin'}
      style={{ marginTop: '100px' }}
      isSignedIn={true}
      auto_select={true}
    />
  </div>
  );
}

export default Login;