import React from 'react'
import Video from '../../assets/video.mp4'

function VideoSection() {
  return (
    <div className='w-full h-auto flex flex-col'>
        <video autoPlay loop playsInline muted src={Video}>
        </video>
    </div>
  )
}

export default VideoSection