// src/components/Gallery.jsx
import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

const Gallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef(null);
  const animationRef = useRef(null);
  const imageRefs = useRef([]);

  // Duplicate images for seamless infinite scroll
  const duplicatedImages = [...images, ...images, ...images];

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || isPaused) return;

    const scrollWidth = container.scrollWidth / 3; // Width of one set of images
    let scrollPosition = container.scrollLeft;

    const animate = () => {
      if (!isPaused && container) {
        scrollPosition += 1; // Scroll speed
        if (scrollPosition >= scrollWidth * 2) {
          scrollPosition = scrollWidth;
        }
        container.scrollLeft = scrollPosition;
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused]);

  // Handle mouse enter/pause
  const handleMouseEnter = (index) => {
    setIsPaused(true);
    
    // Highlight the hovered image
    gsap.to(imageRefs.current[index], {
      scale: 1.1,
      zIndex: 20,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      duration: 0.3,
      ease: 'power2.out'
    });

    // Slightly dim other images
    imageRefs.current.forEach((img, i) => {
      if (i !== index && img) {
        gsap.to(img, {
          opacity: 0.6,
          scale: 0.95,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });
  };

  // Handle mouse leave
  const handleMouseLeave = (index) => {
    setIsPaused(false);

    // Reset all images
    imageRefs.current.forEach((img) => {
      if (img) {
        gsap.to(img, {
          scale: 1,
          opacity: 1,
          zIndex: 1,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });
  };

  // Handle image click
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  // Close modal
  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="py-24 bg-linear-to-b from-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-orange-600 font-semibold text-sm tracking-wider uppercase mb-2 block">
            Our Campus
          </span>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            A Glimpse Into School Life
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hover to pause the infinite scroll and explore our facilities
          </p>
        </div>

        {/* Infinite Scroll Gallery */}
        <div className="relative">
          {/* Gradient overlays for smooth edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-orange-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-orange-50 to-transparent z-10 pointer-events-none"></div>

          {/* Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex gap-8 py-8 px-4">
              {duplicatedImages.map((image, index) => (
                <div
                  key={`${image.id}-${index}`}
                  ref={el => imageRefs.current[index] = el}
                  className="flex-none w-100 group cursor-pointer relative"
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                  onClick={() => handleImageClick(image)}
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-lg transform transition-all duration-300 h-80">
                    {/* Image Container - Fixed height with object-cover to fill */}
                    <div className="w-full h-full bg-gray-100">
                      <img
                        src={image.image}
                        alt={image.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Overlay with gradient */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-3xl">{image.icon}</span>
                          <h3 className="text-xl font-semibold">{image.title}</h3>
                        </div>
                        <p className="text-base text-white/80 mb-2">{image.description}</p>
                        <span className="inline-block px-4 py-1.5 bg-orange-500 rounded-full text-sm font-semibold">
                          {image.category}
                        </span>
                      </div>
                    </div>

                    {/* Category badge when not hovered */}
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-700 shadow-lg group-hover:opacity-0 transition-opacity">
                      {image.category}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <span className="inline-flex items-center space-x-2">
            <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
            <span>Scroll horizontally or hover to pause</span>
            <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </span>
        </div>
      </div>

      {/* Modal for full-size image */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-7xl w-full max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image and details */}
            <div className="flex flex-col md:flex-row h-full">
              <div className="md:w-2/3 h-96 md:h-auto relative">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent md:hidden"></div>
              </div>
              <div className="md:w-1/3 p-8 bg-white overflow-y-auto">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-5xl">{selectedImage.icon}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{selectedImage.title}</h3>
                    <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-semibold">
                      {selectedImage.category}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-lg mb-6">{selectedImage.description}</p>
                
                {/* Additional details */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-base">Updated: March 2024</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-base">Location: Main Campus</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-8 space-y-3">
                  <button className="w-full bg-linear-to-r from-orange-600 to-yellow-600 text-white py-4 rounded-full font-semibold hover:shadow-lg transition-all text-lg">
                    Schedule a Tour
                  </button>
                  <button className="w-full border-2 border-orange-600 text-orange-600 py-4 rounded-full font-semibold hover:bg-orange-50 transition-all text-lg">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom styles for hiding scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Gallery;