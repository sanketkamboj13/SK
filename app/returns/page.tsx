import { Header, Footer } from "../components";

export default function ReturnsPage() {
  return (
    <>
      <Header />

      <main className="returns-page">
        <section className="returns-hero">
          <p>SK CUSTOMER SERVICE</p>
          <h1>SHIPPING & RETURNS</h1>
          <p>
            Simple delivery and easy returns for your S.K order.
          </p>
        </section>

        <section className="returns-content">
          <div>
            <h2>SHIPPING</h2>
            <p>
              Free shipping is available on orders above ₹1,999.
              Standard delivery is available across India.
            </p>
          </div>

          <div>
            <h2>7-DAY RETURNS</h2>
            <p>
              Eligible products can be returned within 7 days of
              delivery, provided they are unused and in original
              condition.
            </p>
          </div>

          <div>
            <h2>HOW TO RETURN</h2>
            <p>
              Contact S.K customer support with your order number
              and return request. Our team will guide you through
              the process.
            </p>
          </div>

          <div>
            <h2>REFUNDS</h2>
            <p>
              Once the returned product is received and inspected,
              the applicable refund will be processed.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
