import React from 'react';

const CarouselSlide = ({ image, title, description, link }) => {
  return (
    <div className="relative w-full h-full bg-gray-100 flex items-center justify-center overflow-hidden">
      {image && (
        <img
          src={image}
          alt={title || "Carousel Slide"}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
    </div>
  );
};

export default CarouselSlide;