"use client";
import NavBar from "../components/navbar";
import Footer from "../components/footer";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setStatus("Message sent successfully.");
      setForm({ name: "", email: "", message: "" });
    } else {
      setStatus("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen dark:bg-black px-6 pb-12">
        <NavBar></NavBar>
      <div className="mx-auto max-w-3xl dark:bg-black rounded-xl shadow-sm p-8">

        <h1 className="text-3xl font-bold text-gray-300 mb-6">
          Contact Us
        </h1>

        <p className="text-gray-100 mb-8">
          Have a question or need assistance? Please fill out the form below
          and we’ll get back to you as soon as possible.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-200">
              Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">
              Message
            </label>
            <textarea
              name="message"
              rows="4"
              required
              value={form.message}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>

          {status && (
            <p className="text-sm text-center text-gray-600 mt-3">
              {status}
            </p>
          )}
        </form>

      </div>
      <Footer></Footer>
    </div>
  );
}
