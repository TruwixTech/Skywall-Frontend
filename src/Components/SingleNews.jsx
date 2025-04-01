import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  ArrowLeft,
} from "lucide-react";
import axios from "axios";
import { convertUTCtoIST2 } from "../utils/TimeConverter";
import LoadingSpinner from "../utils/LoadingSpinner";
import { ChevronLeft, ChevronRight } from "lucide-react";

const backend = import.meta.env.VITE_BACKEND;

function SingleNews() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % article.image.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? article.image.length - 1 : prev - 1
    );
  };

  const fetchSingleNews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backend}/news/${id}`);

      if (response.data.status === "Success") {
        setArticle(response.data.data.news);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${backend}/news/list`, {
        pageNum: 1,
        pageSize: 10,
        filters: {}
      });

      if (response.data.status === "Success") {
        const exludeCurrentNews = response.data.data.newsList.filter((news) => news._id !== id);
        setRelatedArticles(exludeCurrentNews);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  function timeSince(dateTimeString) {
    const givenDate = new Date(dateTimeString);

    if (isNaN(givenDate.getTime())) {
      return "Invalid Date";
    }

    const now = new Date();
    const secondsDiff = Math.floor((now - givenDate) / 1000);

    if (secondsDiff < 0) return "In the future";

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
    window.scrollTo(0, 0);
    fetchSingleNews()
    fetchNews()
  }, [id]);

  const ImageCarousel = () => (
    <div className="relative w-full h-96 md:h-[500px] overflow-hidden">
      {/* Navigation arrows */}
      {article?.image?.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 p-2 rounded-full hover:bg-black/50 transition-colors z-10"
          >
            <ChevronLeft className="text-white" size={32} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 p-2 rounded-full hover:bg-black/50 transition-colors z-10"
          >
            <ChevronRight className="text-white" size={32} />
          </button>
        </>
      )}

      {/* Image container with transition */}
      <div className="relative h-full w-full flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
        {article?.image.map((img, index) => (
          <div key={index} className="w-full h-full flex-shrink-0">
            <img
              src={img}
              alt={`${article?.title} - ${index + 1}`}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>

      {/* Image index indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {article?.image.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
          />
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 md:p-10">
        <h1 className="text-white text-2xl md:text-4xl font-bold max-w-4xl mb-4">
          {article?.title}
        </h1>
        <div className="flex flex-wrap items-center text-white text-sm gap-x-6 gap-y-2">
          <div className="flex items-center">
            <Calendar size={16} className="mr-2" />
            {convertUTCtoIST2(article?.created_at)}
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-2" />
            {timeSince(article?.created_at)}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-gray-50">
      {
        loading && <LoadingSpinner />
      }
      {/* Header with image */}
     <ImageCarousel />

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
            {article?.subtitle}
          </p>

          {/* Main content */}
          <div className="prose max-w-none">
            <p className="mb-4 text-gray-700" style={{
              whiteSpace: 'pre-line'
            }}>
              {article?.description}
            </p>
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
                to={`/news-media/${relatedArticle._id}`}
                key={relatedArticle._id}
                className="group flex flex-col bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-40">
                  <img
                    src={relatedArticle?.image[0]}
                    alt={relatedArticle?.title}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 transition-colors line-clamp-2">
                    {relatedArticle?.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{convertUTCtoIST2(relatedArticle?.created_at)}</span>
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
