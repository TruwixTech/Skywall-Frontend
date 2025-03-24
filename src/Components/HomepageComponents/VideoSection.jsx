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
        <source src='https://res.cloudinary.com/daqtq6xns/video/upload/f_auto:video,q_auto/bmt6hni1u5hog7gih5an' type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default memo(VideoSection);