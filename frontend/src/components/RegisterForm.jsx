/* eslint-disable */

import React, { useState } from 'react'

const RegisterForm = ({ handleRegister }) => {


  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    handleRegister(username, password)
  }



  return (
    <div>
      <h2>Register new User to the webshop</h2>

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

        <button id='register-button' type='submit'>Register</button>
      </form>
    </div>
  )
}

export default RegisterForm