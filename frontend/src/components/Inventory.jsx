import React from 'react'
import Purchases from './Purchases'
import SoldItems from './SoldItems'

const Inventory = ({ purchasedItems, soldItems }) => {
  return (
    <div>
      <h3>Your Items on sale:</h3>

      <SoldItems soldItems={soldItems}/>
      <Purchases purchasedItems={purchasedItems} />
    </div>
  )
}

export default Inventory
