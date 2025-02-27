import React from 'react'
import TelevisionCard from '../../assets/productCard.jpg'
import TelevisionCardHover from '../../assets/productCardHover.jpg'

function TelevisionCollections() {
    const televisions = [
        {
            name: "SkyWall 165 cm (65 inches) 4K Ultra HD Smart Android LED TV 65SW4K-Voice | Built-in Google Assistant",
            img: TelevisionCard,
            imgHover: TelevisionCardHover,
            company: "SkyWall",
            realPrice: 49999,
            discountedPrice: 38900
        },
        {
            name: "SkyWall 165 cm (65 inches) 4K Ultra HD Smart Android LED TV 65SW4K-Voice | Built-in Google Assistant",
            img: TelevisionCard,
            imgHover: TelevisionCardHover,
            company: "Samsung",
            realPrice: 52999,
            discountedPrice: 44999
        },
        {
            name: "SkyWall 165 cm (65 inches) 4K Ultra HD Smart Android LED TV 65SW4K-Voice | Built-in Google Assistant",
            img: TelevisionCard,
            imgHover: TelevisionCardHover,
            company: "LG",
            realPrice: 159999,
            discountedPrice: 139999
        },
        {
            name: "SkyWall 165 cm (65 inches) 4K Ultra HD Smart Android LED TV 65SW4K-Voice | Built-in Google Assistant",
            img: TelevisionCard,
            imgHover: TelevisionCardHover,
            company: "Sony",
            realPrice: 124999,
            discountedPrice: 104999
        },
        {
            name: "SkyWall 165 cm (65 inches) 4K Ultra HD Smart Android LED TV 65SW4K-Voice | Built-in Google Assistant",
            img: TelevisionCard,
            imgHover: TelevisionCardHover,
            company: "TCL",
            realPrice: 59999,
            discountedPrice: 52999
        },
        {
            name: "SkyWall 165 cm (65 inches) 4K Ultra HD Smart Android LED TV 65SW4K-Voice | Built-in Google Assistant",
            img: TelevisionCard,
            imgHover: TelevisionCardHover,
            company: "Hisense",
            realPrice: 47999,
            discountedPrice: 41999
        },
        {
            name: "SkyWall 165 cm (65 inches) 4K Ultra HD Smart Android LED TV 65SW4K-Voice | Built-in Google Assistant",
            img: TelevisionCard,
            imgHover: TelevisionCardHover,
            company: "OnePlus",
            realPrice: 46999,
            discountedPrice: 39999
        },
        {
            name: "SkyWall 165 cm (65 inches) 4K Ultra HD Smart Android LED TV 65SW4K-Voice | Built-in Google Assistant",
            img: TelevisionCard,
            imgHover: TelevisionCardHover,
            company: "Vu",
            realPrice: 45999,
            discountedPrice: 38999
        },
        {
            name: "SkyWall 165 cm (65 inches) 4K Ultra HD Smart Android LED TV 65SW4K-Voice | Built-in Google Assistant",
            img: TelevisionCard,
            imgHover: TelevisionCardHover,
            company: "Redmi",
            realPrice: 42999,
            discountedPrice: 37999
        },
        {
            name: "SkyWall 165 cm (65 inches) 4K Ultra HD Smart Android LED TV 65SW4K-Voice | Built-in Google Assistant",
            img: TelevisionCard,
            imgHover: TelevisionCardHover,
            company: "Mi",
            realPrice: 159999,
            discountedPrice: 129999
        }
    ];

    return (
        <div className='w-full h-auto flex flex-col px-5 md:px-10 lg:px-20 xl:px-32 py-10 gap-8 lg:gap-12'>
            <h1 className='font-semibold text-center text-lg sm:text-xl md:text-2xl lg:text-3xl'>Televisions Collections</h1>
            <div className='w-full h-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 cursor-pointer place-items-center'>
                {
                    televisions.map((television, index) => (
                        <div
                            key={index}
                            className="group w-64 p-4 rounded-lg bg-white relative duration-300 ease-in-out transition-all overflow-hidden"
                        >
                            {/* Sale Badge */}
                            <span className="absolute z-10 top-2 left-2 bg-blue-600 text-white text-sm px-6 py-1 rounded-full">
                                Sale
                            </span>

                            {/* TV Images (With Fade Transition) */}
                            <div className="relative w-full h-60 rounded-md overflow-hidden">
                                <img
                                    src={television.img}
                                    alt="image"
                                    className="absolute inset-0 w-full h-full object-cover rounded-md transition-opacity duration-500 ease-in-out opacity-100 group-hover:opacity-0"
                                />
                                <img
                                    src={television.imgHover}
                                    alt="hover image"
                                    className="absolute inset-0 w-full h-full object-cover rounded-md transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100"
                                />
                            </div>

                            {/* TV Name */}
                            <h3 className="text-gray-800 font-semibold mt-3 transition-all duration-300 ease-in-out group-hover:underline group-hover:underline-offset-4">
                                {television.name}
                            </h3>

                            {/* TV Brand */}
                            <p className="text-gray-500 text-sm uppercase mt-1">{television.company}™ TV</p>

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

                    ))
                }
            </div>
        </div>
    )
}

export default TelevisionCollections