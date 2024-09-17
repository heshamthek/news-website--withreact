import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

const API_KEY = '60a951c546a345c7929cbbe9762cb047';
const API_URL = `https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=${API_KEY}`;

const Article = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('API response:', data);

        const foundArticle = data.articles.find(article => article.url === decodeURIComponent(id));
        
        if (foundArticle) {
          setArticle(foundArticle);
        } else {
          setError('Article not found');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Failed to fetch articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [id]);

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600 font-semibold">{error}</p>;

  return (
    <div>
      <section className="relative bg-gray-900 text-white py-16">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${article.urlToImage || 'https://source.unsplash.com/1600x900/?news'})` }} />
        <div className="relative container mx-auto px-6 py-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl font-extrabold mb-6"
          >
            {article.title}
          </motion.h1>
          <p className="text-lg font-light">{new Date(article.publishedAt).toLocaleDateString()}</p>
        </div>
      </section>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-6 max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-lg shadow-lg p-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-blue-500 hover:underline mb-6"
          >
            <ChevronLeftIcon className="w-5 h-5 mr-2" />
            Back to Home
          </button>

          <p className="text-gray-900 mb-6 leading-relaxed">{article.content || article.description || 'Content not available.'}</p>
          <motion.a
            href={article.url}
            className="text-blue-600 hover:underline inline-block font-semibold"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Read more
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
};

export default Article;
