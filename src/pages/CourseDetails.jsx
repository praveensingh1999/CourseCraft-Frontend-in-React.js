import React, { useEffect, useState, useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-hot-toast"
import { BiInfoCircle } from "react-icons/bi"
import { HiOutlineGlobeAlt } from "react-icons/hi"
import ReactMarkdown from "react-markdown"

import ConfirmationModal from "../components/common/ConfirmationModal"
import Footer from "../components/common/Footer"
import RatingStars from "../components/common/RatingStars"
import CourseAccordionBar from "../components/core/Course/CourseAccordionBar"
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard"
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI"
import { buyCourse } from "../services/operations/studentFeaturesAPI"
import { formatDate } from "../services/formatDate"
import GetAvgRating from "../utils/avgRating"
import { ACCOUNT_TYPE } from "../utils/constant"
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
  const [isActive, setIsActive] = useState([])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetchCourseDetails(courseId)
        setResponse(res)
      } catch (error) {
        console.error("Could not fetch course details", error)
      }
    })()
  }, [courseId])

  const courseDetails = response?.data?.courseDetails

  const isEnrolled = useMemo(() => {
    if (!user || !user.courses || !courseDetails) return false
    return user.courses.some((c) => c?._id === courseDetails?._id)
  }, [user, courseDetails])

  const avgReviewCount = useMemo(() => {
    return GetAvgRating(courseDetails?.ratingAndReviews || [])
  }, [courseDetails])

  const totalNoOfLectures = useMemo(() => {
    let lectures = 0
    courseDetails?.courseContent?.forEach((sec) => {
      lectures += sec.subSection?.length || 0
    })
    return lectures
  }, [courseDetails])

  const handleActive = (id) => {
    setIsActive(
      !isActive.includes(id)
        ? [...isActive, id]
        : isActive.filter((e) => e !== id)
    )
  }

  const handleBuyCourse = () => {
    if (user?.role === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("Instructors cannot buy courses")
      return
    }
    if (token) {
      buyCourse(token, [courseId], user, navigate, dispatch)
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to Purchase Course.",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  if (loading || !response)
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )

  if (!response.success) return <Error />

  if (paymentLoading)
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )

  return (
    <>
      <div className="relative w-full bg-richblack-800">
        {/* HERO */}
        <div className="mx-auto box-content px-4 lg:w-[1260px]">
          <div className="grid min-h-[450px] lg:grid-cols-2 py-8 lg:py-0">
            <div className="lg:hidden relative max-h-[30rem]">
              <img
                src={courseDetails?.thumbnail}
                alt="thumbnail"
                className="w-full"
              />
            </div>

            <div className="flex flex-col gap-4 py-5 text-richblack-5">
              <h1 className="text-4xl font-bold">{courseDetails?.courseName}</h1>
              <p className="text-richblack-200">{courseDetails?.courseDescription}</p>

              <div className="flex items-center gap-2">
                <span className="text-yellow-25">{avgReviewCount}</span>
                <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
                <span>({courseDetails?.ratingAndReviews?.length || 0} reviews)</span>
                <span>{courseDetails?.studentsEnrolled?.length || 0} students</span>
              </div>

              <p>
                Created By {courseDetails?.instructor?.firstName} {courseDetails?.instructor?.lastName}
              </p>

              <div className="flex gap-5">
                <p className="flex items-center gap-2">
                  <BiInfoCircle /> {formatDate(courseDetails?.createdAt)}
                </p>
                <p className="flex items-center gap-2">
                  <HiOutlineGlobeAlt /> English
                </p>
              </div>

              {/* MOBILE ACTIONS */}
              <div className="lg:hidden mt-4">
                <p className="text-3xl font-semibold">₹ {courseDetails?.price}</p>
                {isEnrolled ? (
                  <button className="yellowButton w-full mt-3" onClick={() => navigate(`/course/${courseId}`)}>
                    Go to Course
                  </button>
                ) : (
                  <>
                    <button className="yellowButton w-full mt-3" onClick={handleBuyCourse}>
                      Buy Now
                    </button>
                    <button className="blackButton w-full mt-2">Add to Cart</button>
                  </>
                )}
              </div>
            </div>

            {/* DESKTOP CARD */}
            <div className="hidden lg:block">
              <CourseDetailsCard
                course={courseDetails}
                isEnrolled={isEnrolled}
                handleBuyCourse={handleBuyCourse}
                setConfirmationModal={setConfirmationModal}
              />
            </div>
          </div>
        </div>
      </div>

      {/* COURSE CONTENT */}
      <div className="mx-auto px-4 lg:w-[1260px] text-richblack-5">
        <div className="mx-auto max-w-[810px]">
          <div className="my-8 border border-richblack-600 p-8">
            <p className="text-3xl font-semibold">What you'll learn</p>
            <ReactMarkdown className="mt-4">{courseDetails?.whatYouWillLearn}</ReactMarkdown>
          </div>

          <div>
            <h2 className="text-3xl font-semibold">Course Content</h2>
            <p className="mt-2">
              {courseDetails?.courseContent?.length || 0} sections • {totalNoOfLectures} lectures
            </p>
            {courseDetails?.courseContent?.map((section, index) => (
              <CourseAccordionBar key={index} course={section} isActive={isActive} handleActive={handleActive} />
            ))}
          </div>

          {/* AUTHOR */}
          <div className="mb-12 py-4">
            <h2 className="text-3xl font-semibold">Author</h2>
            <div className="flex items-center gap-4 py-4">
              <img
                src={courseDetails?.instructor?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${courseDetails?.instructor?.firstName} ${courseDetails?.instructor?.lastName}`}
                alt="Author"
                className="h-14 w-14 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <p className="text-lg font-medium">{courseDetails?.instructor?.firstName} {courseDetails?.instructor?.lastName}</p>
                <p className="text-richblack-50">{courseDetails?.instructor?.additionalDetails?.about}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}

export default CourseDetails
