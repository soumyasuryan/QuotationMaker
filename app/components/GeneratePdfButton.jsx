"use client";

export default function GeneratePdfButton({ items }) {

  function formatSpecifications(specs) {
    if (!specs || typeof specs !== "object") return "";

    return Object.entries(specs)
    .slice(0, 10)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  }
  

  async function generate() {
    console.log("Raw items:", items);

    const mappedItems = items.map(item => ({
      code: item.model_number,
      model: item.model_number,
      description: formatSpecifications(item.specifications), // ✅ FIX
      qty: item.qty ?? 1,
      price: item.price,
      image_url: item.image_url
    }));

    console.log("PDF items:", mappedItems);

    const payload = {
      items: mappedItems,
      quotationInfo: {
        number: "COSCO-001",
        date: new Date().toLocaleDateString("en-IN"),
        createdBy: "Soumya",
        contactNo: "9999999999",
        gstNo: "07ABCDE1234F1Z5",
        remarks: "Quotation valid for 15 days"
      },
      customer: {
        name: "ABC Gym",
        address: "New Delhi",
        phone: "8888888888"
      }
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

  return (
    <button
      onClick={generate}
      disabled={!items.length}
      className="mt-4 bg-black text-white px-6 py-3 mb-10 rounded-lg hover:bg-gray-100 hover:text-black border"
    >
      Generate Quotation PDF
    </button>
  );
}
