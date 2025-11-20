import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import CarouselSlide from "../Layout/HomeTemplates/CarouselSlide";
import CarouselSkeleton from "../Layout/HomeTemplates/CarouselSkeleton";
import { fetchSlides } from "../utils/carousel"; // Import the fetchSlides utility
// 🔹 Import CategoriesItem component
import CategoryBar from "../Layout/Sections/CategoryBar";
import TopRatedCollections from "../Layout/Sections/TopRatedCollections";
import RecentlyViewed from "../Layout/Sections/RecentlyViewed";
import ProductShowcase from "../Layout/Sections/ProductShowcase";
import { useAppContext } from "../Context/AppContext";

const Home = () => {
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [loadingCarousel, setLoadingCarousel] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0); // This will now index into carouselSlides
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [progress, setProgress] = useState(0);
  const autoScrollIntervalRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // Touch/Swipe state
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const containerRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [errorRelated, setErrorRelated] = useState(null);
  const [mostRecentViewed, setMostRecentViewed] = useState(null);
  const { axios } = useAppContext();

  // Check if mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const getCarouselSlides = async () => {
      try {
        setLoadingCarousel(true);
        const data = await fetchSlides();
        setCarouselSlides(data);
      } catch (error) {
        console.error("Error fetching carousel slides:", error);
      } finally {
        setLoadingCarousel(false);
      }
    };
    getCarouselSlides();
  }, []);
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/products/list");
        const featured = res.data.products.filter((p) => p.isfeatured === true);
        setFeaturedProducts(featured.slice(0, 4)); // Get first 4 featured products
      } catch (err) {
        console.error("Failed to fetch featured products:", err);
        setError("Could not load featured products.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [axios]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      setLoadingRelated(true);
      setErrorRelated(null);
      try {
        const recentlyViewed =
          JSON.parse(localStorage.getItem("recentlyViewed")) || [];
        if (recentlyViewed.length === 0) {
          setRelatedProducts([]);
          setLoadingRelated(false);
          return;
        }

        const mostRecentItem = recentlyViewed[0];
        setMostRecentViewed(mostRecentItem);

        const res = await axios.get("/api/products/list");
        const allProducts = res.data.products || [];

        const related = allProducts.filter(
          (p) => p.subcategory === mostRecentItem.subcategory
        );

        setRelatedProducts(related.slice(0, 4)); // Get first 4 related products
      } catch (err) {
        console.error("Failed to fetch related products:", err);
        setErrorRelated("Could not load related products.");
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelatedProducts();
  }, [axios]);


  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Progress bar effect
  useEffect(() => {
    setProgress(0);
    if (isAutoScrolling) {
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + 1; // 1% every 50ms = 5s total
        });
      }, 50);
    }
    return () => {
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
    };
  }, [currentSlide, isAutoScrolling]);

  // Auto-scroll functionality
  useEffect(() => {
    if (isAutoScrolling) {
      autoScrollIntervalRef.current = carouselSlides.length > 0 && setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
      }, 5000); // Change slide every 5 seconds
    }
    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      } // Clear interval when component unmounts or dependencies change
    };
  }, [isAutoScrolling, carouselSlides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setProgress(0);
    setIsAutoScrolling(false);
    // Resume auto-scroll after 10 seconds of manual navigation
    setTimeout(() => setIsAutoScrolling(true), 10000);
  };

  const goToPrevious = () => {
    const newSlide =
      currentSlide === 0 ? carouselSlides.length - 1 : currentSlide - 1;
    goToSlide(newSlide);
  };

  const goToNext = () => {
    const newSlide = (currentSlide + 1) % carouselSlides.length;
    goToSlide(newSlide);
  };

  // Touch handlers for swipe functionality
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  return (
    <div className="w-full bg-[#e8ecf0]">
      <div className="py-4 xl:px-10">
        <CategoryBar />
      </div>

      <div className="flex w-[100%] lg:px-10 gap-4">
        {/* 🔹 Main Carousel */}
        <div
          ref={containerRef}
          className="relative lg:w-[67%] overflow-hidden h-[67vh] lg:h-[50vh] rounded-lg mb-5"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="relative lg:w-full overflow-hidden h-[67vh] lg:h-[50vh] lg:px-8 rounded-lg">
            {loadingCarousel ? (
              <CarouselSkeleton />
            ) : carouselSlides.length > 0 ? (
              carouselSlides.map((slide, index) => (
                <div
                  key={slide._id} // Use _id from MongoDB
                  className={`absolute inset-0 w-full h-full transition-transform duration-700 ease-in-out ${
                    index === currentSlide ? "translate-x-0" : "translate-x-full"
                  }`}
                  style={{
                    transform:
                      index === currentSlide
                        ? "translateX(0)"
                        : index < currentSlide
                        ? "translateX(-100%)"
                        : "translateX(100%)",
                  }}
                >
                  <div className="w-full h-full overflow-hidden">
                    <CarouselSlide {...slide} />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-500">No carousel slides available.</div>
            )}
          </div>

          {/* Navigation buttons - Hidden on mobile */}
          <button
            onClick={goToPrevious}
            className="hidden md:block absolute left-14 top-1/2 transform -translate-y-1/2 z-20 bg-white/50 hover:bg-white/60 text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={goToNext}
            className="hidden md:block absolute right-14 top-1/2 transform -translate-y-1/2 z-20 bg-white/50 hover:bg-white/60 text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>

          {/* Progress bars - Hidden on mobile */}
          <div className="hidden md:flex absolute bottom-5 left-1/2 transform -translate-x-1/2 space-x-1 z-20">
            {carouselSlides.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 bg-gray-300 rounded-full overflow-hidden transition-all duration-200 ${
                  index === currentSlide ? "w-10" : "w-4"
                }`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-50 ${
                    index === currentSlide ? "bg-[#0c071b]" : "bg-gray-100"
                  }`}
                  style={{
                    width: index === currentSlide ? `${progress}%` : "0%",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 h-[50vh] w-[33%]">
          <div className="bg-pink-500 w-full h-full rounded-md">Banner 1</div>
          <div className="bg-orange-500 w-full h-full rounded-md">Banner 2</div>
        </div>
      </div>

      {/* 🔹 CategoriesItem placed after the carousel */}
      <div className="grid grid-cols gap-6">
        <TopRatedCollections />
        <div className="w-full grid grid-cols-3 lg:px-10 gap-4">
          <ProductShowcase
            products={featuredProducts}
            loading={loading}
            error={error}
            title="Featured Products"
            link="/collections?filter=featured"
          />
          {relatedProducts.length > 0 && (
            <ProductShowcase
              products={relatedProducts}
              loading={loadingRelated}
              error={errorRelated}
              title="Related to Viewed"
              link={`/collections?search=${mostRecentViewed?.subcategory}`}
            />
          )}
        </div>
        <RecentlyViewed />
      </div>
    </div>
  );
};

export default Home;
