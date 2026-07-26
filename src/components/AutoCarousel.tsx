import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';

interface AutoCarouselProps {
  images: string[];
  titles?: string[];
  isArch: boolean;
  folderUrl?: string;
}

export const AutoCarousel: React.FC<AutoCarouselProps> = ({ images, titles, isArch, folderUrl }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedImg, setSelectedImg] = useState<{ url: string; title?: string } | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll logic
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        
        // If we reached the end of the cloned list, reset to start
        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll by roughly one item
          const scrollAmount = window.innerWidth < 768 ? 300 : 400;
          scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 300 : 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="space-y-3 relative group">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      {folderUrl && (
        <div className="flex justify-end">
          <a
            href={folderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono border rounded transition-all ${
              isArch 
                ? "border-black text-black hover:bg-black hover:text-white" 
                : "border-white/10 text-neon-cyan hover:bg-neon-cyan/10"
            }`}
          >
            <span>OPEN DRIVE FOLDER ({images.length} DRAWINGS)</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      <div 
        className="relative w-full overflow-hidden group/carousel"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Navigation Buttons */}
        <button 
          onClick={() => scroll('left')}
          className={`absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full border backdrop-blur-md transition-all opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100 shadow-lg ${
            isArch 
              ? "bg-white/90 border-gray-300 text-black hover:bg-white hover:scale-110" 
              : "bg-black/80 border-white/20 text-white hover:bg-black hover:text-neon-cyan hover:border-neon-cyan/50 hover:scale-110"
          }`}
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        <button 
          onClick={() => scroll('right')}
          className={`absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full border backdrop-blur-md transition-all opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100 shadow-lg ${
            isArch 
              ? "bg-white/90 border-gray-300 text-black hover:bg-white hover:scale-110" 
              : "bg-black/80 border-white/20 text-white hover:bg-black hover:text-neon-cyan hover:border-neon-cyan/50 hover:scale-110"
          }`}
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Fade edges */}
        <div className={`absolute left-0 top-0 bottom-0 w-8 md:w-16 z-10 bg-gradient-to-r pointer-events-none ${isArch ? "from-white to-transparent" : "from-[#0a0a0c] to-transparent"}`} />
        <div className={`absolute right-0 top-0 bottom-0 w-8 md:w-16 z-10 bg-gradient-to-l pointer-events-none ${isArch ? "from-white to-transparent" : "from-[#0a0a0c] to-transparent"}`} />
        
        <div
          ref={scrollRef}
          className="flex gap-4 w-full py-2 overflow-x-auto snap-x snap-mandatory hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {[...images, ...images].map((img, idx) => {
            const actualIdx = idx % images.length;
            const title = titles ? titles[actualIdx] : undefined;

            return (
              <div 
                key={idx} 
                onClick={() => setSelectedImg({ url: img, title })}
                className="w-72 md:w-96 shrink-0 snap-center cursor-pointer group/card relative"
              >
                <div className={`relative overflow-hidden rounded-lg border transition-all duration-300 group-hover/card:scale-[1.02] ${
                  isArch 
                    ? "border-gray-200 bg-gray-50 shadow-sm group-hover/card:border-black" 
                    : "border-white/10 bg-white/5 group-hover/card:border-neon-cyan/50 shadow-lg"
                }`}>
                  <img 
                    src={img} 
                    alt={title || `Drawing ${actualIdx + 1}`}
                    loading="lazy"
                    className="w-full h-52 md:h-64 object-contain bg-white/95 p-2 pointer-events-none"
                  />
                  
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="px-3 py-1.5 rounded bg-black/80 text-white text-xs font-mono flex items-center gap-1.5 border border-white/20">
                      <Maximize2 className="w-3.5 h-3.5 text-neon-cyan" />
                      EXPAND DRAWING
                    </span>
                  </div>
                </div>
                {title && (
                  <p className={`text-[11px] font-mono truncate mt-1.5 px-1 ${isArch ? "text-gray-700 font-medium" : "text-gray-300"}`}>
                    {title}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal for Expanded View */}
      {selectedImg && (
        <div 
          onClick={() => setSelectedImg(null)}
          className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="absolute top-4 right-4 text-white/70 font-mono text-xs px-3 py-1 border border-white/20 rounded bg-black/50">
            CLICK ANYWHERE TO CLOSE
          </div>
          {selectedImg.title && (
            <div className="text-white font-mono text-sm mb-3 px-4 py-1.5 bg-white/10 rounded border border-white/10 max-w-xl truncate">
              {selectedImg.title}
            </div>
          )}
          <img 
            src={selectedImg.url} 
            alt={selectedImg.title || "Expanded Drawing"} 
            className="max-w-full max-h-[80vh] object-contain rounded border border-white/20 bg-white"
          />
        </div>
      )}
    </div>
  );
};
