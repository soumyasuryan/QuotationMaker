import Image from "next/image";

export default function NavBar() {
  return (
    <div className="bg-black text w-full p-4">
        <ul className="flex justify-between">
            <li>Web Logo</li>
            <ul className="flex gap-4">
                <li>Home</li>
                <li>About</li>
                <li>Contact</li>

            </ul>
        </ul>
    </div>
  );
}
