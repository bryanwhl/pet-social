import React from 'react'
import { useState, useEffect } from 'react';
import Login from './Login.js'
import Signup from './Signup.js'
import ResetPassword from './ResetPassword.js'
import { useHistory } from "react-router-dom";
import { withRouter } from 'react-router-dom'
import { currentUserQuery } from '../../queries.js'
import { useLazyQuery } from '@apollo/client'

const LoggedOut = ({ getCurrentUser }) => {

  const [appState, setAppState] = useState("Signin");

  const history = useHistory();

  const switchToHome = () => {
    history.push("/home")
  }

  const switchToSignup = () => {
    setAppState("Signup")
  }
  const switchToSignin = () => {
    setAppState("Signin")
  }
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
