import React from 'react'

const PersonalItems = ({ personalItems }) => {
  return (
    <div>
      <h3>Your items for sale: </h3>

<ul>
  {personalItems >= 0 ? <p>You currently have no items for sale</p> : personalItems.map((i) => (
  
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

export default PersonalItems
