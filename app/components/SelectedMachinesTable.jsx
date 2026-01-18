"use client";
import Image from "next/image";
import { useEffect } from "react";


export default function SelectedMachinesTable({ items, setItems }) {
  function increaseQty(model) {
    setItems(items =>
      items.map(item =>
        item.model_number === model
          ? { ...item, qty: item.qty + 1 }
          : item
      )
    );
  }

  function decreaseQty(model) {
    setItems(items =>
      items
        .map(item =>
          item.model_number === model
            ? { ...item, qty: item.qty - 1 }
            : item
        )
        .filter(item => item.qty > 0)
    );
  }
  function changeMargin(model, value) {
    const margin = Number(value) || 0;

    setItems(items =>
      items.map(item =>
        item.model_number === model
          ? { ...item, margin }
          : item
      )
    );
  }


  function removeItem(model) {
    setItems(items =>
      items.filter(item => item.model_number !== model)
    );
  }

  const grandTotal = items.reduce(
    (sum, item) =>
      sum + (item.price + (item.margin * item.price) / 100) * item.qty,
    0
  );

  useEffect(() => {
    setItems(items =>
      items.map(item => ({
        ...item,
        margin: item.margin ?? 0,
      }))
    );
  }, []);
  if (!items.length) {
    return (
      <p className="mt-6 text-gray-500">
        No machines added to quotation yet.
      </p>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">
        Selected Machines
      </h2>

      <div className="overflow-x-auto ">
        <table className="w-full border text-sm border-4 rounded-xl border-gray-600">
          <thead className="bg-gray-100 ">
            <tr className="text-gray-100 bg-gray-800/80 ">
              <th className="border p-2">Model</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Image</th>
              <th className="border p-2 text-right">Price (₹)</th>
              <th className="border p-2 text-center">Qty</th>
              <th className="border p-2 text-center">Margin</th>
              <th className="border p-2 text-right">Subtotal (₹)</th>
              <th className="border p-2 text-center">Remove</th>
            </tr>
          </thead>

          <tbody className="">
            {items.map(item => (
              <tr key={item.model_number} className="bg-gray-100 text-black">
                <td className="border p-2">
                  {item.model_number}
                </td>

                <td className="border p-2">
                  {item.name}
                </td>
                <td className="border p-2">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-16 w-16 object-contain mx-auto"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-16 w-16 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                      No Image
                    </div>
                  )}
                </td>


                <td className="border p-2 text-right">
                  ₹{item.price.toLocaleString()}
                </td>

                <td className="border p-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() =>
                        decreaseQty(item.model_number)
                      }
                      className="px-2 border"
                    >
                      −
                    </button>

                    <span>{item.qty}</span>

                    <button
                      onClick={() =>
                        increaseQty(item.model_number)
                      }
                      className="px-2 border"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="border p-2 text-center">
                  <input
                    type="number"
                    className="w-16 rounded-sm border p-1 text-right"
                    value={item.margin || 0}
                    onChange={(e) =>
                      changeMargin(item.model_number, e.target.value)
                    }
                    placeholder="%"
                  />
                </td>



                <td className="border p-2 text-right">
                  ₹{((item.price + (item.margin * item.price) / 100) * item.qty).toLocaleString()}
                </td>


                <td className="border p-2 text-center">
                  <button
                    onClick={() =>
                      removeItem(item.model_number)
                    }
                    className="text-red-600"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr className="bg-gray-100 font-semibold text-gray-700">
              <td colSpan="6" className="border p-2 text-right">
                Grand Total
              </td>
              <td className="border p-2 text-right">
                ₹{grandTotal.toLocaleString()}
              </td>
              <td className="border p-2" />
            </tr>
          </tfoot>

        </table>
      </div>
      {/* <div className="flex justify-start">
        <button className="mt-4 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-100 hover:text-black border-1">Edit</button>
      </div> */}
    </div>
  );
}
