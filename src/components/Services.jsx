export default function Service() {

  const services = [
    {
      icon: "la:shopping-cart",
      title: "Free Delivery",
      desc: "Fast and free delivery on all orders across India.",
    },
    {
      icon: "la:user-check",
      title: "100% Secure Payment",
      desc: "Your transactions are protected with top-level security.",
    },
    {
      icon: "la:tag",
      title: "Daily Offers",
      desc: "Get exciting discounts and deals every day.",
    },
    {
      icon: "la:award",
      title: "Quality Guarantee",
      desc: "We provide only the best products for your pets.",
    },
  ]

  return (
    <section id="service">
      <div className="container">

        <div className="row g-md-5 pt-4">

          {services.map((service, index) => (
            <div className="col-md-3 my-3" key={index}>

              <div className="card">

                <div>
                  <iconify-icon
                    className="service-icon text-primary"
                    icon={service.icon}
                  ></iconify-icon>
                </div>

                <h3 className="card-title py-2 m-0">
                  {service.title}
                </h3>

                <div className="card-text">
                  <p className="blog-paragraph fs-6">
                    {service.desc}
                  </p>
                </div>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  )
}