import React from 'react'
import Purchases from './Purchases'

const Inventory = ({ purchasedItems }) => {
  return (
    <div>
      <h3>Your Items on sale:</h3>
      <h3>Sold items:</h3>
      
      <Purchases purchasedItems={purchasedItems} />
    </div>
  )
}

export default Inventory
