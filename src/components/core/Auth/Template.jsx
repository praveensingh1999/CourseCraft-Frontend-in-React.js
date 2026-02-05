import React from 'react'
import { FcGoogle } from "react-icons/fc"
import { useSelector } from "react-redux"

import frameImg from "../../../assets/Images/frame.png"
import LoginForm from "./LoginForm"
import SignupForm from "./SignUpForm"
import Footer from '../../common/Footer'

function Template({ title, description1, description2, image, formType }) {
  const { loading } = useSelector((state) => state.auth)

  return (
    <>
      {/* CENTERED CONTENT ONLY */}
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        {loading ? (
          <div className="spinner"></div>
        ) : (
          <div className="mx-auto flex w-11/12 max-w-[1260px] flex-col-reverse justify-between gap-y-12 py-12 md:flex-row md:gap-x-12">
            <div className="mx-auto w-11/12 max-w-[450px] md:mx-0">
              <h1 className="text-[1.875rem] font-semibold leading-9.5 text-[#F1F2FF]">
                {title}
              </h1>
              <p className="mt-4 text-[1.125rem] leading-6.5">
                <span className="text-[#AFB2BF]">{description1}</span>{" "}
                <span className="font-edu-sa font-bold italic text-[#47A5C5]">
                  {description2}
                </span>
              </p>
              {formType === "signup" ? <SignupForm /> : <LoginForm />}
            </div>

            <div className="relative mx-auto w-11/12 max-w-[450px] md:mx-0">
              <img src={frameImg} alt="Pattern" loading="lazy" />
              <img
                src={image}
                alt="Students"
                loading="lazy"
                className="absolute -top-4 right-4 z-10"
              />
            </div>
          </div>
        )}
      </div>

     
      <Footer className="w-full" />
    </>
  )
}


export default Template