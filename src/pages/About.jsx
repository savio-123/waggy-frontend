import "./about.css";

export default function About() {
  return (
    <div className="about-clean">

      {/* HERO */}
      <section className="about-hero-clean">
        <h1>Waggy 🐾</h1>
        <p>Simple. Trusted. Made for your pets.</p>
      </section>

      {/* ABOUT */}
      <section className="about-content container">
        <div className="about-text">

          <h2>Who We Are</h2>

          <p>
            Waggy is built for pet lovers who want the best for their companions.
            We focus on quality, simplicity, and trust — everything your pet deserves.
          </p>

          <p>
            From everyday essentials to premium products, we bring everything
            together in one clean experience.
          </p>

        </div>
      </section>

      {/* FEATURES */}
      <section className="about-features-clean container">

        <div className="feature">
          <h4>Quality First</h4>
          <p>Carefully selected products for your pets</p>
        </div>

        <div className="feature">
          <h4>Fast Delivery</h4>
          <p>Quick and reliable shipping experience</p>
        </div>

        <div className="feature">
          <h4>Trusted</h4>
          <p>Loved by pet owners everywhere</p>
        </div>

      </section>

      {/* CONTACT */}
      <section className="about-contact">

        <h3>Contact Us</h3>

        <p>Have questions or need help?</p>

        <div className="contact-info">

          <div>
            <span>Email</span>
            <p>support@waggy.com</p>
          </div>

          <div>
            <span>Phone</span>
            <p>+91 98765 43210</p>
          </div>

          <div>
            <span>Location</span>
            <p>Kerala, India</p>
          </div>

        </div>

      </section>

    </div>
  );
}