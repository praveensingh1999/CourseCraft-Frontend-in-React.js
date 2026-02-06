import React, { useEffect, useState, useMemo } from "react"
import { toast } from "react-hot-toast"
import { ACCOUNT_TYPE } from "../utils/constant"
import { BiInfoCircle } from "react-icons/bi"
import { HiOutlineGlobeAlt } from "react-icons/hi"
import ReactMarkdown from "react-markdown"

import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import ConfirmationModal from "../components/common/ConfirmationModal"
import Footer from "../components/common/Footer"
import RatingStars from "../components/common/RatingStars"
import CourseAccordionBar from "../components/core/Course/CourseAccordionBar"
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard"
import { formatDate } from "../services/formatDate"
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI"
import { buyCourse } from "../services/operations/studentFeaturesAPI"
import GetAvgRating from "../utils/avgRating"
import Error from "./Error"

function CourseDetails() {
  const { user, loading } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { paymentLoading } = useSelector((state) => state.course)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { courseId } = useParams()

  const [response, setResponse] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)

  /* ================= FETCH COURSE ================= */
  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetchCourseDetails(courseId)
        setResponse(res)
      } catch (error) {
        console.log("Could not fetch Course Details", error)
      }
    })()
  }, [courseId])

  /* ================= LOADING STATES ================= */
  if (loading || !response) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner" />
      </div>
    )
  }

  if (!response.success) {
    return <Error />
  }

  const {
    _id: course_id,
    courseName,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    instructor,
    studentsEnrolled,
    createdAt,
  } = response.data.courseDetails

  /* ================= ENROLLMENT LOGIC (SINGLE SOURCE) ================= */
  const isEnrolled = useMemo(() => {
    if (!user || !user.courses) return false
    return user.courses.some((c) => c._id === course_id)
  }, [user, course_id])

  /* ================= AVG RATING ================= */
  const avgReviewCount = useMemo(() => {
    return GetAvgRating(ratingAndReviews)
  }, [ratingAndReviews])

  /* ================= TOTAL LECTURES ================= */
  const totalNoOfLectures = useMemo(() => {
    let lectures = 0
    courseContent?.forEach((sec) => {
      lectures += sec.subSection?.length || 0
    })
    return lectures
  }, [courseContent])

  /* ================= BUY COURSE ================= */
  const handleBuyCourse = () => {
    if (user?.role === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.")
      return
    }

    if (token) {
      buyCourse(token, [courseId], user, navigate, dispatch)
      return
    }

    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to purchase this course.",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  if (paymentLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <>
      {/* ================= HERO ================= */}
      <div className="relative w-full bg-[#161D29]">
        <div className="mx-auto box-content px-4 lg:w-[1260px]">
          <div className="grid min-h-[450px] py-8 lg:grid-cols-2 lg:py-0">
            {/* MOBILE IMAGE */}
            <div className="lg:hidden">
              <img src={thumbnail} alt="thumbnail" className="w-full" />
            </div>

            {/* DETAILS */}
            <div className="flex flex-col gap-4 py-5 text-[#F1F2FF]">
              <h1 className="text-4xl font-bold">{courseName}</h1>
              <p className="text-[#999DAA]">{courseDescription}</p>

              <div className="flex items-center gap-2">
                <span className="text-[#FFE83D]">{avgReviewCount}</span>
                <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
                <span>({ratingAndReviews.length} reviews)</span>
                <span>{studentsEnrolled.length} students</span>
              </div>

              <p>
                Created by {instructor.firstName} {instructor.lastName}
              </p>

              <div className="flex gap-5">
                <p className="flex items-center gap-2">
                  <BiInfoCircle /> {formatDate(createdAt)}
                </p>
                <p className="flex items-center gap-2">
                  <HiOutlineGlobeAlt /> English
                </p>
              </div>

              {/* ================= MOBILE ACTIONS ================= */}
              <div className="lg:hidden mt-4">
                <p className="text-3xl font-semibold">₹ {price}</p>

                {isEnrolled ? (
                  <button
                    className="yellowButton w-full mt-3"
                    onClick={() => navigate(`/course/${course_id}`)}
                  >
                    Go to Course
                  </button>
                ) : (
                  <>
                    <button
                      className="yellowButton w-full mt-3"
                      onClick={handleBuyCourse}
                    >
                      Buy Now
                    </button>
                    <button className="blackButton w-full mt-2">
                      Add to Cart
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* ================= DESKTOP CARD ================= */}
            <div className="hidden lg:block">
              <CourseDetailsCard
                course={response.data.courseDetails}
                isEnrolled={isEnrolled}
                handleBuyCourse={handleBuyCourse}
                setConfirmationModal={setConfirmationModal}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="mx-auto px-4 lg:w-[1260px] text-[#F1F2FF]">
        <div className="border p-8 my-8">
          <h2 className="text-3xl font-semibold">What you'll learn</h2>
          <ReactMarkdown className="mt-4">
            {whatYouWillLearn}
          </ReactMarkdown>
        </div>

        <div>
          <h2 className="text-3xl font-semibold">Course Content</h2>
          <p className="mt-2">
            {courseContent.length} sections • {totalNoOfLectures} lectures
          </p>

          <div className="mt-4">
            {courseContent.map((section, index) => (
              <CourseAccordionBar key={index} course={section} />
            ))}
          </div>
        </div>
      </div>

      <Footer />

      {confirmationModal && (
        <ConfirmationModal modalData={confirmationModal} />
      )}
    </>
  )
}

export default CourseDetails
