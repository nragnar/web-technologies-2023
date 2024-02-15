import React, { useState, useEffect } from 'react';
import itemService from '../services/items';

const Cart = ({ accessToken, userId }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        itemService.setToken(accessToken);
        const cartData = await itemService.getUserCart(userId);
        setCartItems(cartData.items);
      } catch (error) {
        console.log("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, [accessToken, userId]);

  const handleDeleteFromCart = async (itemId) => {
    try {
      itemService.setToken(accessToken);
      await itemService.deleteUserCartItem(itemId);
      // After deletion, fetch the updated cart items
      const updatedCartData = await itemService.getUserCart();
      setCartItems(updatedCartData.items);
    } catch (error) {
      console.log("Error deleting item from cart:", error);
    }
  };

  return (
    <div>
      <h2>Your Cart:</h2>
      <ul>
        {cartItems.map((item) => (
          <div className='item-container' key={item.id}>
            <h2>{item.title}</h2>
            <h4>{item.description}</h4>
            <p>Price: {item.price}€</p>
            <p>Posted by {item.owner}</p>
            <p>Date posted: {item.date}</p>
            <button onClick={() => handleDeleteFromCart(item.id)}>Delete from Cart</button>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Cart;