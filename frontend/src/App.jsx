import { useState, useEffect } from 'react'
import itemService from './services/items'
import loginService from './services/login'
import registerService from './services/register'
import ItemForm from './components/ItemForm'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import ItemList from './components/ItemList'
import Cart from './components/Cart'
import Inventory from './components/Inventory'


function App() {

  const [items, setItems] = useState([])
  const [user, setUser] = useState('')
  const [username, setUsername] = useState('')
  const [searchQuery, setSearchQuery] = useState("")
  const [cartItems, setCartItems] = useState([]);
  const [purchasedItems, setPurchasedItems] = useState([])
  const [soldItems, setSoldItems] = useState([])
  const [personalItems, setPersonalItems] = useState([])

  // fetch Cart
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        itemService.setToken(user.access);
        const cartData = await itemService.getUserCart();
        setCartItems(cartData.items);
      } catch (error) {
        console.log("Error fetching cart items:", error);
      }
    };
    fetchCartItems();
  }, [user.access]);

  // fetch purchased Items
  useEffect(() => {
    const fetchPurchasedItems = async () => {
      try {
        itemService.setToken(user.access);
        const purchaseData = await itemService.getPurchasedItems()
        console.log('purchaseData', purchaseData);
        setPurchasedItems(purchaseData)
      } catch (error) {
        console.log('error fetching Purchase Items', error);
      }
    }
    fetchPurchasedItems()
  }, [user.access])

  // fetch sold items
  useEffect(() => {
    const fetchSoldItems = async () => {

      try {
        itemService.setToken(user.access)
        const soldData = await itemService.getSoldItems()
        setSoldItems(soldData)

      } catch (error){
        console.log('error :>> ', error);
      }
    }
    fetchSoldItems()
  }, [user.access])

    // get personal items for sale
    useEffect(() => {
      const getPersonalItems = async () => {
        try {
          itemService.setToken(user.access);
          const personalItems = await itemService.getPersonalItems()
          setPersonalItems(personalItems)
          console.log('personalItems :>> ', personalItems);
        } catch (error) {
          console.log('There was an error fetching personal items.');
        }
      }
      getPersonalItems();
    }, [user.access])


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



  const handlePay = async () => {
    try {
      await itemService.handlePayItems(user.access)
      const updatedItems = items.filter(item => !cartItems.some(cartItem => cartItem.id === item.id));
      setItems(updatedItems)
      setPurchasedItems([...purchasedItems, ...cartItems])
      console.log("we are in handlePay")
    } catch (error) {
      console.log('error from cart while paying items', error)
    }
  }


  const handleDeleteFromCart = async (itemId) => {
    try {
      itemService.setToken(user.access);
      await itemService.deleteUserCartItem(itemId);
      // After deletion, fetch the updated cart items
      const updatedCartData = await itemService.getUserCart();
      setCartItems(updatedCartData.items);
    } catch (error) {
      console.log("Error deleting item from cart:", error);
    }
  };



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

  const handleEditItem = async (id, editObject) => {
    console.log('editObject in app.jsx :>> ', editObject);
    try {
      const editedItem = await itemService.editItem(id, editObject)

      const updatedItems = items.map(item => (item.id == editedItem.id ? editedItem : item))
      setItems(updatedItems)
    } catch (exception) {
      console.log(exception);
    }
  }



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
    setUser('')
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
    const updatedItems = await itemService.getAll()
    setItems(updatedItems)

  }

  const onAddToCart = async (id) => {
    try {
      const response = await itemService.addToCart(id)
      const updatedCartItems = await itemService.getUserCart()
      setCartItems(updatedCartItems.items)
      alert(response)
    } catch (error) {
      alert(error.response.data)
      }
    }

    console.log('personalItems :>> ', personalItems);
  
  return (
    <>

    <h1>Web Shop - nragnell</h1>
    <div className='register-login-forms'>
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
    <Cart handlePay={handlePay} cartItems={cartItems} handleDeleteFromCart={handleDeleteFromCart}/>
    </div>
    }

    <RegisterForm handleRegister={onRegister} />
    </div>
    <input
      type='text'
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder='Search by title'
    />
    <ItemList handleEditItem={handleEditItem} username={username} items={items} onDelete={onDelete} onAddToCart={onAddToCart}/>
    <Inventory purchasedItems={purchasedItems} soldItems={soldItems} personalItems={personalItems} />
    </>
  )
}

export default App

//TODO: make the user different, now it just contains the access and refresh token.
