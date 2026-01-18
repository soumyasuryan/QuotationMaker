import Image from "next/image";

export default function Footer() {
    return (
        <div className="bg-black text w-full p-4 fixed bottom-0 text-sm">
            <hr />
            <ul className="flex justify-between p-3">
                <ul className="flex gap-4 mt-5">
                    <h1>example@gmail.com</h1>
                    <h1>34343434343</h1>
                </ul>
                <ul className="flex gap-4 justify-between mt-5">
                    <li>Home</li>
                    <li>About</li>
                    <li>Contact</li>

                </ul>
            </ul>

        </div>
    );
}