/* eslint-disable */

import React from 'react'

const Purchases = ({ purchasedItems }) => {

  return (
    <div>
    
      <h3>Purchased items: </h3>

      <ul>
        {purchasedItems>=0 ? <p>You have no purchased items</p> : purchasedItems.map((i) => (
        
          <div className='item-container' key={i.id}>
            <h2>{i.title}</h2>
            <h4>{i.description}</h4>
            <p>Price: {i.price}€</p>
            <p>Date posted: {i.date}</p>
          </div>
        ))}
      </ul>

    </div>
  )
}

export default Purchases
