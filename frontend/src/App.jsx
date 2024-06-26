import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'

import itemService from './services/items'
import loginService from './services/login'
import registerService from './services/register'
import ItemForm from './components/ItemForm'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import EditForm from './components/EditForm'
import editService from './services/editAccount'
import ItemList from './components/ItemList'
import Cart from './components/Cart'
import Inventory from './components/Inventory'
import populateService from './services/populate'
import Notification from './components/Notification'
import { Fragment } from 'react'


function App() {

  const navigate = useNavigate();

  const [items, setItems] = useState([])
  const [user, setUser] = useState('')
  const [username, setUsername] = useState('')
  const [searchQuery, setSearchQuery] = useState("")
  const [cartItems, setCartItems] = useState([]);
  const [purchasedItems, setPurchasedItems] = useState([])
  const [soldItems, setSoldItems] = useState([])
  const [personalItems, setPersonalItems] = useState([])
  const [removedItemTitles, setRemovedItemTitles] = useState([])
  const [notification, setNotification] = useState(null)



 //         // load local storage
 //       useEffect(() => {
 //         const loggedUserJSON = window.localStorage.getItem('loggedShopUser')
 //         if (loggedUserJSON) {
 //           const user = JSON.parse(loggedUserJSON)
 //           // we need a setUsername but we dont have that automatically without a login, need to fix the user instance to an object
 //           // setUsername(username)
 //           setUser(user)
 //           itemService.setToken(user.access)
 //         }
 //       }, [])

  // fetch Cart
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        if (user){
          itemService.setToken(user.access);
          const cartData = await itemService.getUserCart();
          setCartItems(cartData.items);
        }
      } catch (error) {
        console.log("Error fetching cart items:", error);
      }
    };
    fetchCartItems();
  }, [user, user.access]);



  // fetch purchased Items
  useEffect(() => {
    const fetchPurchasedItems = async () => {
      try {
        if(user){
          itemService.setToken(user.access);
          const purchaseData = await itemService.getPurchasedItems()
          setPurchasedItems(purchaseData)
        }
      } catch (error) {
        console.log('error fetching Purchase Items', error);
      }
    }
    fetchPurchasedItems()
  }, [user, user.access])

  // fetch sold items
  useEffect(() => {
    const fetchSoldItems = async () => {
      try {
        if(user){
          itemService.setToken(user.access)
          const soldData = await itemService.getSoldItems()
          setSoldItems(soldData)
        }
      } catch (error){
        console.log('error :>> ', error);
      }
    }
    fetchSoldItems()
  }, [user, user.access])

    // get personal items for sale
    useEffect(() => {
      const getPersonalItems = async () => {
        try {
          if(user){
            itemService.setToken(user.access);
            const personalItems = await itemService.getPersonalItems()
            setPersonalItems(personalItems)
          }
        } catch (error) {
          console.log('There was an error fetching personal items.');
        }
      }
      getPersonalItems();
    }, [user, user.access])


       // Fetch items based on the search query
       useEffect(() => {
        const fetchData = async () => {
          try {
            let fetchedItems = [];
            if (searchQuery.trim() === '') {
              fetchedItems = await itemService.getAll();
            } else {
              fetchedItems = await itemService.searchByTitle(searchQuery);
            }
            setItems(fetchedItems);
          } catch (error) {
            console.log('Error fetching data', error);
          }
        };
        fetchData();
      }, [searchQuery])
    
    


  const handlePay = async () => {
    try {

      console.log("we are in handlePay right now")

      // handling the removedItems check
      const cartItemIds = cartItems.map(item => item.id)
      const response = await itemService.getAll()   

      const availableItems = response.map(item => item.id)
      const removedIds = cartItemIds.filter(id => !availableItems.includes(id))
      const removedItems = cartItems.filter(item => removedIds.includes(item.id))
      
      setRemovedItemTitles(removedItems.map(item => item.title))

      if (removedIds.length > 0){

        notify("there has been items removed during your payment process, please manually remove the items that no longer exist.")
      } else {

        try{
          await itemService.handlePayItems(user.access)
          const updatedItems = items.filter(item => !cartItems.some(cartItem => cartItem.id === item.id));
          setItems(updatedItems)
          setPurchasedItems([...purchasedItems, ...cartItems])
          const updatedCart = await itemService.getUserCart()
          setCartItems(updatedCart.items)
        } catch (error) {
          notify(error.response.data)
          const updatedCart = await itemService.getUserCart()
          setCartItems(updatedCart.items)
          console.log('error from cart while paying items', error)
        }
      }
    } catch (error) {
      notify(error.response.data)
      console.log('error in checking removed items', error)
    }
  }


  const handleDeleteFromCart = async (itemId) => {
    try {
      itemService.setToken(user.access);
      await itemService.deleteUserCartItem(itemId);
      // After deletion, fetch the updated cart items
      
      setCartItems(prevCartItems => prevCartItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.log("Error deleting item from cart:", error);
    }
  };

  const handleSubmitItem = async (itemObject) => {
    try{
      console.log('user.id :>> ', username.id);
      const newItem = await itemService.create(itemObject, user.access)
      setItems([...items, newItem])
      setPersonalItems([...personalItems, newItem])
    }
    catch (exception) {
      console.log(exception)
    }
  }

  const handleEditItem = async (id, editObject) => {
    try {
      const editedItem = await itemService.editItem(id, editObject)

      const updatedItems = items.map(item => (item.id == editedItem.id ? editedItem : item))
      setItems(updatedItems)
    } catch (exception) {
      console.log(exception);
    }
  }



  const onLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username, password
      })
      setUsername(username)
      setUser(user)
      itemService.setToken(user.access)
      window.localStorage.setItem('loggedShopUser', JSON.stringify(user))
      navigate("/")
      
    } catch (error) {
      notify(error.response.data, 'error')
      console.log(error);
  }
  }

  const onHandleEditPassword = async (oldPassword, newPassword) => {
    try {
      editService.setToken(user.access)

      await editService.editPassword({ old_password: oldPassword, new_password: newPassword })

      navigate("/")
      notify('password changed successfully')
    } catch (error) {
      notify('failed.')
    }
  }

  const onLogout = () => {
    window.localStorage.removeItem('loggedShopUser')
    setUser('')
    setUsername('')
  }

  const onRegister = async (username, password) => {
    try {
      await registerService.register({
        username, password
      })
      navigate("/")
    } catch (expection) {
      console.log(expection)
    }
  }


  const onDelete = async (id) => {
    await itemService.deleteItem(id)
    const updatedItems = await itemService.getAll()
    setItems(updatedItems)

  }

  const onAddToCart = async (id) => {
    try {
      const response = await itemService.addToCart(id)
      const updatedCartItems = await itemService.getUserCart()
      setCartItems(updatedCartItems.items)
      notify(response)
    } catch (error) {
      notify(error.response.data)
      }
    }

    const populateDB = async () => {
      try {
        const response = await populateService.populate()
        const fetchedItems = await itemService.getAll();
        setItems(fetchedItems)
        notify(response.message)



      } catch (error) {
        console.log('error :>> ', error);
      }
    }

    const notify = (message, type = 'success') => {
      setNotification({ message, type })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }


  return (
    <>
      
        <Routes>
          <Route path='/login' element={<div>
            <LoginForm handleLogin={onLogin} />
            </div>
          } />
          <Route path="/register" element={<RegisterForm handleRegister={onRegister} />} />
          <Route path="/account" element={<EditForm handleEditPassword={onHandleEditPassword}/>} />
          <Route path="/myitems" element={<Inventory user={user.access} purchasedItems={purchasedItems} soldItems={soldItems} personalItems={personalItems} />} />

          <Route path='/' element= {
            <div>
              <Link className='website-title' to="/">WebShop - nragnell</Link>
              <Notification notification={notification} />
              <br />
              <button onClick={populateDB}>Populate db</button>
              <br />
              {!user ? <>
              <Link to="/login">Login</Link>
              <br />
              <Link to="/register">Register</Link>
              </>
              :
              <>
              <p>Logged in as {username}</p>
              <button onClick={onLogout}>Log out</button>
              <br />
              <Link to="/account">Edit password</Link>
              <br />
              <Link to="/myitems">My Items</Link>
              <br />
              <ItemForm handleSubmitItem={handleSubmitItem} />
              <Cart handlePay={handlePay} cartItems={cartItems} handleDeleteFromCart={handleDeleteFromCart} removedItemTitles={removedItemTitles} />
              
              </>
              }
               
              <br/>
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search by title'
              />
              <h2>Items for Sale</h2>
              <ItemList handleEditItem={handleEditItem} username={username} items={items} onDelete={onDelete} onAddToCart={onAddToCart} />

            </div>
          }
          /> {/* Route "/" end */}
         </Routes>
  </>
  )
}

export default App

//TODO: make the user different, now it just contains the access and refresh token.
//TODO: when a price is edited, the item.item_notification should instantly show rather than having to refresh the page
//TODO: eliminate the refresh page for updates alltogether
