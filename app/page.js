import Image from "next/image";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

export default function Home() {
  return (
    <div className="   min-h-screen ">
     <Navbar></Navbar>
     <div className="flex flex-col items-center justify-center md:pt-20 py-40 md:py-20 mx-2">
      <h1 className=" text-3xl sm:text-[50px] ">Your <span className="text-gray-400">Quotation</span> generator</h1>
      <h6 className="text-gray-300 text-sm sm:text-xl">Get your quotation generated with seconds. </h6>
      <a href="/quotation-maker" className="text-black bg-white p-3 mt-10 mb-10 mb-5 text-xl px-5 rounded-lg hover:bg-white/10 hover:text-white hover:border-white border-2">Get Started</a>
      <h4 className="text-gray-300 text-sm sm:text-lg text-center sm:w-140 w-80 pb-50 ">Minding the hectic part so that you can mind the real business...
        Just select the machines using model number or machine names and your are good to go
      </h4>
      <Footer></Footer>
     </div>
     
    </div>
  );
}
