import React from 'react'
import { Link } from 'react-router'

const Banner2 = () => {
  return (
    <section
      id="banner-2"
      className="my-3"
      style={{ background: "#F9F3EC" }}
    >
      <div className="container">
        <div className="row flex-md-row-reverse align-items-center text-center text-md-start">

          {/* IMAGE */}
          <div className="img-wrapper col-12 col-md-6 mb-3 mb-md-0">
            <img
              loading="eager"
              src="/images/banner-img2.png"
              className="img-fluid"
            />
          </div>

          {/* CONTENT */}
          <div className="content-wrapper col-12 col-md-5 offset-md-1 px-2 px-md-5">

            <div className="secondary-font text-primary text-uppercase mb-2 mb-md-3"
              style={{ fontSize: "clamp(14px, 3vw, 20px)" }}
            >
              Be A Good Parent To Your Pets
            </div>

            <h2
              className="fw-normal"
              style={{
                fontSize: "clamp(26px, 5vw, 64px)"
              }}
            >
              Hop On To The Shop
            </h2>

            <Link
              to="/shop"
              className="btn btn-outline-dark mt-3 text-uppercase rounded-1"
            >
              shop now
              <svg width="24" height="24" className="ms-1">
                <use xlinkHref="#arrow-right"></use>
              </svg>
            </Link>

          </div>

        </div>
      </div>
    </section>
  )
}

export default Banner2
