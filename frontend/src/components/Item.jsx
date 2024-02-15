/* eslint-disable*/

import React from 'react'

const Item = ({onDelete, onAddToCart, id, title, description, price, date, owner}) => {

  console.log('id :>> ', id);
  return (
    <div className='item-container'>
      <h2>{title}</h2>
      <h4>{description}</h4>
      <p>price: {price}€</p>
      <p>posted by {owner}</p>
      <p>date posted: {date}</p>
      <button onClick={() => onAddToCart(id)}>Add to Cart</button>
      <button>Edit Post</button>
      <button  onClick={() => onDelete(id)}>Delete Post</button>
    </div>
  )
}

export default Item
