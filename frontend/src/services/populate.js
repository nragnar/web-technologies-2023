import axios from "axios";

const url = 'http://127.0.0.1:8000/api/populate/'

const populate = async () => {
    const response = await axios.get(url)
    console.log('response.data :>> ', response.data);
    return response.data
}


export default { populate }
