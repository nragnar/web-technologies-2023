/* eslint-disable */

import { useState } from 'react'

const ItemForm = ({ handleSubmitItem }) => {

    const [newTitle, setNewTitle] = useState("")
    const [newDescription, setNewDescription] = useState("")
    const [newPrice, setNewPrice] = useState("")


    const addItem = (e) => {
      e.preventDefault()
      handleSubmitItem({
        title: newTitle,
        description: newDescription,
        price: newPrice,
      })
      setNewTitle('')
      setNewDescription('')
      setNewPrice('')
    }



  return (
    <div>
      <form>
        <div>
          Title:
          <input type='text' value={newTitle} onChange={({target}) => setNewTitle(target.value)} />
        </div>
        <div>
          Description:
          <input type='text' value={newDescription} onChange={({target}) => setNewDescription(target.value)} />
        </div>
        <div>
          Price:
          <input type='text' value={newPrice} onChange={({target}) => setNewPrice(target.value)} />
        </div>
        <button type='submit' onClick={addItem}>Submit</button>

    </form>
    </div>
  )
}

export default ItemForm
