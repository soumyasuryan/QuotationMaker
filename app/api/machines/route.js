import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const normalize = str =>
  (str || "").toLowerCase().replace(/[^a-z0-9]/g, "");

const extractPrice = mrp =>
  Number(String(mrp).replace(/[^\d]/g, ""));

export async function GET(req) {
  try {
    const filePath = path.join(
      process.cwd(),
      "data",
      "cosco_machines.json"
    );

    const machines = JSON.parse(
      fs.readFileSync(filePath, "utf-8")
    );

    const { searchParams } = new URL(req.url);
    const model = searchParams.get("model") || "";

    // 🔍 Filter by model code
    const filtered = machines
      .filter(m =>
        normalize(m.model_code).includes(normalize(model))
      )
      .map(m => ({
        model_number: m.model_code,
        name: m.name,
        price: extractPrice(m.mrp),
        image_url: m.image_url,
        specifications: m.specifications
      }));

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("❌ API ERROR:", error);
    return NextResponse.json([], { status: 500 });
  }
}

