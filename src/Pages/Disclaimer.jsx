import React from 'react';

function Disclaimer() {
  return (
    <div className="p-6 max-w-5xl mx-auto font-sans pt-10 flex flex-col gap-3 lg:gap-8">
      <h1 className="text-3xl xl:text-5xl text-gray-800 ">Disclaimer</h1>

      <p className="text-gray-700 text-lg lg:text-xl">
        SkyWall is a domestic brand specializing in consumer electronics products, particularly LED TVs. 
        The Chief Managing Director of SkyWall International is <strong>Mr. Narendra Bharadwaj</strong>, 
        an active member of INC for the past 30 years. He is also the founder of the <strong>Bharadwaj Group</strong>, 
        which encompasses various segments.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 lg:text-xl">The Bharadwaj Group is involved in diverse industries, including:</h2>

      <ol className="list-decimal list-inside text-gray-700 mt-4 space-y-2 lg:text-xl">
        <li><strong>Bharadwaj Transport:</strong> A transportation business providing logistics and delivery services.</li>
        <li><strong>Bharadwaj Construction:</strong> Engaged in construction projects, offering expertise in the field.</li>
        <li><strong>Bharadwaj Gallery:</strong> A gallery showcasing art and cultural exhibitions.</li>
        <li>
          <strong>Bharadwaj Group in Petroleum:</strong> Involved in the petroleum industry with 
          <strong> 11 owned pumps</strong>, <strong>4 COCO (Company Owned, Company Operated) pumps</strong>, and 
          <strong> 2 in the pipeline</strong>.
        </li>
      </ol>

      <p className="text-gray-700 mt-4 lg:text-xl">
        The co-founders of the Bharadwaj Group, <strong>Sachin Bharadwaj</strong> and <strong>Manish Bharadwaj</strong>, 
        are renowned business magnets. Together with the SkyWall team, they are responsible for the overall 
        growth and success of the company.
      </p>

      <p className="text-gray-700 mt-2 lg:text-xl">
        By maintaining an ecstatic team, they strive to achieve their goals efficiently. Impressively, they achieved 
        a milestone of <strong>1000 million</strong> within just one year, reflecting their rapid progress and achievements.
      </p>
    </div>
  );
}

export default Disclaimer;
