import React from 'react'
import Purchases from './Purchases'
import SoldItems from './SoldItems'
import PersonalItems from './PersonalItems'
import { Link } from 'react-router-dom'

const Inventory = ({ purchasedItems, soldItems, personalItems, user }) => {
  return (

    

    <div>

      {!user ? 
      <>
      <Link className='website-title' to="/">WebShop - nragnell</Link>
      <p>You are not signed in</p> 
      </>
      : 
      <>
      <Link className='website-title' to="/">WebShop - nragnell</Link>
      <PersonalItems personalItems={personalItems} />
      <SoldItems soldItems={soldItems}/>
      <Purchases purchasedItems={purchasedItems} />
      <Link to="/">Back to front page</Link>
      </>
      }
      
      

    </div>
  )
}

export default Inventory
