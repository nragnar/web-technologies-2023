import axios from "axios";

const baseUrl = "http://127.0.0.1:8000/api/token/";

const login = async credentials => {
    const response = await axios.post(baseUrl, credentials)
    return response.data
}

export default { login } 
