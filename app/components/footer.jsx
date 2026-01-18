import Image from "next/image";

export default function Footer() {
    return (
        <div className="bg-black text sm:w-[98%] w-[90%] p-4 fixed bottom-0 text-sm">
            <hr />
            <ul className="flex sm:flex-row flex-col justify-between p-3">
                <ul className="flex gap-4 mt-5">
                    <a href="https://github.com/soumyasuryan/">Developed By: Soumya Suryan</a>

                    
<a
  href="https://mail.google.com/mail/?view=cm&to=soumyasuryan86@gmail.com&su=Quotation%20Query&body=Hello%20Team"
  target="_blank"
  rel="noopener noreferrer"
  className="hover:text-gray-300 hover:underline"
>
  Email via Gmail
</a>




                    <h1>7838875708</h1>
                </ul>
                <ul className="flex sm:gap-4 gap-2 justify-between mt-5">
                    <li>Home</li>
                    <li>About</li>
                    <li>Contact</li>

                </ul>
            </ul>

        </div>
    );
}