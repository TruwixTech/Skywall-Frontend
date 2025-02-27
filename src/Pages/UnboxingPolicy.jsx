import React from 'react';

function UnboxingPolicy() {
    return (
        <>
            <h1 className="w-full px-5 md:px-10 lg:px-20 xl:px-32 py-10 bg-gray-200 items-center flex text-center text-lg sm:text-xl md:text-2xl lg:text-4xl">
                Unboxing Policy
            </h1>
            <div className="p-6 max-w-5xl mx-auto font-sans pt-10 flex flex-col gap-3 lg:gap-8">
                {/* <h1 className="text-3xl xl:text-5xl text-gray-800"></h1> */}
                <p className="text-gray-700 text-lg lg:text-xl">
                    If you need any information or assistance, please feel free to contact us via email or phone,
                    and we will be glad to help you.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 lg:text-xl">LED TV Unboxing Policy:</h2>

                <h3 className="text-xl font-semibold text-gray-700">Instructions:</h3>
                <p className="text-gray-700 lg:text-xl">
                    Kindly refrain from opening the box until the Brand Authorized service engineer arrives for
                    Demo & Installation.
                </p>
                <p className="text-gray-700 lg:text-xl">
                    The service engineer will install your new TV, either on a wall mount or on a table top as per your preference. The authorized service engineer will provide a detailed demonstration that includes: Physical verification of the product & all its parts, including the power supply and USB ports, and other accessories mentioned in the Model specification. Live Demo showcasing all the features and settings.
                </p>

                <h3 className="text-xl font-semibold text-red-600">Warning:</h3>
                <p className="text-red-600 font-medium">
                    SkyWall will not be responsible for any damage or faults that may occur if the product is
                    opened or installed by any unauthorized person.
                </p>
            </div>
        </>
    );
}

export default UnboxingPolicy;
