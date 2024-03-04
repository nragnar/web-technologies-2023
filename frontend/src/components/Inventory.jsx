import React from 'react'
import Purchases from './Purchases'
import SoldItems from './SoldItems'
import PersonalItems from './PersonalItems'

const Inventory = ({ purchasedItems, soldItems, personalItems }) => {
  return (
    <div>
      <PersonalItems personalItems={personalItems} />

      <SoldItems soldItems={soldItems}/>
      <Purchases purchasedItems={purchasedItems} />
    </div>
  )
}

export default Inventory
