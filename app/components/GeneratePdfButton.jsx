"use client";

import { useState } from "react";

export default function GeneratePdfButton({ items }) {

  // ------------------------
  // State
  // ------------------------
  const [customer, setCustomer] = useState({
    name: "",
    address: "",
    phone: ""
  });

  const [quotationInfo, setQuotationInfo] = useState({
    createdBy: "",
    contactNo: "",
    gstNo: "",
    remarks: "Valid for 15 days"
  });

  const [error, setError] = useState("");

  // ------------------------
  // Helpers
  // ------------------------
  function formatSpecifications(specs) {
    if (!specs || typeof specs !== "object") return "";
    return Object.entries(specs)
      .slice(0, 10)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
  }

  function isFormValid() {
    if (!items.length) return false;

    for (const value of Object.values(customer)) {
      if (!value.trim()) return false;
    }

    for (const value of Object.values(quotationInfo)) {
      if (!value.trim()) return false;
    }

    return true;
  }

  // ------------------------
  // Generate PDF
  // ------------------------
  async function generate() {
    if (!isFormValid()) {
      setError("Please fill all required fields before generating PDF.");
      return;
    }

    setError("");

    const mappedItems = items.map(item => ({
      code: item.model_number,
      model: item.model_number,
      description: formatSpecifications(item.specifications),
      qty: item.qty ?? 1,
      price: item.price,
      image_url: item.image_url
    }));

    const payload = {
      items: mappedItems,
      quotationInfo: {
        ...quotationInfo,
        number: "COSCO-" + Date.now(),
        date: new Date().toLocaleDateString("en-IN")
      },
      customer
    };

    const res = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      alert("Failed to generate PDF");
      return;
    }

    const buffer = await res.arrayBuffer();
    const blob = new Blob([buffer], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "cosco-quotation.pdf";
    a.click();

    window.URL.revokeObjectURL(url);
  }

  // ------------------------
  // UI
  // ------------------------
  return (
    <div className="space-y-4 my-10 flex-col justify-center items-center">

      <h1 className="text-xl font-semibold">Enter Quotation Details</h1>

      {/* Customer Info */}
      <div>
        <h2 className="font-medium">Customer Info</h2>
        <input
          className="w-90 sm:w-auto my-2 px-3 py-2 border mr-2 rounded-lg"
          placeholder="Name"
          value={customer.name}
          onChange={e => setCustomer({ ...customer, name: e.target.value })}
        />
        <input
          className="w-90 sm:w-auto my-2 px-3 py-2 border mr-2 rounded-lg"
          placeholder="Address"
          value={customer.address}
          onChange={e => setCustomer({ ...customer, address: e.target.value })}
        />
        <input
          className="w-90 sm:w-auto my-2 px-3 py-2 border mr-2 rounded-lg"
          placeholder="Phone"
          value={customer.phone}
          onChange={e => setCustomer({ ...customer, phone: e.target.value })}
        />
      </div>

      {/* Quotation Info */}
      <div>
        <h2 className="font-medium">Quotation Info</h2>
        <input
          className="w-90 sm:w-auto my-2 px-3 py-2 border mr-2 rounded-lg"
          placeholder="Created By"
          value={quotationInfo.createdBy}
          onChange={e => setQuotationInfo({ ...quotationInfo, createdBy: e.target.value })}
        />
        <input
          className="w-90 sm:w-auto my-2 px-3 py-2 border mr-2 rounded-lg"
          placeholder="Contact No"
          value={quotationInfo.contactNo}
          onChange={e => setQuotationInfo({ ...quotationInfo, contactNo: e.target.value })}
        />
        <input
          className="w-90 sm:w-auto my-2 px-3 py-2 border mr-2 rounded-lg"
          placeholder="GST Number"
          value={quotationInfo.gstNo}
          onChange={e => setQuotationInfo({ ...quotationInfo, gstNo: e.target.value })}
        />
        <input
          className="w-90 sm:w-auto my-2 px-3 py-2 border mr-2 rounded-lg mt-2"
          placeholder="Remarks"
          value={quotationInfo.remarks}
          onChange={e => setQuotationInfo({ ...quotationInfo, remarks: e.target.value })}
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-600 font-medium">{error}</p>
      )}

      {/* Generate Button */}
      <div className="flex justify-center">
      <button
        onClick={generate}
        disabled={!isFormValid()}
        className={`px-6 py-3 mb-20 rounded-lg border ${
          isFormValid()
            ? "bg-black text-white hover:bg-gray-100 hover:text-black"
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }`}
      >
        Generate Quotation PDF
      </button>
      </div>

    </div>
  );
}

