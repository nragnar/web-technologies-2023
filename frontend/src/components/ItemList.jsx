/* eslint-disable */
import  { useState, useEffect } from 'react'
import itemService from '../services/items'

import Item from './Item'

const ItemList = ({username, handleEditItem,  items, onDelete, onAddToCart }) => {

  return (
    <>
      <div className='item-list'>
      {items === undefined || items.length == 0
      ?
      <h3>No items for sale</h3>
      :
      items.map(i => (
        <Item username={username} handleEditItem={handleEditItem} onDelete={onDelete} onAddToCart={onAddToCart} key={i.id} id={i.id} title={i.title} description={i.description} price={i.price} date={i.date} owner={i.owner} />
      ))}  
      </div>
    </>
  )
}

export default ItemList
