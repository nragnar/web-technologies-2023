import axios from "axios";

const baseUrl = "http://127.0.0.1:8000/api/register/";

const register = async credentials => {
    console.log('credentials :>> ', credentials);
    const response = await axios.post(baseUrl, credentials)
    return response.data
}

export default { register } 