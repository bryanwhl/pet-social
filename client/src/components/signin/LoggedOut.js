import React from 'react'
import { useState } from 'react';
import Login from './Login.js'
import Signup from './Signup.js'
import ResetPassword from './ResetPassword.js'
import { useHistory } from "react-router-dom";

const LoggedOut = ({ getCurrentUser }) => {

  const [appState, setAppState] = useState("Signin");

  const history = useHistory();

  // Routes to /home after login
  const switchToHome = () => {
    history.push("/home")
  }

  // Changes to sign up screen
  const switchToSignup = () => {
    setAppState("Signup")
  }

  // Changes to sign in screen
  const switchToSignin = () => {
    setAppState("Signin")
  }

  // Switch to reset password screen
  const switchToResetPassword = () => {
    setAppState("Reset Password")
  }

  return (
    <div>
      {appState === "Signin"
        && <Login switchToSignup={switchToSignup} switchToHome={switchToHome} getCurrentUser={getCurrentUser} switchToResetPassword={switchToResetPassword} />}
      {appState === "Signup"
        && <Signup switchToSignin={switchToSignin}/>}
      {appState === "Reset Password"
        && <ResetPassword switchToSignin={switchToSignin}/>}
    </div>
  )
}

export default LoggedOut
