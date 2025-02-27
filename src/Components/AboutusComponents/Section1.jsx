import React from 'react'
import Aboutimage from '../../assets/aboutimage.jpg'

function Section1() {
    return (
        <div className='w-full min-h-screen flex justify-center items-center'>

            <div className='lg:w-[80%] w-full px-5 md:px-10 min-h-screen'>
                <h1 className='md:text-5xl text-2xl md:py-10 py-4'>About US</h1>
                <img src={Aboutimage} className='md:py-6 py-2 w-full' />
                <div className=' md:py-6'>
                    <p className='md:text-[20px] text-[16px] text-gray-500 md:py-6 py-2'><strong className='text-[#4d4d4d]'>Shri. Narendra Bharadwaj,</strong> 63 years old, serves as the Chief Managing Director of SkyWall International and has been an active member of the INC for the past three decades. He is also the founder of the Bharadwaj Group. His entrepreneurial journey began in 1980 with the establishment of Bharadwaj Transport Company, which has successfully operated for 38 years and remains a thriving business based in Ghaziabad. In 1999, he ventured into the construction industry by founding Bharadwaj Construction, specializing in government contracts and offering comprehensive services from horticulture to electrification. The headquarters of Bharadwaj Construction are also located in Ghaziabad. Expanding further, in 2004, the Bharadwaj Group entered the petroleum sector, with ownership of 11 pumps, 4 COCO pumps, and 2 more in the pipeline. In 2006, Mr. Bharadwaj established Bharadwaj Gallery, a company with warehouses in several locations, including Patiala, Mumbai, Jaipur, and Patna. </p>
                    <p className='md:text-[20px] text-[16px] text-gray-500 md:py-6 py-2'> <strong className='text-[#4d4d4d]'>Mr. Sachin Bharadwaj, </strong> 35 years old, is a co-founder of SkyWall International. Known for his dedication and humble nature, he plays a crucial role in motivating and ensuring the contentment of the team. With a strong work ethic, he strives to achieve the company's goals and is actively involved in decision-making processes at SkyWall International.</p>
                    <p className='md:text-[20px] text-[16px] text-gray-500 md:py-6 py-2'> <strong className='text-[#4d4d4d]'>Mr. Manish Bharadwaj,  </strong> 28 years old, is also a co-founder and a business magnate. As the visionary behind the company, he formulates the overall corporate strategy and maintains an ecstatic team to drive goal attainment. His exceptional achievements include reaching a target of 1000 million in just one year, and he has set his sights on a milestone of 500 crores in 2022.</p>
                    <p className='md:text-[20px] text-[16px] text-gray-500 md:py-6 py-2'>The combined efforts of these individuals and their team have contributed to the remarkable success and growth of <strong className='text-[#4d4d4d]'>SkyWall International </strong>and the Bharadwaj Group.</p>
                </div>
            </div>
        </div>
    )
}

export default Section1