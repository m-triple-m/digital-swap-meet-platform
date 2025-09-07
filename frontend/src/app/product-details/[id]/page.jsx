import { useParams } from 'next/navigation'
import React, { useState } from 'react'

const product = () => {

  const {id} = useParams();
  
  return (
    <div>product</div>
  )
}

export default product