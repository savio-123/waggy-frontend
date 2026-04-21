import { useEffect } from "react"
import Swiper from "swiper"
import { Autoplay, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import { Link } from "react-router"

export default function Banner() {

  useEffect(() => {
    new Swiper(".main-swiper", {
      modules: [Autoplay, Pagination],
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    })
  }, [])

  return (
    <section id="banner" style={{ background: "#F9F3EC" }}>
      <div className="container">
        <div className="swiper main-swiper">

          <div className="swiper-wrapper">

            {/* SLIDE */}
            {[1,2,3].map((_, index) => (
              <div className="swiper-slide py-4 py-md-5" key={index}>

                <div className="row banner-content align-items-center text-center text-md-start">

                  {/*  IMAGE */}
                  <div className="img-wrapper col-12 col-md-5 mb-3 mb-md-0">
                    <img
                      loading="eager"
                      src={`/images/banner-img${index === 0 ? "" : index+2}.png`}
                      className="img-fluid"
                    />
                  </div>

                  {/*  CONTENT */}
                  <div className="content-wrapper col-12 col-md-7 px-2 px-md-5">

                    <h2 className="banner-title fw-normal"
                      style={{
                        fontSize: "clamp(24px, 5vw, 64px)"  
                      }}
                    >
                      Best destination for{" "}
                      <span className="text-primary">your pets</span>
                    </h2>

                    <Link
                      to="/shop"
                      className="btn btn-outline-dark mt-3 mb-3 text-uppercase rounded-1"
                    >
                      shop now
                    </Link>

                  </div>

                </div>

              </div>
            ))}

          </div>

          <div className="swiper-pagination mt-3"></div>

        </div>
      </div>
    </section>
  )
}