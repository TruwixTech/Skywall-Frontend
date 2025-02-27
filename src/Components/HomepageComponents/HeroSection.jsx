import React, { useState, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaPlay, FaPause } from "react-icons/fa";
import HeroImg1 from "../../assets/hero1.jpg";
import HeroImg2 from "../../assets/hero2.jpg";
import HeroImg3 from "../../assets/hero3.jpg";

function HeroSection() {
    const carousel = [HeroImg1, HeroImg2, HeroImg3];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    // Auto-slide logic
    useEffect(() => {
        if (!isPlaying) return;
        const interval = setInterval(() => {
            nextSlide();
        }, 3000);
        return () => clearInterval(interval);
    }, [currentIndex, isPlaying]);

    // Next slide
    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === carousel.length - 1 ? 0 : prevIndex + 1
        );
    };

    // Previous slide
    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? carousel.length - 1 : prevIndex - 1
        );
    };

    // Select slide manually
    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className="relative w-full min-h-[80%] overflow-hidden">
            {/* Image Carousel */}
            <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {carousel.map((image, index) => (
                    <img key={index} src={image} alt={`Slide ${index}`} className="w-full h-full object-cover" />
                ))}
            </div>

            {/* Left & Right Arrows */}
            <button onClick={prevSlide} className="hidden md:block absolute border border-white top-1/2 left-4 text-white text-3xl bg-black bg-opacity-50 p-2 rounded-full transform -translate-y-1/2">
                <IoIosArrowBack />
            </button>
            <button onClick={nextSlide} className="hidden md:block absolute border border-white top-1/2 right-4 text-white text-3xl bg-black bg-opacity-50 p-2 rounded-full transform -translate-y-1/2">
                <IoIosArrowForward />
            </button>

            {/* Play & Pause Button */}
            <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="hidden md:block absolute bottom-4 left-4 text-white border border-white text-xl bg-black bg-opacity-50 p-2 rounded-full"
            >
                {isPlaying ? <FaPause /> : <FaPlay />}
            </button>

            {/* Bullet Indicators */}
            <div className="hidden md:flex absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {carousel.map((_, index) => (
                    <div
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full cursor-pointer border border-white transition-all duration-300 ${currentIndex === index ? "bg-black" : "bg-gray-400"
                            }`}
                    ></div>
                ))}
            </div>
            <div className="w-full bg-gray-200 h-10 flex justify-center items-center md:hidden">
                <div className="w-auto flex gap-4 sm:gap-8 items-center">
                    <button onClick={prevSlide} className=" border border-white text-white text-xl bg-black bg-opacity-50 p-1 rounded-full">
                        <IoIosArrowBack />
                    </button>
                    <div className="flex gap-2">
                        {carousel.map((_, index) => (
                            <div
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-3 h-3 rounded-full cursor-pointer border border-white transition-all duration-300 ${currentIndex === index ? "bg-black" : "bg-gray-400"
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
        </div>
    );
}

export default HeroSection;
