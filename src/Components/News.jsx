import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import NewsImg from '../assets/newsImg.webp'
import axios from "axios";
import LoadingSpinner from "../utils/LoadingSpinner";
import { convertUTCtoIST2 } from "../utils/TimeConverter";

const backend = import.meta.env.VITE_BACKEND;

function News() {
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem('token'));
      const response = await axios.post(`${backend}/news/list`, {
        pageNum: 1,
        pageSize: 20,
        filters: {}
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.status === "Success") {
        setNewsArticles(response.data.data.newsList);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  function timeSince(dateTimeString) {
    const givenDate = new Date(dateTimeString); // Directly parse the ISO date string

    if (isNaN(givenDate.getTime())) {
      return "Invalid Date";
    }

    const now = new Date();
    const secondsDiff = Math.floor((now - givenDate) / 1000);

    if (secondsDiff < 0) return "In the future"; // Handle future dates

    const minutes = Math.floor(secondsDiff / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} ${years === 1 ? "year" : "years"} ago`;
    if (months > 0) return `${months} ${months === 1 ? "month" : "months"} ago`;
    if (days > 0) return `${days} ${days === 1 ? "day" : "days"} ago`;
    if (hours > 0) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    if (minutes > 0) return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    return `${secondsDiff} ${secondsDiff === 1 ? "second" : "seconds"} ago`;
  }

  useEffect(() => {
    fetchNews();
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

      {
        loading && <LoadingSpinner />
      }

      <div className="w-full h-auto flex flex-col px-5 md:px-10 lg:px-20 xl:px-32 py-10 gap-8 lg:gap-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsArticles.map((article) => (
            <Link
              to={`/news-media/${article._id}`}
              key={article._id}
              className="group flex flex-col bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-48">
                <img
                  src={article?.image[0]}
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
                  {article.subtitle}
                </p>

                {/* Meta information */}
                <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>{convertUTCtoIST2(article.created_at)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{timeSince(article.created_at)}</span>
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
