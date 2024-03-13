import axios from "axios";

let token = null

const setToken = newToken => {
    token = `Bearer ${newToken}`
  }

const editPassword = async credentials => {
    console.log('credentials :>> ', credentials);
    const config = {
      headers: { Authorization: token }
    }
    const response = await axios.put('http://127.0.0.1:8000/api/edit-account/', credentials, config)
    return response.data
  }

  export default { setToken, editPassword }