"use client";
import { useState } from "react";
import MachineSearch from "../components/MachineSearch";
import SelectedMachinesTable from "../components/SelectedMachinesTable";
import GeneratePdfButton from "../components/GeneratePdfButton";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function QuotationMaker() {
  const [selected, setSelected] = useState([]);

  function addMachine(machine) {
    const exists = selected.find(
      m => m.model_number === machine.model_number
    );

    if (exists) {
      setSelected(
        selected.map(m =>
          m.model_number === machine.model_number
            ? { ...m, qty: m.qty + 1 }
            : m
        )
      );
    } else {
      setSelected([...selected, { ...machine, qty: 1 }]);
    }
  }

  return (
    <div>
        <Navbar></Navbar>
    <div className="p-6 max-w-5xl mx-auto ">
        
      <h1 className="text-4xl mb-4 text-center"> <span className="text-gray-300 mb-20">Quotation</span> Maker</h1>

      <MachineSearch onAdd={addMachine} />

      <SelectedMachinesTable
        items={selected}
        setItems={setSelected}
      />
      {/* <div>
        <input type="text" placeholder="Created By:" />
        <input type="text" placeholder=""/>
        <input type="text" />
        <input type="text" />
      </div> */}
      <GeneratePdfButton items={selected} />
      <div className="mb-10"></div>
    </div>
    <Footer></Footer>
    </div>
  );
}
