import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { portfolioCategories } from '@/data/portfolioData';

export default function PortfolioSection() {
  const fallbackCategory = { title: 'Portfolio', items: [], seeMoreLink: '#' };
  const [selectedImage, setSelectedImage] = useState<{ src: string; title: string } | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{ embed: string; title: string } | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>(portfolioCategories[0]?.title ?? '');

  const activeCategoryData = useMemo(() => {
    return portfolioCategories.find((cat) => cat.title === activeCategory) ?? portfolioCategories[0] ?? fallbackCategory;
  }, [activeCategory]);

  const categories = portfolioCategories.map((cat) => cat.title);

  const categoryStyles: Record<string, { accent: string; tab: string; activeTab: string }> = {
    Programming: {
      accent: 'text-[var(--foreground)]',
      tab: 'border-transparent text-[var(--text-muted)] hover:text-[var(--foreground)]',
      activeTab: 'border-[var(--foreground)] text-[var(--foreground)]',
    },
    Videography: {
      accent: 'text-[var(--premium-burgundy)]',
      tab: 'border-transparent text-[var(--text-muted)] hover:text-[var(--premium-burgundy)]',
      activeTab: 'border-[var(--premium-burgundy)] text-[var(--premium-burgundy)]',
    },
    Photography: {
      accent: 'text-[var(--mclaren-red)]',
      tab: 'border-transparent text-[var(--text-muted)] hover:text-[var(--mclaren-red)]',
      activeTab: 'border-[var(--mclaren-red)] text-[var(--mclaren-red)]',
    },
    'UI/UX Design': {
      accent: 'text-[var(--premium-burgundy)]',
      tab: 'border-transparent text-[var(--text-muted)] hover:text-[var(--premium-burgundy)]',
      activeTab: 'border-[var(--premium-burgundy)] text-[var(--premium-burgundy)]',
    },
  };

  const activeStyle = categoryStyles[activeCategory] ?? {
    accent: 'text-[var(--foreground)]',
    tab: 'border-transparent text-[var(--text-muted)] hover:text-[var(--foreground)]',
    activeTab: 'border-[var(--foreground)] text-[var(--foreground)]',
  };

  const categoryNotes: Record<string, string> = {
    Programming: 'Product builds, web apps, and machine learning experiments.',
    Videography: 'Direction, edit, and motion work for stories and events.',
    Photography: 'Stills focused on movement, framing, and atmosphere.',
    'UI/UX Design': 'Interface concepts with strong hierarchy and usability.',
  };

  return (
    <section id="portfolio" className="py-24 md:py-40 px-6 md:px-20 lg:px-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12">
          <motion.h2 
            className="text-6xl sm:text-8xl md:text-[9rem] lg:text-[10rem] font-semibold text-[var(--foreground)] leading-none tracking-[-0.06em]"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            WORK
          </motion.h2>

          <div className="w-full lg:w-auto">
            <p className="text-sm md:text-base font-semibold text-[var(--text-muted)] mb-3 uppercase tracking-[0.2em]">
              Select Category
            </p>
            <div className="flex flex-wrap gap-x-4 md:gap-x-6 gap-y-2 border-b border-[var(--line)] pb-3">
              {categories.map((cat) => {
                const styles = categoryStyles[cat] ?? activeStyle;
                const isActive = activeCategory === cat;

                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`relative py-1 text-sm md:text-base font-semibold uppercase tracking-[0.12em] transition-all duration-250 border-b ${
                      isActive ? styles.activeTab : styles.tab
                    }`}
                    aria-pressed={isActive}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="portfolio-active-tab"
                        className="absolute left-0 right-0 -bottom-[2px] h-0.5 bg-[var(--mclaren-red)]"
                      />
                    )}
                    <span className="relative z-10">{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-[var(--line)] pb-5">
              <h3 className={`text-3xl md:text-5xl font-semibold tracking-[-0.03em] ${activeStyle.accent}`}>
                {activeCategoryData.title}
              </h3>
              <span className="text-base md:text-lg text-[var(--text-muted)] font-medium text-left md:text-right">
                {activeCategoryData.items.length} selected project{activeCategoryData.items.length > 1 ? 's' : ''}
              </span>
            </div>

            <p className="text-lg md:text-xl text-[var(--text-muted)] font-medium max-w-3xl leading-relaxed">
              {categoryNotes[activeCategoryData.title] ?? 'Selected projects from this category.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-5 md:gap-6">
              {activeCategoryData.items.map((item, idx) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.45, delay: idx * 0.04 }}
                  className={`group border border-[var(--line)] bg-transparent overflow-hidden cursor-pointer transition-colors duration-300 hover:bg-[var(--surface)]/35 ${
                    idx % 5 === 0 ? 'xl:col-span-4' : 'xl:col-span-2'
                  }`}
                  onClick={() => {
                    if (item.youtubeEmbed) {
                      setSelectedVideo({ embed: item.youtubeEmbed, title: item.title });
                    } else {
                      setSelectedImage({ src: item.image, title: item.title });
                    }
                  }}
                >
                  <div className={`relative overflow-hidden ${idx % 5 === 0 ? 'aspect-[21/9]' : 'aspect-video'}`}>
                    <motion.img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-black/6 group-hover:bg-black/2 transition-colors" />

                    <div className="absolute inset-x-0 bottom-0 h-px bg-[var(--line)]/70" />

                    <span className="absolute top-4 left-4 text-[11px] font-semibold tracking-[0.22em] text-white/90">
                      {String(idx + 1).padStart(2, '0')}
                    </span>

                    {item.youtubeEmbed && (
                      <div className="absolute top-4 right-4 w-10 h-10 border border-[var(--line)] bg-[var(--surface)]/92 flex items-center justify-center">
                        <svg className="w-4 h-4 text-[var(--foreground)] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="p-5 md:p-6 space-y-3 border-t border-[var(--line)]/75">
                    <span className={`text-[11px] font-semibold uppercase tracking-[0.24em] ${activeStyle.accent}`}>
                      {activeCategoryData.title}
                    </span>
                    <h4 className="text-2xl md:text-3xl font-semibold text-[var(--foreground)] leading-tight tracking-[-0.02em]">{item.title}</h4>
                    <p className="text-base text-[var(--text-muted)] font-medium leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => window.open(activeCategoryData.seeMoreLink, '_blank')}
                className="group inline-flex items-center gap-3 border border-[var(--line)] bg-[var(--surface)] px-5 py-3 text-sm md:text-base font-semibold tracking-[0.14em] uppercase text-[var(--foreground)] hover:border-[var(--mclaren-red)] transition-colors"
              >
                See more {activeCategoryData.title}
                <span className="text-[var(--mclaren-red)] group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Preview Modals */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative max-w-6xl w-full flex flex-col items-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
              <div className="mt-8 text-center">
                <h3 className="text-3xl md:text-5xl font-semibold text-white tracking-tight">
                  {selectedImage.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-[var(--mclaren-red)] font-semibold tracking-[0.22em] text-sm"
              >
                CLOSE [×]
              </button>
            </motion.div>
          </motion.div>
        )}

        {selectedVideo && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              className="relative max-w-6xl w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-video w-full rounded-lg overflow-hidden shadow-2xl bg-black">
                <iframe
                  src={selectedVideo.embed}
                  title={selectedVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="mt-8 text-center">
                <h3 className="text-3xl md:text-5xl font-semibold text-white tracking-tight">
                  {selectedVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-12 right-0 text-white hover:text-[var(--mclaren-red)] font-semibold tracking-[0.22em] text-sm"
              >
                CLOSE [×]
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
