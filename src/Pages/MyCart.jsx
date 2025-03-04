import React from 'react'
import TelevisionCard from "../assets/productCard.jpg";
import TelevisionCardHover from "../assets/productCardHover.jpg";
import { Link } from 'react-router-dom';

function MyCart() {
    const televisions = [
        {
            name: "SkyWall 65-inch 4K Ultra HD Smart TV",
            img: TelevisionCard,
            imgHover: TelevisionCardHover,
            company: "SkyWall",
            realPrice: 49999,
            discountedPrice: 38900,
            inStock: true,
        },
        {
            name: "SkyWall 80 cm (32 inches) Full HD Smart Android LED TV 32SWRR Pro (Frameless Edition) (Dolby Audio)",
            img: TelevisionCard,
            imgHover: TelevisionCardHover,
            company: "SkyWall",
            realPrice: 19125,
            discountedPrice: 7999,
            inStock: true,
        },
        {
            name: "SkyWall 60.96 cm (24 inch) HD Ready LED TV 24SWATV With A+ Grade Panel (slim bezels)",
            img: TelevisionCard,
            imgHover: TelevisionCardHover,
            company: "SkyWall",
            realPrice: 12999,
            discountedPrice: 5299,
            inStock: false,
        },
        {
            name: "SkyWall 80 cm (32 inches) Full HD Smart LED TV 32SW-Voice (Frameless Edition) | With Voice Assistant",
            img: TelevisionCard,
            imgHover: TelevisionCardHover,
            company: "SkyWall",
            realPrice: 21250,
            discountedPrice: 8499,
            inStock: true,
        },
    ];
    return (
        <div className='w-full h-auto flex  flex-col '>

            <div className='lg:w-[70%] w-full  px-4  md:px-0 pt-8 min-h-screen mx-auto pb-10 md:pb-20'>
                <div className='flex flex-col items-center justify-center text-center '>
                    <h1 className="w-full px-5 py-10 flex justify-center items-center  text-2xl md:text-4xl  h-52"> Your cart is empty</h1>
                    <Link to="/televisions" className='bg-black text-white px-12 py-4 text-lg md:hover:bg-slate-900 duration-300 ease-in-out transition-all'>Continue Shopping</Link>
                    <span className='text-2xl md:pt-16  py-2'>Have an account?</span>
                    <p>  <Link to="/Signin" className='text-xl underline'>Log  in</Link><span className='text-xl text-gray-500'> to check out faster</span></p>
                </div>
                <h1 className='text-2xl md:text-3xl  py-12 text-gray-800 '>Featured collection</h1>


                <div className="w-full h-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 cursor-pointer ">
                    {televisions.map((television, index) => (
                        <div
                            key={index}
                            className="group w-full p-4 rounded-lg bg-white relative duration-300 ease-in-out transition-all overflow-hidden"
                        >
                            {/* Sale Badge */}
                            <span className="absolute z-20 top-2 left-2 bg-blue-600 text-white text-sm px-6 py-1 rounded-full">
                                Sale
                            </span>

                            {/* TV Images (With Fade Transition) */}
                            <div className="relative w-full h-60 rounded-md overflow-hidden">
                                <img
                                    src={television.img}
                                    alt="image"
                                    className="absolute inset-0 w-full h-full object-contain rounded-md transition-opacity duration-500 ease-in-out opacity-100 group-hover:opacity-0"
                                />
                                <img
                                    src={television.imgHover}
                                    alt="hover image"
                                    className="absolute inset-0 w-full h-full object-contain rounded-md transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100"
                                />
                            </div>

                            {/* TV Name */}
                            <h3 className="text-gray-800 font-semibold mt-3 transition-all duration-300 ease-in-out group-hover:underline group-hover:underline-offset-4">
                                {television.name}
                            </h3>

                            {/* TV Brand */}
                            <p className="text-gray-500 text-sm uppercase mt-1">
                                {television.company}™ TV
                            </p>

                            {/* Price Section */}
                            <div className="mt-2">
                                <span className="text-gray-400 line-through text-sm">
                                    Rs. {television.realPrice.toLocaleString()}
                                </span>
                                <span className="text-black text-lg ml-2">
                                    Rs. {television.discountedPrice.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    ))}

                </div>
                <div className='flex flex-col items-center justify-center text-center  mt-14 '>
                    <Link to="/televisions" className='bg-black text-white md:px-10 px-4 py-4 text-lg md:hover:bg-slate-900 duration-300 ease-in-out transition-all'>View ALL</Link>
                </div>
            </div>
        </div>
    )
}

export default MyCart
