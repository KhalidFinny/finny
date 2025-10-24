'use client';

import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { portfolioCategories } from '@/data/portfolioData';

export default function PortfolioSection() {
  const ref = useRef(null);
  const [selectedImage, setSelectedImage] = useState<{ src: string; title: string } | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{ embed: string; title: string } | null>(null);


  return (
    <section id="portfolio" className="py-16 sm:py-24 px-4 sm:px-8" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          className="text-3xl sm:text-4xl md:text-5xl font-light text-center text-white mb-12 lg:mb-20 animate-fade-in-up"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Portfolio
        </motion.h2>
        
        {/* Swiss Design Grid */}
        <div className="space-y-20">
          {portfolioCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 + categoryIndex * 0.2 }}
            >
              {/* Category Title */}
              <div className="mb-12">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-light text-white mb-4 tracking-wide uppercase">
                  {category.title}
                </h3>
                <div className="w-16 h-0.5 bg-red-400"></div>
              </div>

              {/* Portfolio Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8">
                {category.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.id}
                    className="group cursor-pointer smooth-transition hover-lift animate-scale-in"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + categoryIndex * 0.2 + itemIndex * 0.1 }}
                    onClick={() => {
                      if (category.title === "Videography" && item.youtubeEmbed) {
                        setSelectedVideo({ embed: item.youtubeEmbed, title: item.title });
                      } else {
                        setSelectedImage({ src: item.image, title: item.title });
                      }
                    }}
                  >
                    {/* Portfolio Image */}
                    <div className="bg-gray-800/50 border border-gray-700/50 overflow-hidden group-hover:border-red-400/50 transition-colors duration-300 rounded-sm relative smooth-transition hover-glow">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={800}
                        height={600}
                        className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Play Button Overlay for Videography */}
                      {category.title === "Videography" && item.youtubeEmbed && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                          <div className="w-16 h-16 bg-red-400/90 rounded-full flex items-center justify-center group-hover:bg-red-400 transition-colors">
                            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Portfolio Title & Description */}
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm sm:text-base lg:text-lg font-light text-white tracking-wide uppercase">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm lg:text-base text-gray-400 font-light leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* See More Buttons */}
              <div className="text-center">
                {category.title === "Videography" ? (
                  <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
                    <motion.a
                      href="https://youtube.com/@workshoprisetinformatika"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-red-400 hover:text-red-300 font-light text-base md:text-lg uppercase tracking-widest transition-colors duration-300 border-b border-transparent hover:border-red-400 pb-1 smooth-transition animate-pulse-hover"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      YouTube
                    </motion.a>
                    <motion.a
                      href="https://instagram.com/ffiinn.yy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-red-400 hover:text-red-300 font-light text-base md:text-lg uppercase tracking-widest transition-colors duration-300 border-b border-transparent hover:border-red-400 pb-1 smooth-transition animate-pulse-hover"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Instagram
                    </motion.a>
                    <motion.a
                      href={category.seeMoreLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-red-400 hover:text-red-300 font-light text-base md:text-lg uppercase tracking-widest transition-colors duration-300 border-b border-transparent hover:border-red-400 pb-1 smooth-transition animate-pulse-hover"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Google Drive
                    </motion.a>
                  </div>
                ) : (
                  <motion.a
                    href={category.seeMoreLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-red-400 hover:text-red-300 font-light text-base md:text-lg uppercase tracking-widest transition-colors duration-300 border-b border-transparent hover:border-red-400 pb-1 smooth-transition animate-pulse-hover"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    See More
                  </motion.a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {selectedImage && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            className="relative max-w-4xl max-h-[90vh] mx-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-4 -right-4 z-10 w-8 h-8 bg-red-400 hover:bg-red-300 rounded-full flex items-center justify-center text-white font-bold transition-colors"
            >
              ×
            </button>
            
            {/* Modal Content */}
            <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden">
              <Image
                src={selectedImage.src}
                alt={selectedImage.title}
                width={1200}
                height={800}
                className="w-full h-auto"
              />
              <div className="p-6">
                <h3 className="text-xl md:text-2xl font-light text-white tracking-wide uppercase">
                  {selectedImage.title}
                </h3>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* YouTube Video Modal */}
      {selectedVideo && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedVideo(null)}
        >
          <motion.div
            className="relative max-w-4xl max-h-[90vh] mx-4 w-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-4 -right-4 z-10 w-8 h-8 bg-red-400 hover:bg-red-300 rounded-full flex items-center justify-center text-white font-bold transition-colors"
            >
              ×
            </button>
            
            {/* Video Content */}
            <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden">
              <div className="aspect-video w-full">
                <iframe
                  src={selectedVideo.embed}
                  title={selectedVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl md:text-2xl font-light text-white tracking-wide uppercase">
                  {selectedVideo.title}
                </h3>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}