import React from 'react'

function ShippingPolicy() {
    return (
        <div className='w-full h-auto flex  flex-col '>
            <h1 className="w-full px-5 md:px-10 lg:px-20 xl:px-32 py-10 bg-gray-200  flex text-center text-lg sm:text-xl md:text-2xl lg:text-4xl">
                Shipping policy
            </h1>
            <div className='lg:w-[70%] w-full px-5 md:px-10  pt-2 h-auto mx-auto py-20'>
                <p className='md:text-[20px] text-[16px]  text-gray-500 md:py-4 py-2'>For <strong>Domestic Buyers,</strong> orders are shipped through registered domestic  <strong> courier Partners</strong> and/or speed post only. For International buyers, orders are shipped and delivered through registered international courier Partners or International speed post only.</p>
                <p className='md:text-[20px] text-[16px]  text-gray-500 md:py-4 py-2'>Orders are Dispatched within <strong>48-72 business working hours</strong> and delivered as per the delivery date agreed at the time of order confirmation and delivering of the shipment subject to Courier Company/post office norms.</p>
                <p className='md:text-[20px] text-[16px]  text-gray-500 md:py-4 py-2'>SkyWall is not liable for any delay in delivery by the Courier Partners/postal authorities and only guarantees to hand over the consignment to the Courier Company or postal authorities within 48-72 business working hours from the date of the order.</p>
                <p className='md:text-[20px] text-[16px]  text-gray-500 md:py-4 py-2'>Delivery of all orders will be delivered to registered address of the buyer as per the details filled at the time of purchasing on Our Website (Kindly, specified at the Correct Address at time of Order).
                </p>
                <p className='md:text-[20px] text-[16px]  text-gray-500 md:py-4 py-2'>SkyWall is in no way responsible for any damage/fault if product was opened or installed through any unauthorized person.</p>
                <p className='md:text-[20px] text-[16px]  text-gray-500 md:py-4 py-2'>Payments – SkyWall is proud to use Razor pay, CC Avenue Payment Gateway for fast, easy and efficient secure payments. All major Debit & Credit Cards are accepted.</p>

            </div>
        </div>
    )
}

export default ShippingPolicy
