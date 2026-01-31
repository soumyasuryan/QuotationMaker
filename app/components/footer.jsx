import { FaGithub, FaEnvelope, FaPhone } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white w-full p-6 mt-70">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
        
        {/* Left Section: Developer Info */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="https://github.com/soumyasuryan/"
            target="_blank"
            className="flex items-center gap-2 hover:text-yellow-400 transition-colors"
          >
            <FaGithub /> Developed By: Soumya Suryan
          </Link>

          <a
            href="mailto:soumyasuryan86@gmail.com?subject=Quotation%20Query"
            className="flex items-center gap-2 hover:text-yellow-400 transition-colors"
          >
            <FaEnvelope /> Email Me
          </a>

          <div className="flex items-center gap-2">
            <FaPhone /> <span>7838875708</span>
          </div>
        </div>

        {/* Right Section: Navigation */}
        <nav>
          <ul className="flex flex-col sm:flex-row items-center gap-4">
            <li className="hover:text-yellow-400 transition-colors cursor-pointer">Home</li>
            <li className="hover:text-yellow-400 transition-colors cursor-pointer">About</li>
            <li className="hover:text-yellow-400 transition-colors cursor-pointer">Contact</li>
          </ul>
        </nav>
      </div>

      {/* Bottom Line */}
      <div className="mt-6 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Soumya Suryan. All rights reserved.
      </div>
    </footer>
  );
}
