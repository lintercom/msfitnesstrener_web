
import React, { useState } from 'react';
import { useData } from '../context/DataProvider';
import { PageHero, BlueprintGrid } from '../components/PageDecorations';
import BlogModal from '../components/BlogModal';
import SEO from '../components/SEO';

const BlogCard: React.FC<{
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageUrl: string;
  readTime: string;
  onClick: () => void;
}> = ({ title, excerpt, date, category, imageUrl, readTime, onClick }) => (
  <div
    onClick={onClick}
    className="group bg-surface-light rounded-[2.5rem] lg:rounded-[3.5rem] overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-700 flex flex-col md:flex-row h-full cursor-pointer"
  >
    {/* Image Section - Reduced to 35% Width on Desktop */}
    <div className="relative w-full md:w-[35%] aspect-[16/10] md:aspect-auto overflow-hidden bg-black">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
      />
    </div>

    {/* Content Section - Expanded to 65% Width on Desktop */}
    <div className="w-full md:w-[65%] p-10 lg:p-16 flex flex-col justify-center relative bg-surface-light">
      <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-surface-dark/65 mb-6">
        <span>{date}</span>
        <span className="w-1.5 h-1.5 rounded-full neon-gradient"></span>
        <span>{readTime} čtení</span>
      </div>

      <h3 className="text-3xl lg:text-5xl font-black text-surface-dark uppercase tracking-tighter mb-6 leading-[0.9] group-hover:ms-gradient-text transition-all duration-500">
        {title}
      </h3>

      <p className="text-surface-dark/75 font-medium text-base lg:text-xl leading-relaxed mb-10 max-w-2xl">
        {excerpt}
      </p>

      <div className="mt-auto pt-8 border-t border-surface-dark/5 flex items-center gap-4 md:gap-6 group/action">
        <div
          className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-surface-dark text-white flex items-center justify-center border border-surface-dark/10 transition-all duration-500 shadow-lg transform group-hover/action:rotate-6 group-hover/action:neon-gradient group-hover/action:shadow-neon-glow group-hover/action:border-transparent"
        >
          <svg className="w-5 h-5 transition-transform duration-500 group-hover/action:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7-7 7" />
          </svg>
        </div>
        <span className="text-xs md:text-sm font-black uppercase tracking-[0.3em] ms-gradient-text transition-all duration-500 group-hover/action:tracking-[0.4em]">
          CELÝ ČLÁNEK
        </span>
      </div>
    </div>
  </div>
);

const BlogPage: React.FC = () => {
  const { data } = useData();
  const [selectedPostIndex, setSelectedPostIndex] = useState<number | null>(null);

  return (
    <div className="bg-background min-h-screen">
      <SEO
        title={data.seo.blog.title}
        description={data.seo.blog.description}
        keywords={data.seo.blog.keywords}
      />
      <PageHero
        titlePart1={data.pageHeroes.blog.titlePart1}
        titlePart2Accent={data.pageHeroes.blog.titlePart2Accent}
        description=""
        subTitle={data.pageHeroes.blog.description}
      />

      <div className="pt-20 pb-20 md:pt-32 md:pb-32 bg-surface relative overflow-hidden">
        <BlueprintGrid className="opacity-[0.03] grayscale invert" />

        <div className="w-full px-4 md:px-8 lg:px-12 relative z-10">
          <div className="flex flex-col gap-16 md:gap-24 lg:gap-32 w-full max-w-[1440px] mx-auto">
            {data.blog.map((post, index) => (
              <BlogCard
                key={post.id}
                {...post}
                onClick={() => setSelectedPostIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {selectedPostIndex !== null && (
        <BlogModal
          post={data.blog[selectedPostIndex]}
          posts={data.blog}
          currentIndex={selectedPostIndex}
          onClose={() => setSelectedPostIndex(null)}
          onNavigate={setSelectedPostIndex}
        />
      )}
    </div>
  );
};

export default BlogPage;
