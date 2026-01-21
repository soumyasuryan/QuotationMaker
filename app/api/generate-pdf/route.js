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

  if (!items || !items.length) {
    return NextResponse.json({ error: "No items provided" }, { status: 400 });
  }

  const safe = (v) => v ?? "";

  /* -----------------------------
     PDF setup
  ------------------------------ */
  const doc = new PDFDocument({ size: "A4", margin: 30 });
  const buffers = [];
  doc.on("data", buffers.push.bind(buffers));

  const pageBottom = doc.page.height - 80;
  const baseRowHeight = 80;

  /* -----------------------------
     Fonts
  ------------------------------ */
  const fontRegular = path.join(process.cwd(), "public/fonts/Roboto-Regular.ttf");
  const fontBold = path.join(process.cwd(), "public/fonts/Roboto-Bold.ttf");

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
  doc.fillColor("#000").font("bold").fontSize(11)
    .text("QUOTATION", 30, y + 4, { width: 535, align: "center" });

  /* -----------------------------
     Customer section
  ------------------------------ */
  y += 24;
  doc.rect(30, y, 280, 70).stroke();
  doc.font("bold").fontSize(9).text("Customer Details:", 35, y + 5);
  doc.font("regular")
    .text(safe(customer?.name), 35, y + 18)
    .text(safe(customer?.address), 35, y + 30, { width: 260 })
    .text(safe(customer?.phone), 35, y + 55);

  doc.rect(310, y, 255, 70).stroke();
  let ry = y + 5;
  const rx = 315;

  doc.font("bold").text("Quote No:", rx, ry);
doc.font("regular").text(safe(quotationInfo?.number), rx + 80, ry); ry += 12;

doc.font("bold").text("Date:", rx, ry);
doc.font("regular").text(safe(quotationInfo?.date), rx + 80, ry); ry += 12;

doc.font("bold").text("Created by:", rx, ry);
doc.font("regular").text(safe(quotationInfo?.createdBy), rx + 80, ry); ry += 12;

doc.font("bold").text("Contact No:", rx, ry);
doc.font("regular").text(safe(quotationInfo?.contactNo), rx + 80, ry); ry += 12;

doc.font("bold").text("GST No:", rx, ry);
doc.font("regular").text(safe(quotationInfo?.gstNo), rx + 80, ry);


  /* -----------------------------
     Table config
  ------------------------------ */
  y += 90;

  const tableLeft = 30;
  const tableWidth = 535;
  const headerH = 18;

  const col = {
    sr: 30,
    model: 70,
    description: 135,
    image: 300,
    price: 380,
    qty: 450,
    total: 500
  };

  const colX = [
    col.sr,
    col.model,
    col.description,
    col.image,
    col.price,
    col.qty,
    col.total,
    tableLeft + tableWidth
  ];

  const colWidth = {
    description: col.image - col.description,
    total: tableLeft + tableWidth - col.total
  };

 function drawTableHeader(y) {
  const headerColor = "#d9e1f2"; // same as QUOTATION title
  const headerTextY = y + (headerH - 9) / 2; // vertical centering

  // Draw header background
  doc.save();
  doc.rect(tableLeft, y, tableWidth, headerH).fill(headerColor);
  doc.restore();

  doc.font("bold").fontSize(9).fillColor("#000");

  doc.text("Sr.", col.sr, headerTextY, {
    width: col.model - col.sr,
    align: "center"
  });

  doc.text("Model No.", col.model, headerTextY, {
    width: col.description - col.model,
    align: "center"
  });

  doc.text("Description", col.description, headerTextY, {
    width: col.image - col.description,
    align: "center"
  });

  doc.text("Image", col.image, headerTextY, {
    width: col.price - col.image,
    align: "center"
  });

  doc.text("Price (₹)", col.price, headerTextY, {
    width: col.qty - col.price,
    align: "center"
  });

  doc.text("Qty", col.qty, headerTextY, {
    width: col.total - col.qty,
    align: "center"
  });

  doc.text("Total (₹)", col.total, headerTextY, {
    width: tableLeft + tableWidth - col.total,
    align: "center"
  });

  // Draw vertical lines
  colX.forEach(x => {
    doc.moveTo(x, y).lineTo(x, y + headerH).stroke();
  });
}

  // -------- Dark top border above table --------
doc.save();
doc.lineWidth(2);
doc.strokeColor("#000");
doc.moveTo(tableLeft, y)
   .lineTo(tableLeft + tableWidth, y)
   .stroke();
doc.restore();


  drawTableHeader(y);
  y += headerH;

  /* -----------------------------
     Table rows
  ------------------------------ */
  let sr = 1;
  let subTotal = 0;

  for (const item of items) {
    const qty = item.qty ?? 1;
    const lineTotal = item.price * qty;
    subTotal += lineTotal;

    const descHeight = doc.heightOfString(item.description || "", {
      width: colWidth.description - 10,
      lineGap: 1
    });

    const rowHeight = Math.max(baseRowHeight, descHeight + 20);

    if (y + rowHeight > pageBottom) {
      doc.addPage();
      y = 40;
      drawTableHeader(y);
      y += headerH;
    }

    doc.rect(tableLeft, y, tableWidth, rowHeight).stroke();
    colX.forEach(x => {
      doc.moveTo(x, y).lineTo(x, y + rowHeight).stroke();
    });

    doc.font("regular").fontSize(9);
    doc.text(sr, col.sr + 5, y + 8);
// -------- Model (wrapped & clipped) --------
const modelWidth = col.description - col.model - 10;

doc.save();
doc.rect(
  col.model + 5,
  y + 8,
  modelWidth,
  rowHeight - 16
).clip();

doc.fontSize(8).text(
  item.model,
  col.model + 5,
  y + 8,
  {
    width: modelWidth,
    lineGap: 1
  }
);
doc.restore();

    doc.save();
    doc.rect(col.description + 5, y + 8, colWidth.description - 10, rowHeight - 16).clip();
    doc.fontSize(7).text(item.description, col.description + 5, y + 8, {
      width: colWidth.description - 10
    });
    doc.restore();

    if (item.image_url) {
      const img = await fetchImageBuffer(item.image_url);
      if (img) {
        doc.image(img, col.image + 10, y + (rowHeight - 60) / 2, {
          fit: [60, 60]
        });
      }
    }

    doc.fontSize(9);
    doc.text(`₹${item.price.toLocaleString()}`, col.price + 5, y + 8);
    doc.text(qty.toString(), col.qty + 10, y + 8);
    doc.text(`₹${lineTotal.toLocaleString()}`, col.total + 5, y + 8);

    y += rowHeight;
    sr++;
  }

  /* -----------------------------
     Totals
  ------------------------------ */
  const gst = subTotal * 0.18;
  const grandTotal = subTotal + gst;

  y += 10;
  doc.font("bold").text("Subtotal:", col.price, y);
  doc.text(`₹${subTotal.toLocaleString()}`, col.total, y);

  y += 12;
  doc.text("GST (18%):", col.price, y);
  doc.text(`₹${gst.toLocaleString()}`, col.total, y);

  y += 16;
  doc.moveTo(col.total, y).lineTo(col.total + colWidth.total, y).stroke();

  y += 10;
  doc.fontSize(10).text("Grand Total:", col.price, y);
  doc.text(`₹${grandTotal.toLocaleString()}`, col.total, y);

  /* -----------------------------
    Footer: Terms + Bank + Stamp
 ------------------------------ */

  // Space check
  if (y + 130 > doc.page.height - 30) {
    doc.addPage();
    y = 40;
  }

  y += 16;

  // Layout
  const leftBlockX = 30;
  const rightBlockX = 360;
  const blockWidth = 300;
  const lineGap = 10;

  /* -------- TERMS -------- */
  doc.font("bold").fontSize(9).text("Terms & Conditions:", leftBlockX, y);

  doc.font("regular").fontSize(8);

  const terms = [
    "1. Payment: 100% advance along with purchase order.",
    "2. Delivery: Ex-showroom Delhi. Cartage / Freight / Insurance extra.",
    "3. Installation: Extra as per destination (Free in Delhi & Gurgaon).",
    "4. Delivery period: Immediate to 30 days from order & advance payment."
  ];

  let ty = y + 12;
  terms.forEach(t => {
    doc.text(t, leftBlockX, ty, { width: blockWidth });
    ty += lineGap;
  });

  /* -------- BANK DETAILS -------- */
  ty += 4;
  doc.font("bold").text("Bank Details:", leftBlockX, ty);
  ty += 10;

  doc.font("regular")
    .text("Bank Name : HDFC Bank Ltd.", leftBlockX, ty); ty += lineGap;
  doc.text("A/c No. : 50200072882882", leftBlockX, ty); ty += lineGap;
  doc.text(
    "Branch & IFSC : Jhandewalan Extn., New Delhi & HDFC0004754",
    leftBlockX,
    ty,
    { width: blockWidth }
  );

  /* -------- STAMP (Bottom Right - Perfectly Aligned) -------- */

  const stampPath = path.join(process.cwd(), "public/stamp.png");

  // Layout constants
  const stampWidth = 60;
  const stampHeight = 60;
  const textWidth = 170;
  const bottomMargin = 40;

  // Bottom-right anchor
  const pageRightX = doc.page.width - doc.page.margins.right;
  const pageBottomY = doc.page.height - doc.page.margins.bottom;

  // Center X for stamp + text
  const centerX = pageRightX - textWidth / 2;

  // Text Y (bottom aligned)
  const authTextY = pageBottomY - 12;

  // Stamp Y (above text)
  const stampY = authTextY - stampHeight - 6;
  const stampX = centerX - stampWidth / 2;

  // Stamp image
  if (fs.existsSync(stampPath)) {
    doc.image(stampPath, stampX, stampY, {
      width: stampWidth,
      height: stampHeight
    });
  }

  // Authorized text
  doc.font("bold")
    .fontSize(9)
    .text(
      "For Veegee Sales Pvt. Ltd.",
      centerX - textWidth / 2,
      authTextY,
      {
        width: textWidth,
        align: "center"
      }
    );



  /* -----------------------------
     Finish
  ------------------------------ */
  doc.end();
  await new Promise(resolve => doc.on("end", resolve));

  const pdfBuffer = Buffer.concat(buffers);

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=quotation.pdf",
      "Content-Length": pdfBuffer.length.toString()
    }
  });
}
