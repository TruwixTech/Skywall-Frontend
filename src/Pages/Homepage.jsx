import React from 'react'
import HeroSection from '../Components/HomepageComponents/HeroSection'
import TelevisionCollections from '../Components/HomepageComponents/TelevisionCollections'

function Homepage() {
  return (
    <div className='w-full min-h-screen flex flex-col'>
      <HeroSection />
      <TelevisionCollections />
    </div>
  )
}

export default Homepage