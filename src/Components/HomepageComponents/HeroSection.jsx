import React, { useState, useEffect, useCallback, memo } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaPlay, FaPause } from "react-icons/fa";
import HeroImg1 from "../../assets/hero1.jpg";
import HeroImg2 from "../../assets/hero2.jpg";
import HeroImg3 from "../../assets/hero3.jpg";

// Memoized carousel images array
const carousel = [HeroImg1, HeroImg2, HeroImg3];

// Memoized components to prevent unnecessary re-renders
const ArrowButton = memo(({ direction, onClick }) => (
  <button
    onClick={onClick}
    className="hidden md:block absolute border border-white top-1/2 text-white text-3xl bg-black bg-opacity-50 p-2 rounded-full transform -translate-y-1/2"
    style={direction === 'left' ? { left: '1rem' } : { right: '1rem' }}
  >
    {direction === 'left' ? <IoIosArrowBack /> : <IoIosArrowForward />}
  </button>
));

const PlayPauseButton = memo(({ isPlaying, togglePlay }) => (
  <button
    onClick={togglePlay}
    className="hidden md:block absolute bottom-4 left-4 text-white border border-white text-xl bg-black bg-opacity-50 p-2 rounded-full"
  >
    {isPlaying ? <FaPause /> : <FaPlay />}
  </button>
));

const BulletIndicators = memo(({ count, currentIndex, goToSlide }) => (
  <div className="hidden md:flex absolute bottom-4 left-1/2 transform -translate-x-1/2 gap-2">
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        onClick={() => goToSlide(index)}
        className={`w-3 h-3 rounded-full cursor-pointer border border-white transition-all duration-300 ${
          currentIndex === index ? "bg-black" : "bg-gray-400"
        }`}
      ></div>
    ))}
  </div>
));

function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Memoized slide navigation functions
  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev === carousel.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? carousel.length - 1 : prev - 1));
  }, []);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  // Optimized auto-slide with cleanup
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, [isPlaying, nextSlide]);

  // Mobile controls component
  const MobileControls = memo(() => (
    <div className="w-full bg-gray-200 h-10 flex justify-center items-center md:hidden">
      <div className="w-auto flex gap-4 sm:gap-8 items-center">
        <button onClick={prevSlide} className="border border-white text-white text-xl bg-black bg-opacity-50 p-1 rounded-full">
          <IoIosArrowBack />
        </button>
        <div className="flex gap-2">
          {carousel.map((_, index) => (
            <div
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full cursor-pointer border border-white transition-all duration-300 ${
                currentIndex === index ? "bg-black" : "bg-gray-400"
              }`}
            ></div>
          ))}
        </div>
        <button onClick={nextSlide} className="border border-white text-white text-xl bg-black bg-opacity-50 p-1 rounded-full">
          <IoIosArrowForward />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-white border border-white text-xl bg-black bg-opacity-50 p-2 rounded-full"
        >
          {isPlaying ? <FaPause size={15} /> : <FaPlay size={15} />}
        </button>
      </div>
    </div>
  ));

  return (
    <div className="relative w-full min-h-[80%] overflow-hidden">
      {/* Optimized image carousel */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ 
          transform: `translateX(-${currentIndex * 100}%)`,
          willChange: 'transform' // Hint browser about animation
        }}
      >
        {carousel.map((image, index) => (
          <img 
            key={index} 
            src={image} 
            alt={`Slide ${index}`} 
            className="w-full h-full object-cover"
            loading="lazy" // Defer offscreen images
            decoding="async" // Async image decoding
          />
        ))}
      </div>

      <ArrowButton direction="left" onClick={prevSlide} />
      <ArrowButton direction="right" onClick={nextSlide} />
      <PlayPauseButton isPlaying={isPlaying} togglePlay={() => setIsPlaying(!isPlaying)} />
      <BulletIndicators 
        count={carousel.length} 
        currentIndex={currentIndex} 
        goToSlide={goToSlide} 
      />
      <MobileControls />
    </div>
  );
}

export default React.memo(HeroSection);