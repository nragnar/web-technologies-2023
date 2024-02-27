/* eslint-disable*/

import React, { useState } from 'react'

const Item = ({ username, handleEditItem, onDelete, onAddToCart, id, title, description, price, date, owner}) => {

  const [visible, setVisible] = useState(false)
  const [editTitle, setEditTitle] = useState(title)
  const [editDescription, setEditDescription] = useState(description)
  const [editPrice, setEditPrice] = useState(price)


const editItem = (e) => {
    e.preventDefault();
    
    handleEditItem(id, {
      title: editTitle,
      description: editDescription,
      price: editPrice,
    })
    setVisible(!visible)
  }


  return (
    <div className='item-container'>
      <h2>{title}</h2>
      <h4>{description}</h4>
      <p>price: {price}€</p>
      <p>posted by {owner}</p>
      <p>date posted: {new Date(date).toUTCString()}</p>

      {username && <button onClick={() => onAddToCart(id)}>Add to Cart</button>}
      
      

      {username === owner && (
      <div>
        <button  onClick={() => onDelete(id)}>Delete Post</button>
        <button onClick={() => setVisible(!visible)}>Edit Post</button>
        {visible &&

            <form>
            <div>
              Title:
              <input type='text' value={editTitle} onChange={({target}) => setEditTitle(target.value)} />
            </div>
            <div>
              Description:
              <input type='text' value={editDescription} onChange={({target}) => setEditDescription(target.value)} />
            </div>
            <div>
              Price:
              <input type='text' value={editPrice} onChange={({target}) => setEditPrice(target.value)} />
            </div>
            <button type='submit' onClick={editItem}>Submit</button>

</form>

        }
      </div>
    )}
    </div>
  )
}

export default Item
