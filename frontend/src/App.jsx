import { useState, useEffect } from 'react'
import itemService from './services/items'
import loginService from './services/login'
import registerService from './services/register'
import ItemForm from './components/ItemForm'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import ItemList from './components/ItemList'
import Cart from './components/Cart'


function App() {

  const [items, setItems] = useState([])
  const [user, setUser] = useState('')
  const [username, setUsername] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const handleSubmitItem = async (blogObject) => {
    try{
      console.log('user.id :>> ', username.id);
      const newItem = await itemService.create(blogObject, user.access)
      setItems([...items, newItem])
    }
    catch (exception) {
      console.log(exception)
    }
  }

    // load local storage
    useEffect(() => {
      const loggedUserJSON = window.localStorage.getItem('loggedShopUser')
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        // we need a setUsername but we dont have that automatically without a login, need to fix the user instance to an object
        // setUsername(username)
        setUser(user)
        itemService.setToken(user.access)
      }
    }, [])

  const onLogin = async (username, password) => {
    console.log('handle login')
    try {
      const user = await loginService.login({
        username, password
      })
      setUsername(username)
      setUser(user)
      itemService.setToken(user.access)
      window.localStorage.setItem('loggedShopUser', JSON.stringify(user))

    } catch (exception) {
      console.log(exception);
  }
  }

  const onLogout = () => {
    console.log('handle logout')
    window.localStorage.removeItem('loggedShopUser')
    setUser(null)
    setUsername('')
  }

  const onRegister = async (username, password) => {
    console.log('handle Register')
    try {
      await registerService.register({
        username, password
      })

    } catch (expection) {
      console.log(expection)
    }
  }


  const onDelete = async (id) => {
    console.log('handle delete item')

    await itemService.deleteItem(id)
    await itemService.getAll()

  }

  const onAddToCart = async (id) => {
    try {
      await itemService.addToCart(id)
      alert('item added')
    } catch (error) {
      alert('error')
    }
  }


  console.log('username :>> ', username);
  console.log('user :>> ', user);
  
  return (
    <>

    <h1>Web Shop - nragnell</h1>
    <div className='register-login-forms'>
    <input
      type='text'
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder='Search by title'
    />

    {
    !user ? (
    <div> 
    <LoginForm handleLogin={onLogin} />
    
    </div>
    )
    :
    <div>
    <ItemForm handleSubmitItem={handleSubmitItem} />
    <p>Logged in as: {username!=null ? username : " " }</p>
    <button onClick={onLogout}>Log out</button>
    </div>
    }

    <RegisterForm handleRegister={onRegister} />
    </div>
    <ItemList onDelete={onDelete} onAddToCart={onAddToCart} searchQuery={searchQuery}/>
    <Cart accessToken={user.access} />
    </>
  )
}

export default App

//TODO: make the user different, now it just contains the access and refresh token.
