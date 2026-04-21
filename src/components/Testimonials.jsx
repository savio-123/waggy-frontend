import { useEffect, useState, useRef } from "react"
import Swiper from "swiper"
import { Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import API from "../api"   // ✅ ADD

export default function Testimonial() {

  const [testimonials, setTestimonials] = useState([])
  const swiperRef = useRef(null)

  // FETCH TESTIMONIALS
  const fetchTestimonials = async () => {
    try {
      const res = await API.get("/testimonials/")   // ✅ FIX
      const data = res.data

      if (Array.isArray(data)) {
        setTestimonials(data.reverse())
      } else {
        setTestimonials([])
      }

    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  useEffect(() => {
    if (testimonials.length > 0 && !swiperRef.current) {
      swiperRef.current = new Swiper(".testimonial-swiper", {
        modules: [Pagination, Autoplay],
        loop: true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      })
    }
  }, [testimonials])

  return (
    <section id="testimonial">
      <div className="container my-5 py-5">
        <div className="row">
          <div className="offset-md-1 col-md-10">

            {testimonials.length === 0 ? (
              <div className="text-center py-5">
                <h5>No testimonials yet</h5>
              </div>
            ) : (

              <div className="swiper testimonial-swiper">
                <div className="swiper-wrapper">

                  {testimonials.map((item) => (
                    <div className="swiper-slide" key={item.id}>
                      <div className="row">

                        <div className="col-2">
                          <iconify-icon
                            icon="ri:double-quotes-l"
                            className="quote-icon text-primary"
                          ></iconify-icon>
                        </div>

                        <div className="col-md-10 mt-md-5 p-5 pt-0 pt-md-5">

                          <p className="testimonial-content fs-2">
                            {item.message}
                          </p>

                          <p className="text-black">
                            - {item.user}
                          </p>

                        </div>

                      </div>
                    </div>
                  ))}

                </div>

                <div className="swiper-pagination"></div>
              </div>

            )}

          </div>
        </div>
      </div>
    </section>
  )
}