import axios from "axios";

const baseUrl = import.meta.env.VITE_BACKEND_ITEM_HANDLER_URL

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const create = async (newObject, username) => {
  const config = {
    headers: { Authorization: token }
  }
  newObject.owner = username
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const editItem = async (id, editedObject) => {
  console.log('editedObject :>> ', editedObject);
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.put(`${baseUrl}${id}/`, editedObject, config)
  return response.data
}


const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
  }

const deleteItem = async (id) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(`${baseUrl}${id}/`, config)
  return response.data
}

const searchByTitle = async (searchQuery) => {
  const response = await axios.get(`${baseUrl}?search=${searchQuery}`)
  return response.data
}

const getUserCart = async () => {
  try {
    const config = {
      headers: { Authorization: token }
    }
    const response = await axios.get(`http://127.0.0.1:8000/api/users/cart/`, config)
    return response.data
  } catch (error) {
    console.error("Error fetching user's cart:", error);
  }
}

const addToCart = async (id) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(`http://127.0.0.1:8000/api/add-to-cart/`, {item_id: id}, config)
  return response.data
}

const deleteUserCartItem = async (id) => {
    const config = {
      headers: { Authorization: token }
    }
    const response = await axios.delete(`http://127.0.0.1:8000/api/remove-from-cart/${id}/`, config)
    return response.data
  
}



export default { setToken, getAll, create, deleteItem, searchByTitle, addToCart, getUserCart, deleteUserCartItem, editItem }