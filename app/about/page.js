import NavBar from "../components/navbar";
import Footer from "../components/footer";
export default function AboutPage() {
  return (
    <div className="min-h-screen dark:bg-black px-6">
        <NavBar></NavBar>
      <div className="mx-auto max-w-4xl dark:bg-black rounded-xl shadow-sm p-8 mt-20 pb-50">
        
        <h1 className="text-3xl font-bold text-gray-300 mb-6">
          About the Quotation Maker
        </h1>

        <p className="text-gray-100 leading-relaxed mb-4">
          This quotation maker is a handy and effortless web application
          developed specifically for a fitness equipment supplier organization.
          It is designed to simplify and accelerate the quotation generation
          process while maintaining a professional and consistent format.
        </p>

        <p className="text-gray-100 leading-relaxed mb-4">
          Using this platform, employees can create accurate and well-structured
          quotations within seconds. Automated calculations and instant PDF
          generation significantly reduce manual effort and help ensure clarity,
          accuracy, and a polished presentation for customers.
        </p>

        <p className="text-gray-100 leading-relaxed">
          By saving time for both employees and customers, the application
          improves efficiency and supports faster decision-making. In today’s
          fast-paced business environment, where time is money, this solution
          enables the organization to operate more effectively and
          professionally.
        </p>

      </div>
      <Footer></Footer>
    </div>
  );
}
