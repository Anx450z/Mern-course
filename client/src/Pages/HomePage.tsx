import React, { useContext } from 'react'
import { myContext } from './Context'

export default function HomePage() {
  const ctx = useContext(myContext);

  console.log(ctx);
  
  return (
    <div>HomePage</div>
  )
}
