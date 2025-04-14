import React, { useRef, useEffect, memo } from 'react';

function VideoSection() {
  const videoRef = useRef(null);

  // Handle video loading and playback
  useEffect(() => {
    const video = videoRef.current;
    
    // Preload video metadata
    video.load();

    // Handle video autoplay on supported browsers
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn('Video autoplay failed:', error);
      });
    }

    // Cleanup on unmount
    return () => {
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, []);

  return (
    <div className='w-full h-auto flex flex-col'>
      <video
        ref={videoRef}
        autoPlay
        loop
        playsInline
        muted
        preload="auto"
        className="w-full h-auto"
        aria-label="Background video"
      >
        <source src='https://sky-wall.s3.ap-south-1.amazonaws.com/1744631810058_skywall_64d44eec0a57468bafbcde5ebd47c2d3.mp4' type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default memo(VideoSection);