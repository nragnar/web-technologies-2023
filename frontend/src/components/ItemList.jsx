/* eslint-disable */
import  { useState, useEffect } from 'react'
import itemService from '../services/items'

import Item from './Item'

const ItemList = ({ onDelete, onAddToCart, searchQuery }) => {


  const [items, setItems] = useState([])

    // load in items
    useEffect(() => {

      const fetchData = async () => {
        try{
          if (searchQuery.trim() === ''){
            const fetchedItems = await itemService.getAll()
            setItems( fetchedItems )
          } else {
            const searchResults = await itemService.searchByTitle(searchQuery)
            setItems( searchResults )
          }
        } catch (error) {
          console.log('Error fetching data', error)
        }

      }
      fetchData()
    }, [searchQuery])
    

  return (
    <div className='item-list'>
    {items.map(i => (
      <Item onDelete={onDelete} onAddToCart={onAddToCart} key={i.id} id={i.id} title={i.title} description={i.description} price={i.price} date={i.date} owner={i.owner} />
    ))}  
    </div>
  )
}

export default ItemList
