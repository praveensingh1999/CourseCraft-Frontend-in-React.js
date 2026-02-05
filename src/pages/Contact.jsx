import React from 'react'
import Footer from "../components/common/Footer"
import ContactDetails from "../components/common/ContactDetails"
import ContactForm from "../components/common/ContactForm"
 import ReviewSlider from "../components/common/ReviewSlider"
function Contact() {
  return (
     <div>
      <div className="mx-auto mt-20 flex w-11/12 max-w-[1260px] flex-col justify-between gap-10 text-white lg:flex-row">
        {/* Contact Details */}
        <div className="lg:w-[40%]">
          <ContactDetails />
        </div>

        {/* Contact Form */}
        <div className="lg:w-[60%]">
          <ContactForm />
        </div>
      </div>
      <div className="relative mx-auto my-20 flex w-11/12 max-w-[1260px] flex-col items-center justify-between gap-8 bg-[#0C2B4E] text-white">
        {/* Reviws from Other Learner */}
        <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other learners
        </h1>
        <ReviewSlider />
      </div>
      <Footer />
    </div>
  )
}

export default Contact