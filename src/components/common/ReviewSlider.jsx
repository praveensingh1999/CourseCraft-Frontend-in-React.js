import React, { useEffect, useState } from "react"
import ReactStars from "react-rating-stars-component"

// Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"

// Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"

import "../../App.css"

// Icons
import { FaStar } from "react-icons/fa"

// Swiper modules
import { Autoplay, FreeMode, Pagination } from "swiper/modules"

// API
import { apiConnector } from "../../services/apiconnector"
import { ratingsEndpoints } from "../../services/apis"

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const truncateWords = 15

  useEffect(() => {
    (async () => {
      try {
        const { data } = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        )
        if (data?.success) setReviews(data?.data)
      } catch (err) {
        console.error(err)
      }
    })()
  }, [])

  return (
    <div className="review-slider-wrapper text-white">
      <div className="my-[50px] max-w-[1260px] mx-auto px-4">
        <Swiper
          loop={true}
          freeMode={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[FreeMode, Pagination, Autoplay]}
          spaceBetween={20}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 4,
            },
          }}
          className="review-swiper"
        >
          {reviews.map((review, i) => (
            <SwiperSlide key={i}>
              <div className="review-card">
                <div className="review-user">
                  <img
                    src={
                      review?.user?.image
                        ? review.user.image
                        : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                    }
                    alt="user"
                  />

                  <div>
                    <h3>
                      {review?.user?.firstName} {review?.user?.lastName}
                    </h3>
                    <p>{review?.course?.courseName}</p>
                  </div>
                </div>

                <p className="review-text">
                  {review?.review?.split(" ").length > truncateWords
                    ? `${review.review
                        .split(" ")
                        .slice(0, truncateWords)
                        .join(" ")}...`
                    : review?.review}
                </p>

                <div className="review-rating">
                  <span>{review?.rating?.toFixed(1)}</span>
                  <ReactStars
                    count={5}
                    value={review?.rating}
                    size={20}
                    edit={false}
                    activeColor="#ffd700"
                    emptyIcon={<FaStar />}
                    fullIcon={<FaStar />}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default ReviewSlider
