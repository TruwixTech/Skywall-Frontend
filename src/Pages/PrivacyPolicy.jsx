import React from 'react'

function PrivacyPolicy() {
    return (
        <div className='w-full h-auto flex  flex-col '>
            <h1 className="w-full px-5 md:px-10 lg:px-20 xl:px-32 py-10 bg-gray-200  flex text-center text-lg sm:text-xl md:text-2xl lg:text-4xl">
                Privacy policy
            </h1>
            <div className='lg:w-[70%] w-full px-5 md:px-10  pt-8 min-h-screen mx-auto pb-10 md:pb-20'>
                <ol className='list-decimal px-2 flex flex-col gap-4 lg:gap-6'>
                    <li className='lg:text-xl text-gray-500'>
                        The one-year warranty provides a complete warranty for all new TV modules, governed by the terms and conditions mentioned below.
                    </li>
                    <li className='lg:text-xl text-gray-500'>
                        The extended warranty offer is valid across India.
                    </li>
                    <li className='lg:text-xl text-gray-500'>
                        The extended warranty applies to purchases of 24-inch, 32-inch, 40-inch, 43-inch, 50-inch, 55-inch, 65-inch, and above SKYWALL TVs from selected authorized dealers, distributors, or SKYWALL brand shops. It covers only the panel/module of the TV, subject to the following terms and conditions.
                    </li>
                    <li className='lg:text-xl text-gray-500'>
                        The panel/module of the LED TV will be repaired or replaced during the extended warranty period as per company policy. The company's decision shall be final. In case original spare parts are unavailable, the company may offer compensation based on the depreciated value of the product.
                    </li>
                    <li className='lg:text-xl text-gray-500'>
                        The extended warranty does not cover any parts other than the panel/module, including aesthetic/plastic components, power supply, adapter, main circuit board (PCB), remote control, cabinet, stand accessories, or cables (HDMI, AV, DVI, etc.). Issues like 3D image sticking or image retention in the panel/module are also not covered.
                    </li>
                    <li className='lg:text-xl text-gray-500'>
                        For units installed beyond the municipal and geographical limits of the company’s authorized service centers, the purchaser must bring the unit to the nearest authorized service center at their own cost and risk. Expenses for service personnel, conveyance, and other incidentals will be borne by the customer. Transportation and handling charges may vary by location. Customers are advised to verify charges beforehand. If the customer chooses to transport the unit themselves, it is at their own risk. The authorized service center will determine whether repairs should be done on-site or at the service center.
                    </li>
                    <li className='lg:text-xl text-gray-500'>
                        Module defects, such as dark pixels and bright pixels, will be considered defects strictly as per company policy. For LED displays, defects greater than five pixels apply.
                    </li>
                    <li className='lg:text-xl text-gray-500'>
                        Repairs or replacements will be carried out by an authorized SKYWALL service center. If the customer relocates during the warranty period, they should contact the helpline at 7850032007.
                    </li>
                    <li className='lg:text-xl text-gray-500'>
                        To claim the extended warranty, the customer must provide the original dealer invoice and a properly filled-out extended warranty card.
                    </li>
                    <li className='lg:text-xl text-gray-500'>
                        If any part of the unit is repaired or replaced, the warranty will continue only for the remaining unexpired period. If a full unit replacement is provided (at SKYWALL’s sole discretion), the replacement model will be the same or an equivalent model if the original has been discontinued. The replacement unit’s warranty will only be valid for the remaining period of the original warranty.
                    </li>
                    <li className='lg:text-xl text-gray-500'>
                        Only the original extended warranty card, properly filled out and stamped, is valid and acceptable.
                    </li>
                    <li className='lg:text-xl text-gray-500'>
                        Calls registered with the centralized helpline for cleaning due to dust accumulation will not be considered as warranty claims and will be chargeable to the customer.
                    </li>
                    <li className='lg:text-xl text-gray-500'>
                        If the product is found damaged due to customer misuse, unauthorized repairs, or tampering, the warranty will be void. The warranty does not cover damages due to natural calamities like earthquakes, cyclones, high voltage surges, floods, wear and tear, or any other factors specified in the original warranty card.
                    </li>
                </ol>

            </div>
        </div>
    )
}

export default PrivacyPolicy