import React, { useState } from 'react'

const EditForm = ({ handleEditPassword }) => {
  
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")

    const handleChangePassword = (e) => {
        e.preventDefault()
        handleEditPassword(oldPassword, newPassword)
    }
  
    return (
    <div>
      <h2>Change Password</h2>
      <form onSubmit={handleChangePassword}>
        Old Password:
        <input
            value={oldPassword}
            onChange={({ target }) => setOldPassword(target.value)}
            id='oldPassword'
        />
                New Password:
        <input
            value={newPassword}
            onChange={({ target }) => setNewPassword(target.value)}
            id='newPassword'
        />
        <button id='change-password' type='submit'>Change Password</button>
      </form>
    </div>
  )
}

export default EditForm
