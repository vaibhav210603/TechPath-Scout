import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './ReviewSection.css';

const Star = ({ filled, size = 16 }) => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 20 20"
      style={{ fill: filled ? '#FFB800' : '#D1D5DB' }}
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const reviews = [
    { name: "Vaibhav Upadhyay", rating: 5, description: "Found my perfect tech path in AI/ML. The guidance was invaluable!", role: "AI/ML Enthusiast" },
    { name: "Dristant Senger", rating: 4, description: "Great insights into web development. Helped me choose my specialty.", role: "Web Developer" },
    { name: "Aradhya Mittal", rating: 5, description: "Finally understood where I fit in the tech world. Cybersecurity was my calling!", role: "Cybersecurity Analyst" },
    { name: "Siddharth Pandey", rating: 5, description: "The career guidance helped me pivot into data science successfully.", role: "Data Scientist" }
];

const ReviewSection = () => {
  return (
    <section className="review-section-container">
        <div className="review-summary-card">
            <span className="review-avg-rating">4.9</span>
            <div className="review-stars-wrapper">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} filled={i < 4.9} size={24} />
                ))}
            </div>
            <a href="#" className="all-reviews-link">All reviews</a>
        </div>

        <div className="review-carousel-wrapper">
            <h2 className="review-section-title">Student Testimonials</h2>
            <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={30}
                slidesPerView={1}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop={true}
            >
                {reviews.map((review, index) => (
                    <SwiperSlide key={index}>
                        <div className="testimonial-card">
                            <p className="testimonial-text">"{review.description}"</p>
                            <div className="testimonial-author">
                                <span className="author-name">{review.name}</span>
                                <span className="author-role">{review.role}</span>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    </section>
  );
};

export default ReviewSection;