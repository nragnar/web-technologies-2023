{/* eslint-disable */}
import React, { useState, useEffect } from 'react';
import itemService from '../services/items';

const Cart = ({ handlePay, cartItems, handleDeleteFromCart }) => {





  return (
    <div>
      <h2>Your Cart:</h2>
      <ul>
        {cartItems === undefined || cartItems.length == 0
        ? 
        <h3>No items in Cart</h3>
        :
        
        cartItems.map((item) => (
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
      <div>
      {!(!cartItems|| !cartItems.length) &&
      <button className='pay-button' onClick={handlePay}>
        Pay
      </button>
      }
      </div>
      
    </div>
  );
};

export default Cart;