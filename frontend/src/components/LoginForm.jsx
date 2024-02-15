/* eslint-disable */

import React, { useState } from 'react'

const LoginForm = ({ handleLogin }) => {


  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    handleLogin(username, password)
  }



  return (
    <div>
      <h2>Log in to the WebShop</h2>

      <form onSubmit={handleSubmit}>

        username:
        <input
        value={username}
        onChange={({ target }) => setUsername(target.value)}
        id='username'
        />
        password:
        <input 
        value={password}
        onChange={({ target }) => setPassword(target.value)}
        id='password'
        />

        <button id='login-button' type='submit'>Log in</button>
      </form>
    </div>
  )
}

export default LoginForm
