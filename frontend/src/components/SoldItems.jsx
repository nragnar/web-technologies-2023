/* eslint-disable */

import React from 'react'

const SoldItems = ({ soldItems }) => {

  return (
    <div>
    <h3>Sold items: </h3>

    <ul>
      {soldItems >=0 ? <p>You have not sold any items yet</p> : soldItems.map((i) => (
      
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

export default SoldItems
