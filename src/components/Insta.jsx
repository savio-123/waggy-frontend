export default function Insta() {

    const images = [1, 2, 3, 4, 5, 6]
  
    return (
      <section id="insta" className="my-5">
        <div className="row g-0 py-5">
  
          {images.map((num, index) => (
            <div className="col instagram-item text-center position-relative" key={index}>
  
              {/* ICON OVERLAY */}
              <div className="icon-overlay d-flex justify-content-center position-absolute">
                <iconify-icon
                  className="text-white"
                  icon="la:instagram"
                ></iconify-icon>
              </div>
  
              {/* IMAGE */}
              <a href="#">
                <img
                  src={`/images/insta${num}.jpg`}
                  alt="insta"
                  className="img-fluid rounded-3"
                />
              </a>
  
            </div>
          ))}
  
        </div>
      </section>
    )
  }