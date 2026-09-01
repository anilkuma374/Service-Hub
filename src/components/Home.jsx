import { Link } from "react-router-dom";
import { FaShieldAlt, FaClock, FaRupeeSign } from "react-icons/fa";
import "../styles/home.css";

const heroCar = "https://images.unsplash.com/photo-1721909407299-5ba060675f8d?auto=format&fit=crop&fm=jpg&q=80&w=1400";
const heroBike = "https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&fm=jpg&q=80&w=1400";

export default function Home() {

    return (
        <div className="home">

            <section className="hero">

                <div>
                    <span className="tag">TRUSTED VEHICLE CARE</span>
                    <h1>Your Vehicle Deserves <span>Expert Care.</span></h1>
                    <p>Book trusted car and bike services from verified service centers near you.</p>

                    <div className="hero-btns">
                        <Link className="primary-btn" to="/services">Book a Service</Link>
                        <Link className="outline-btn" to="/service-centers">Find Centers</Link>
                    </div>
                </div>

                <div className="hero-visual">
                    <img
                        src={heroCar}
                        alt="Real car"
                        onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1200"; }}
                    />
                    <img
                        src={heroBike}
                        alt="Real motorcycle"
                        onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&q=80&w=1200"; }}
                    />
                </div>

            </section>

            <section className="vehicle-choice">

                <h2>Choose Your Vehicle</h2>

                <div className="choice-grid">

                    <Link to="/services?type=car">
                        <img src={heroCar} alt="Real car service" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1200"; }} />
                        <h3>Car Service</h3>
                        <p>Complete maintenance and repair</p>
                    </Link>

                    <Link to="/services?type=bike">
                        <img src={heroBike} alt="Real bike service" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&q=80&w=1200"; }} />
                        <h3>Bike Service</h3>
                        <p>Reliable care for every ride</p>
                    </Link>

                </div>

            </section>

            <section className="features">

                <h2>Why Choose ServiceHub?</h2>

                <div className="feature-grid">

                    <article>
                        <FaShieldAlt />
                        <h3>Verified Centers</h3>
                        <p>Trusted professionals and quality service.</p>
                    </article>

                    <article>
                        <FaClock />
                        <h3>Easy Booking</h3>
                        <p>Book your service in just a few clicks.</p>
                    </article>

                    <article>
                        <FaRupeeSign />
                        <h3>Best Pricing</h3>
                        <p>Transparent and affordable service costs.</p>
                    </article>

                </div>

            </section>

        </div>
    );
}
