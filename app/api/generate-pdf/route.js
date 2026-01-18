import PDFDocument from "pdfkit";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

/* ---------------------------------
   Helper: fetch remote image as buffer
---------------------------------- */
async function fetchImageBuffer(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch {
    return null;
  }
}

export async function POST(req) {
  const { items, quotationInfo, customer } = await req.json();

  /* -----------------------------
     Validation
  ------------------------------ */
  if (!items || !items.length) {
    return NextResponse.json(
      { error: "No items provided" },
      { status: 400 }
    );
  }

  const safe = (v) => v ?? "";

  /* -----------------------------
     PDF setup
  ------------------------------ */
  const doc = new PDFDocument({ size: "A4", margin: 30 });
  const buffers = [];
  doc.on("data", buffers.push.bind(buffers));

  /* -----------------------------
     Fonts
  ------------------------------ */
  const fontRegular = path.join(
    process.cwd(),
    "public/fonts/Roboto-Regular.ttf"
  );
  const fontBold = path.join(
    process.cwd(),
    "public/fonts/Roboto-Bold.ttf"
  );

  if (!fs.existsSync(fontRegular) || !fs.existsSync(fontBold)) {
    return NextResponse.json(
      { error: "Font files missing" },
      { status: 500 }
    );
  }

  doc.registerFont("regular", fontRegular);
  doc.registerFont("bold", fontBold);
  doc.font("regular");

  /* -----------------------------
     Header
  ------------------------------ */
  const logoPath = path.join(process.cwd(), "public/logo.png");
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 30, 20, { width: 90 });
  }

  doc.font("bold").fontSize(18).text("Veegee Sales Pvt. Ltd.", 150, 25);
  doc.font("regular").fontSize(9)
    .text("The Sports & Fitness Shoppe", 150, 45)
    .text(
      "Regd. Office : 98 A A & B, Cycle Market, Jhandewalan, Phase-I, New Delhi-110055",
      150,
      57
    )
    .text(
      "Commercial Show Room : 1E/20, Jhandewalan Extension, New Delhi-110055",
      150,
      69
    );

  /* -----------------------------
     Title bar
  ------------------------------ */
  let y = 95;
  doc.rect(30, y, 535, 18).fill("#d9e1f2");
  doc.fillColor("#000")
    .font("bold")
    .fontSize(11)
    .text("QUOTATION", 30, y + 4, {
      align: "center",
      width: 535
    });

  /* -----------------------------
     Customer & quotation info
  ------------------------------ */
  y += 24;
  const leftWidth = 280;
  const rightWidth = 255;

  doc.rect(30, y, leftWidth, 70).stroke();
  doc.font("bold").fontSize(9).text("Customer Details:-", 35, y + 5);
  doc.font("regular")
    .text(safe(customer?.name), 35, y + 18)
    .text(safe(customer?.address), 35, y + 30, { width: leftWidth - 10 })
    .text(safe(customer?.phone), 35, y + 55);

  doc.rect(30 + leftWidth, y, rightWidth, 70).stroke();
  let ry = y + 5;
  const rx = 30 + leftWidth + 5;
  const labelW = 80;

  doc.font("bold").text("Quote No:", rx, ry);
  doc.font("regular").text(safe(quotationInfo?.number), rx + labelW, ry); ry += 12;
  doc.font("bold").text("Date:", rx, ry);
  doc.font("regular").text(safe(quotationInfo?.date), rx + labelW, ry); ry += 12;
  doc.font("bold").text("Created by:", rx, ry);
  doc.font("regular").text(safe(quotationInfo?.createdBy), rx + labelW, ry); ry += 12;
  doc.font("bold").text("Contact No:", rx, ry);
  doc.font("regular").text(safe(quotationInfo?.contactNo), rx + labelW, ry); ry += 12;
  doc.font("bold").text("GST No:", rx, ry);
  doc.font("regular").text(safe(quotationInfo?.gstNo), rx + labelW, ry);

  /* -----------------------------
     Remarks
  ------------------------------ */
  y += 70;
  doc.rect(30, y, 535, 18).stroke();
  doc.font("bold").fontSize(9).text("Remarks :", 35, y + 5);
  doc.font("regular").text(safe(quotationInfo?.remarks), 85, y + 5);

  /* -----------------------------
     Table config
  ------------------------------ */
  y += 26;
  const col = {
    sr: 30,
    model: 70,
    description: 135,
    image: 300,
    price: 380,
    qty: 450,
    total: 500
  };

  const rowH = 90;

  function drawTableHeader(y) {
    doc.rect(30, y, 535, 18).fill("#d9e1f2");
    doc.fillColor("#000").font("bold").fontSize(9);
    doc.text("Sr.", col.sr, y + 4);
    doc.text("Model No.", col.model, y + 4);
    doc.text("Description", col.description, y + 4);
    doc.text("Image", col.image, y + 4);
    doc.text("Price (₹)", col.price, y + 4);
    doc.text("Qty", col.qty, y + 4);
    doc.text("Total (₹)", col.total, y + 4);
  }

  drawTableHeader(y);
  y += 18;

  /* -----------------------------
     Table rows
  ------------------------------ */
  let srNo = 1;
  let grandTotal = 0;

  for (const item of items) {
    const qty = item.qty ?? 1;
    const lineTotal = item.price * qty;
    grandTotal += lineTotal;

    if (y + rowH > doc.page.height - 80) {
      doc.addPage();
      y = 40;
      drawTableHeader(y);
      y += 18;
    }

    doc.rect(30, y, 535, rowH).stroke();
    doc.font("regular").fontSize(9);

    doc.text(srNo, col.sr + 2, y + 6);
    doc.text(item.model, col.model + 2, y + 6);
   doc.font("regular")
   .fontSize(7) // 🔽 smaller font for specs
   .text(item.description, col.description + 2, y + 6, {
     width: col.image - col.description - 8,
     height: rowH - 12,   // ✅ prevents overflow
     ellipsis: true       // ✅ cuts extra text safely
   });


    if (item.image_url) {
      const img = await fetchImageBuffer(item.image_url);
      if (img) {
        doc.image(img, col.image + 5, y + 6, { fit: [60, 45] });
      } else {
        doc.fontSize(7).text("Image\nNot\nAvailable", col.image + 15, y + 15);
      }
    }

    doc.text(`₹${item.price.toLocaleString()}`, col.price, y + 6);
    doc.text(qty.toString(), col.qty + 10, y + 6);
    doc.text(`₹${lineTotal.toLocaleString()}`, col.total, y + 6);

    y += rowH;
    srNo++;
  }

  /* -----------------------------
     Grand total
  ------------------------------ */
  doc.rect(30, y, 535, 20).stroke();

doc.font("bold").fontSize(11);

// Label
doc.text("Grand Total :", col.qty, y + 4);

// Amount (right-aligned with table edge)
doc.text(
  `₹${grandTotal.toLocaleString()}`,
  col.total,
  y + 4,
  { width: 65, align: "right" }
);

  /* -----------------------------
     Finish
  ------------------------------ */
  doc.end();
  await new Promise((resolve) => doc.on("end", resolve));

  const pdfBuffer = Buffer.concat(buffers);

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=quotation.pdf",
      "Content-Length": pdfBuffer.length.toString()
    }
  });
}
