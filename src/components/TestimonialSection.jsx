import { useState } from "react"
import AddTestimonial from "./AddTestimonial"
import Testimonial from "./Testimonials"

export default function TestimonialSection() {

  const [showForm, setShowForm] = useState(false)

  return (
    <>
      <Testimonial />

      <div className="text-center mb-5">
        <button
          className="btn btn-dark"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close" : "Add Testimonial"}
        </button>
      </div>

      {showForm && <AddTestimonial />}
    </>
  )
}