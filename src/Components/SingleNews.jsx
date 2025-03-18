import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Facebook,
  Twitter,
} from "lucide-react";
import NewsImg from '../assets/newsImg.webp'


function SingleNews() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  useEffect(() => {
    // In a real application, you would fetch the specific article from an API
    // For now, we'll use hardcoded data based on the SkyWall TV blog
    const articles = [
      {
        id: 1,
        title:
          "SkyWall Showcases Cutting-Edge TV Technology at Consumer Electronics Expo 2024",
        excerpt:
          "SkyWall's latest innovations in Smart TV technology draw crowds at this year's Consumer Electronics Expo with AI-enhanced viewing experiences and groundbreaking display technology.",
        content:
          "SkyWall made waves at the Consumer Electronics Expo 2024 with their showcase of next-generation television technology. Attendees were treated to demonstrations of SkyWall's newest smart TV models featuring AI-enhanced picture quality, advanced voice control, and seamless integration with smart home ecosystems. The highlight of the event was the unveiling of SkyWall's proprietary Crystal Clear Display technology, offering unprecedented color accuracy and contrast ratios that rivals much more expensive competitors. Industry analysts praised SkyWall's commitment to bringing premium features to mid-range price points, potentially disrupting the established market leaders.\n\nThe company's booth was one of the most visited at the expo, with continuous demonstrations of the new features drawing large crowds throughout the four-day event. Particularly popular was the interactive zone where visitors could experience the new voice control system that recognizes commands in multiple languages and dialects with remarkable accuracy, even in noisy environments.\n\nSkyWall representatives also revealed plans for future software updates that will bring additional functionality to existing TV models, demonstrating the company's commitment to supporting their products well beyond the initial purchase. This approach to extending the useful life of their televisions through software improvements was highlighted as part of SkyWall's broader sustainability goals.",
        image:
          NewsImg,
        date: "August 10, 2024",
        readTime: "4 min read",
        category: "Events",
        author: "Tech Editorial Team",
      },
      {
        id: 2,
        title:
          "SkyWall Partners with Leading Streaming Platforms for Enhanced Content Integration",
        excerpt:
          "New partnership deals bring exclusive content and optimized streaming experiences to all SkyWall Smart TV models, expanding entertainment options for users.",
        content:
          "SkyWall announced today that it has secured partnership agreements with five major streaming platforms, bringing optimized apps and exclusive content directly to SkyWall Smart TV users. The partnerships include improved integration with the SkyWall operating system, allowing for faster load times, reduced buffering, and enhanced picture quality when streaming content. Several streaming partners will also offer exclusive promotions for SkyWall TV owners, including extended free trials and discounted subscription rates. This move strengthens SkyWall's position as a value-focused brand that doesn't compromise on entertainment options.\n\nThe new partnership agreements cover global streaming giants as well as regional content providers, ensuring that SkyWall users around the world will benefit from the enhanced integration. Technical improvements include dedicated processing resources for streaming applications, reduced latency when switching between apps, and intelligent content recommendations based on viewing habits across platforms.\n\nThe first wave of optimized streaming apps will begin rolling out to SkyWall Smart TVs via automatic updates starting next month, with the full suite expected to be available on all compatible models by the end of the quarter. Older models will also receive the updates where hardware specifications allow, reinforcing SkyWall's commitment to supporting their entire product ecosystem.",
        image:
          NewsImg,
        date: "August 3, 2024",
        readTime: "3 min read",
        category: "Partnerships",
        author: "Business Development Team",
      },
      {
        id: 3,
        title:
          "SkyWall Introduces New 2024 Television Lineup with Enhanced Features",
        excerpt:
          "The 2024 SkyWall TV collection brings advanced gaming features, improved smart home connectivity, and better energy efficiency across all price points.",
        content:
          "SkyWall has officially launched its 2024 television lineup, focusing on three key areas of improvement: gaming performance, smart home integration, and energy efficiency. The new models feature reduced input lag (as low as 9.8ms), variable refresh rate support, and auto low-latency mode, making them ideal for console and PC gamers. Smart home capabilities have been expanded with support for all major ecosystems including Google Home, Amazon Alexa, and Apple HomeKit. Perhaps most impressively, the entire lineup boasts significantly improved energy efficiency, with the company claiming up to 25% reduction in power consumption compared to previous models while maintaining brightness levels. The 2024 collection includes models ranging from 24-inch HD displays to 85-inch 4K flagships.\n\nThe gaming-oriented features represent a significant push into the growing gaming TV market segment, with the top models supporting 4K resolution at 120Hz refresh rate and including HDMI 2.1 ports. SkyWall has also introduced a new Game Mode Pro interface that provides real-time information about frame rates, input lag, and HDR status, along with customizable picture settings specifically for different game genres.\n\nOn the smart home front, the enhanced connectivity allows SkyWall TVs to serve as control hubs for compatible devices, with a redesigned dashboard for managing connected equipment. The Energy Star certified lineup includes new power management features that can adjust brightness based on ambient light conditions and viewing content type, maximizing both visual quality and efficiency.",
        image:
          NewsImg,
        date: "July 28, 2024",
        readTime: "5 min read",
        category: "Product Launch",
        author: "Product Management Team",
      },
      {
        id: 4,
        title:
          "Customer Stories: How SkyWall TVs Enhanced Home Entertainment During Pandemic",
        excerpt:
          "Real customer testimonials highlight the role SkyWall televisions played in keeping families connected and entertained during challenging times.",
        content:
          "A new feature series on the SkyWall blog shares compelling stories from customers about how their SkyWall televisions became central to family life during the pandemic. From virtual family gatherings to homeschooling support through educational apps, these testimonials highlight the versatility of SkyWall Smart TVs beyond traditional entertainment. Several stories focus on the affordability of SkyWall models that allowed families to upgrade their home entertainment systems despite economic uncertainty. The company plans to continue the series with monthly installments featuring diverse customer experiences from different regions.\n\nOne particularly moving story comes from the Martinez family in Florida, who used their SkyWall TV to maintain virtual Sunday dinners with extended family members across three states. The large screen and video conferencing app integration made these gatherings feel more immersive than typical smartphone or laptop calls, helping maintain important family traditions during isolation periods.\n\nAnother highlighted story features a teacher who used his SkyWall TV as a teaching tool during remote learning, utilizing the screen mirroring function to create a more engaging classroom experience from his living room. The ability to wirelessly connect his laptop while still having access to educational apps directly on the TV provided flexibility that smaller displays couldn't match.",
        image:
          NewsImg,
        date: "July 21, 2024",
        readTime: "6 min read",
        category: "Customer Stories",
        author: "Customer Relations Team",
      },
      {
        id: 5,
        title:
          "SkyWall Expands Manufacturing Capabilities with New Sustainable Production Facility",
        excerpt:
          "New eco-friendly production plant increases capacity while reducing carbon footprint, supporting SkyWall's commitment to environmental responsibility.",
        content:
          "SkyWall has announced the opening of a new manufacturing facility designed with sustainability at its core. The state-of-the-art plant uses renewable energy sources for 60% of its power needs, features water recycling systems, and implements zero-waste packaging initiatives. The facility increases SkyWall's production capacity by approximately 40%, allowing the company to meet growing demand while maintaining competitive pricing. Company executives emphasized that the expansion represents their commitment to both business growth and environmental responsibility. The facility is expected to create over 300 jobs and will primarily serve markets in Asia and the Pacific region.\n\nThe new plant incorporates several innovative sustainability features, including a solar array covering the entire roof surface, rainwater collection systems, and advanced waste management processes that ensure nearly 95% of production materials are either used in products or recycled. The building itself was constructed using low-carbon concrete and other environmentally friendly materials, reducing the carbon footprint of construction by an estimated 35% compared to conventional methods.\n\nIn addition to environmental benefits, the facility features improved working conditions with natural lighting throughout production areas, enhanced air filtration systems, and ergonomically designed workstations. These improvements are expected to boost productivity while reducing workplace injuries and employee turnover rates.",
        image:
          NewsImg,
        date: "July 15, 2024",
        readTime: "4 min read",
        category: "Company News",
        author: "Corporate Communications",
      },
      {
        id: 6,
        title:
          "SkyWall Releases Free Educational Content Package for Smart TV Users",
        excerpt:
          "New educational app bundle provides free access to learning resources for students of all ages, available on all SkyWall Smart TV models.",
        content:
          "SkyWall has launched a comprehensive educational content package available at no additional cost to all SkyWall Smart TV owners. The initiative includes partnerships with leading educational content providers to offer interactive learning experiences across subjects including mathematics, science, language arts, and social studies. Content is available for students from elementary through high school levels, with some college-preparatory material also included. The package can be downloaded through the SkyWall app store and includes parental controls for managing screen time and content accessibility. This initiative aligns with SkyWall's mission to provide value beyond entertainment and positions their televisions as multipurpose household devices.\n\nThe educational package includes both on-demand video lessons and interactive applications that encourage active learning through quizzes, problem-solving exercises, and virtual experiments. Content is regularly updated to reflect current educational standards and best practices, with seasonal updates planned to provide fresh material throughout the school year.\n\nEducators have responded positively to the initiative, with several school districts expressing interest in recommending SkyWall TVs for families looking to support at-home learning. The company is also exploring partnerships with educational institutions to develop custom content that could supplement classroom curriculum, potentially creating a bridge between home and school learning environments.",
        image:
          NewsImg,
        date: "July 8, 2024",
        readTime: "3 min read",
        category: "Services",
        author: "Product Development Team",
      },
    ];

    // Find the article with the matching ID
    const currentArticle = articles.find(
      (article) => article.id === parseInt(id)
    );
    setArticle(currentArticle);

    // Find related articles (different from current but same category or recent)
    const related = articles.filter((a) => a.id !== parseInt(id)).slice(0, 3); // Get up to 3 related articles

    setRelatedArticles(related);
    setLoading(false);
  }, [id]);

  if (!article) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Article Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The article you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/news"
          className="flex items-center text-blue-600 font-medium hover:underline"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to News
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50">
      {/* Header with image */}
      <div className="relative w-full h-96 md:h-[500px] overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-contain"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 md:p-10">
          <h1 className="text-white text-2xl md:text-4xl font-bold max-w-4xl mb-4">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center text-white text-sm gap-x-6 gap-y-2">
            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              {article.date}
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-2" />
              {article.readTime}
            </div>
            <div className="flex items-center">By {article.author}</div>
          </div>
        </div>
      </div>

      {/* Back to news link */}
      <div className="w-full max-w-4xl mx-auto px-4 pt-6">
        <Link
          to="/news-media"
          className="w-fit flex items-center text-blue-600 font-medium mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to News
        </Link>
      </div>

      {/* Article content */}
      <div className="w-full max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-10 mb-10">
          {/* Article excerpt as intro */}
          <p className="text-lg font-medium text-gray-700 mb-6 border-l-4 border-blue-600 pl-4">
            {article.excerpt}
          </p>

          {/* Main content */}
          <div className="prose max-w-none">
            {article.content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Social share */}
          <div className="mt-10 pt-6 border-t border-gray-200">
            <p className="font-medium text-gray-700 mb-2 flex items-center">
              <Share2 size={18} className="mr-2" />
              Share this article:
            </p>
            <div className="flex space-x-3">
              <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                <Facebook size={18} />
              </button>
              <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                <Twitter size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Related articles */}
        <div className="mt-8">
          <h2 className="text-2xl text-center md:text-start font-semibold text-gray-800 mb-6">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((relatedArticle) => (
              <Link
                to={`/news-media/${relatedArticle.id}`}
                key={relatedArticle.id}
                className="group flex flex-col bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-40">
                  <img
                    src={relatedArticle.image}
                    alt={relatedArticle.title}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 transition-colors line-clamp-2">
                    {relatedArticle.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{relatedArticle.date}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleNews;
