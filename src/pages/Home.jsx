import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const API_KEY = '60a951c546a345c7929cbbe9762cb047'; 
const API_URL = `https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=${API_KEY}`;

const ARTICLES_PER_PAGE = 6; 

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}. ${errorText}`);
        }
        const data = await response.json();
        console.log('API Response:', data);

        if (data.status === 'ok' && data.articles) {
          const totalArticles = data.articles.length;
          setTotalPages(Math.ceil(totalArticles / ARTICLES_PER_PAGE));
          setArticles(data.articles);
        } else {
          setError('No articles found.');
        }
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const currentArticles = articles.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE
  );

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div>
      <section className="relative bg-blue-600 text-white py-12">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://source.unsplash.com/1600x900/?news)' }} />
        <div className="relative container mx-auto px-4 py-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl font-bold mb-4"
          >
            Latest News
          </motion.h1>
          <p className="text-lg mb-8">
            Stay updated with the latest headlines from around the world.
          </p>
        </div>
      </section>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {currentArticles.length === 0 && <p className="text-center">No articles available.</p>}
        {currentArticles.map(article => (
          <motion.div
            key={article.url}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {article.urlToImage && (
              <img 
                src={article.urlToImage} 
                alt={article.title || 'No title'} 
                className="w-full h-48 object-cover" 
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{article.title || 'No title'}</h2>
              <p className="text-gray-700 mb-4">{article.description?.substring(0, 100) || 'No description'}...</p>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-primary hover:underline cursor-pointer"
              >
                <Link to={`/article/${encodeURIComponent(article.url)}`} className="inline-block">
                  Read more
                </Link>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-blue-500 text-white rounded-l"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-gray-200 text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          className="px-4 py-2 bg-blue-500 text-white rounded-r"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
