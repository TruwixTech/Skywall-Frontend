import React from 'react'
import HeroSection from '../Components/HomepageComponents/HeroSection'
import TelevisionCollections from '../Components/HomepageComponents/TelevisionCollections'
import VideoSection from '../Components/HomepageComponents/VideoSection'
import Section4 from '../Components/HomepageComponents/Section4'

function Homepage() {
  return (
    <div className='w-full min-h-screen flex flex-col'>
      <HeroSection />
      <TelevisionCollections />
      <VideoSection />
      <Section4 />
    </div>
  )
}

export default Homepage