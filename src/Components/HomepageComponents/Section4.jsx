import React, { useState, useEffect, useCallback, useRef } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaPlay, FaPause } from "react-icons/fa";
import HeroImg1 from "../../assets/hero1.webp";
import HeroImg2 from "../../assets/hero2.webp";
import HeroImg3 from "../../assets/hero3.webp";

const carousel = [HeroImg1, HeroImg2, HeroImg3];

function Section4() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const intervalRef = useRef(null);

    // Auto-slide logic
    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex((prevIndex) =>
                    prevIndex === carousel.length - 1 ? 0 : prevIndex + 1
                );
            }, 3000);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isPlaying]);

    // Next slide
    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) =>
            prevIndex === carousel.length - 1 ? 0 : prevIndex + 1
        );
    }, []);

    // Previous slide
    const prevSlide = useCallback(() => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? carousel.length - 1 : prevIndex - 1
        );
    }, []);

    // Select slide manually
    const goToSlide = useCallback((index) => {
        setCurrentIndex(index);
    }, []);

    // Toggle play/pause
    const togglePlayPause = useCallback(() => {
        setIsPlaying((prev) => !prev);
    }, []);

    return (
        <>
            <h1 className="w-full text-center text-xl md:text-3xl font-semibold py-4">
                Experience The 4K Ultra HD Smart TV
            </h1>
            <div className="relative w-full min-h-[80%] overflow-hidden">
                {/* Image Carousel */}
                <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)`, willChange: "transform" }}
                >
                    {carousel.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Slide ${index}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    ))}
                </div>

                {/* Left & Right Arrows */}
                <button
                    onClick={prevSlide}
                    aria-label="Previous Slide"
                    className="hidden md:block absolute border border-white top-1/2 left-4 text-white text-3xl bg-black bg-opacity-50 p-2 rounded-full transform -translate-y-1/2 hover:bg-opacity-70 transition-all"
                >
                    <IoIosArrowBack />
                </button>
                <button
                    onClick={nextSlide}
                    aria-label="Next Slide"
                    className="hidden md:block absolute border border-white top-1/2 right-4 text-white text-3xl bg-black bg-opacity-50 p-2 rounded-full transform -translate-y-1/2 hover:bg-opacity-70 transition-all"
                >
                    <IoIosArrowForward />
                </button>

                {/* Play & Pause Button */}
                <button
                    onClick={togglePlayPause}
                    aria-label={isPlaying ? "Pause Slideshow" : "Play Slideshow"}
                    className="hidden md:block absolute bottom-4 left-4 text-white border border-white text-xl bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70 transition-all"
                >
                    {isPlaying ? <FaPause /> : <FaPlay />}
                </button>

                {/* Bullet Indicators */}
                <div className="hidden md:flex absolute bottom-4 left-1/2 transform -translate-x-1/2 gap-2">
                    {carousel.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to Slide ${index + 1}`}
                            className={`w-3 h-3 rounded-full cursor-pointer border border-white transition-all duration-300 ${currentIndex === index ? "bg-black" : "bg-gray-400"
                                }`}
                        ></button>
                    ))}
                </div>

                {/* Mobile Controls */}
                <div className="w-full bg-gray-200 h-10 flex justify-center items-center md:hidden">
                    <div className="w-auto flex gap-4 sm:gap-8 items-center">
                        <button
                            onClick={prevSlide}
                            aria-label="Previous Slide"
                            className="border border-white text-white text-xl bg-black bg-opacity-50 p-1 rounded-full hover:bg-opacity-70 transition-all"
                        >
                            <IoIosArrowBack />
                        </button>
                        <div className="flex gap-2">
                            {carousel.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    aria-label={`Go to Slide ${index + 1}`}
                                    className={`w-3 h-3 rounded-full cursor-pointer border border-white transition-all duration-300 ${currentIndex === index ? "bg-black" : "bg-gray-400"
                                        }`}
                                ></button>
                            ))}
                        </div>
                        <button
                            onClick={nextSlide}
                            aria-label="Next Slide"
                            className="border border-white text-white text-xl bg-black bg-opacity-50 p-1 rounded-full hover:bg-opacity-70 transition-all"
                        >
                            <IoIosArrowForward />
                        </button>
                        <button
                            onClick={togglePlayPause}
                            aria-label={isPlaying ? "Pause Slideshow" : "Play Slideshow"}
                            className="text-white border border-white text-xl bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70 transition-all"
                        >
                            {isPlaying ? <FaPause size={15} /> : <FaPlay size={15} />}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default React.memo(Section4);