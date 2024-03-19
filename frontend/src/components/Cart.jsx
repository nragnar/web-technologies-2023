{/* eslint-disable */}
import React, { useState, useEffect } from 'react';
import itemService from '../services/items';

const Cart = ({ handlePay, cartItems, handleDeleteFromCart, removedItemTitles }) => {

  return (
    <div>
      <h2>Your Cart:</h2>

      {removedItemTitles.length > 0 && (
          <div>
            <h2>Removed items:</h2>
            {removedItemTitles.map((title, index) => (
              <div key={index}> 
              <h3>{title}</h3>
              </div>
            ))}
          </div>
        )}
        
      <ul>
      <div className='item-list'>
    
        {cartItems === undefined || cartItems.length == 0
        ? 
        <h3>No items in Cart</h3>
        :
        
        cartItems.map((item) => (
          <div className='item-container' key={item.id}>
            {item.item_notification && <p className='price-change-notification'>{item.item_notification}</p>}
            <h2>{item.title}</h2>
            <h4>{item.description}</h4>
            <p>Price: {item.price}€</p>
            <p>Posted by {item.owner}</p>
            <p>Date posted: {item.date}</p>
            <button onClick={() => handleDeleteFromCart(item.id)}>Delete from Cart</button>
          </div>
        ))}

      </div>
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