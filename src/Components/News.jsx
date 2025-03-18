import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import NewsImg from '../assets/newsImg.webp'

function News() {
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, you would fetch this from an API
    // For now, we'll use hardcoded data based on the SkyWall TV blog
    const articles = [
      {
        id: 1,
        title:
          "SkyWall Showcases Cutting-Edge TV Technology at Consumer Electronics Expo 2024",
        excerpt:
          "SkyWall's latest innovations in Smart TV technology draw crowds at this year's Consumer Electronics Expo with AI-enhanced viewing experiences and groundbreaking display technology.",
        content:
          "SkyWall made waves at the Consumer Electronics Expo 2024 with their showcase of next-generation television technology. Attendees were treated to demonstrations of SkyWall's newest smart TV models featuring AI-enhanced picture quality, advanced voice control, and seamless integration with smart home ecosystems. The highlight of the event was the unveiling of SkyWall's proprietary Crystal Clear Display technology, offering unprecedented color accuracy and contrast ratios that rivals much more expensive competitors. Industry analysts praised SkyWall's commitment to bringing premium features to mid-range price points, potentially disrupting the established market leaders.",
        image:
          NewsImg,
        date: "August 10, 2024",
        readTime: "4 min read",
        category: "Events",
      },
      {
        id: 2,
        title:
          "SkyWall Partners with Leading Streaming Platforms for Enhanced Content Integration",
        excerpt:
          "New partnership deals bring exclusive content and optimized streaming experiences to all SkyWall Smart TV models, expanding entertainment options for users.",
        content:
          "SkyWall announced today that it has secured partnership agreements with five major streaming platforms, bringing optimized apps and exclusive content directly to SkyWall Smart TV users. The partnerships include improved integration with the SkyWall operating system, allowing for faster load times, reduced buffering, and enhanced picture quality when streaming content. Several streaming partners will also offer exclusive promotions for SkyWall TV owners, including extended free trials and discounted subscription rates. This move strengthens SkyWall's position as a value-focused brand that doesn't compromise on entertainment options.",
        image:
          NewsImg,
        date: "August 3, 2024",
        readTime: "3 min read",
        category: "Partnerships",
      },
      {
        id: 3,
        title:
          "SkyWall Introduces New 2024 Television Lineup with Enhanced Features",
        excerpt:
          "The 2024 SkyWall TV collection brings advanced gaming features, improved smart home connectivity, and better energy efficiency across all price points.",
        content:
          "SkyWall has officially launched its 2024 television lineup, focusing on three key areas of improvement: gaming performance, smart home integration, and energy efficiency. The new models feature reduced input lag (as low as 9.8ms), variable refresh rate support, and auto low-latency mode, making them ideal for console and PC gamers. Smart home capabilities have been expanded with support for all major ecosystems including Google Home, Amazon Alexa, and Apple HomeKit. Perhaps most impressively, the entire lineup boasts significantly improved energy efficiency, with the company claiming up to 25% reduction in power consumption compared to previous models while maintaining brightness levels. The 2024 collection includes models ranging from 24-inch HD displays to 85-inch 4K flagships.",
        image:
          NewsImg,
        date: "July 28, 2024",
        readTime: "5 min read",
        category: "Product Launch",
      },
      {
        id: 4,
        title:
          "Customer Stories: How SkyWall TVs Enhanced Home Entertainment During Pandemic",
        excerpt:
          "Real customer testimonials highlight the role SkyWall televisions played in keeping families connected and entertained during challenging times.",
        content:
          "A new feature series on the SkyWall blog shares compelling stories from customers about how their SkyWall televisions became central to family life during the pandemic. From virtual family gatherings to homeschooling support through educational apps, these testimonials highlight the versatility of SkyWall Smart TVs beyond traditional entertainment. Several stories focus on the affordability of SkyWall models that allowed families to upgrade their home entertainment systems despite economic uncertainty. The company plans to continue the series with monthly installments featuring diverse customer experiences from different regions.",
        image:
          NewsImg,
        date: "July 21, 2024",
        readTime: "6 min read",
        category: "Customer Stories",
      },
      {
        id: 5,
        title:
          "SkyWall Expands Manufacturing Capabilities with New Sustainable Production Facility",
        excerpt:
          "New eco-friendly production plant increases capacity while reducing carbon footprint, supporting SkyWall's commitment to environmental responsibility.",
        content:
          "SkyWall has announced the opening of a new manufacturing facility designed with sustainability at its core. The state-of-the-art plant uses renewable energy sources for 60% of its power needs, features water recycling systems, and implements zero-waste packaging initiatives. The facility increases SkyWall's production capacity by approximately 40%, allowing the company to meet growing demand while maintaining competitive pricing. Company executives emphasized that the expansion represents their commitment to both business growth and environmental responsibility. The facility is expected to create over 300 jobs and will primarily serve markets in Asia and the Pacific region.",
        image:
          NewsImg,
        date: "July 15, 2024",
        readTime: "4 min read",
        category: "Company News",
      },
      {
        id: 6,
        title:
          "SkyWall Releases Free Educational Content Package for Smart TV Users",
        excerpt:
          "New educational app bundle provides free access to learning resources for students of all ages, available on all SkyWall Smart TV models.",
        content:
          "SkyWall has launched a comprehensive educational content package available at no additional cost to all SkyWall Smart TV owners. The initiative includes partnerships with leading educational content providers to offer interactive learning experiences across subjects including mathematics, science, language arts, and social studies. Content is available for students from elementary through high school levels, with some college-preparatory material also included. The package can be downloaded through the SkyWall app store and includes parental controls for managing screen time and content accessibility. This initiative aligns with SkyWall's mission to provide value beyond entertainment and positions their televisions as multipurpose household devices.",
        image:
          NewsImg,
        date: "July 8, 2024",
        readTime: "3 min read",
        category: "Services",
      },
    ];

    setNewsArticles(articles);
    setLoading(false);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); 

  return (
    <>
      <div>
        <h1 className="w-full px-5 md:px-10 lg:px-20 xl:px-32 py-10 bg-gray-200 flex justify-center md:justify-start text-2xl md:text-4xl">
          Latest News & Updates
        </h1>
      </div>

      <div className="w-full h-auto flex flex-col px-5 md:px-10 lg:px-20 xl:px-32 py-10 gap-8 lg:gap-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsArticles.map((article) => (
            <Link
              to={`/news-media/${article.id}`}
              key={article.id}
              className="group flex flex-col bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-48">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col p-5 flex-grow">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-600 flex-grow mb-4">
                  {article.excerpt}
                </p>

                {/* Meta information */}
                <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                {/* Read more */}
                <div className="mt-4 flex items-center text-blue-600 font-medium">
                  <span>Read more</span>
                  <ArrowRight
                    size={16}
                    className="ml-1 transition-transform group-hover:translate-x-1"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default News;
