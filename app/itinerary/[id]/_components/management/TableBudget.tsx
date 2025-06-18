"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState, useRef, useEffect } from "react";
import { BudgetItem } from "../../_utils/typings";
import { Plus, X } from "lucide-react";

interface TableBudgetProps {
  budgetData: BudgetItem[];
  setBudgetData: React.Dispatch<React.SetStateAction<BudgetItem[]>>;
}

export function TableBudget({ budgetData, setBudgetData }: TableBudgetProps) {
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    budgetName: "",
    budget: 0,
    keterangan: "",
  })
  const nameInputRef = useRef<HTMLInputElement>(null)

  // Focus input when modal opens
  useEffect(() => {
    if (showModal && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [showModal]);

  const handleAddBudget = () => {
    if (!formData.budgetName || formData.budget <= 0) return
    
    const newItem: BudgetItem = {
      id: Math.random().toString(36).substr(2, 9),
      budgetName: formData.budgetName,
      budget: formData.budget,
      keterangan: formData.keterangan,
      index: ""
    }
    
    setBudgetData(prev => [...prev, newItem])
    setFormData({ budgetName: "", budget: 0, keterangan: "" })
    setShowModal(false)
  }

  const handleDelete = (idToDelete: string) => {
    setBudgetData(prev => prev.filter(item => item.id !== idToDelete))
  }

  // Add amount to budget
  const addAmount = (amount: number) => {
    setFormData(prev => ({
      ...prev,
      budget: prev.budget + amount
    }))
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      budgetName: "",
      budget: 0,
      keterangan: ""
    })
  }

  const totalBudget = budgetData.reduce((sum, item) => sum + item.budget, 0)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center justify-between">
        <div className="text-gray-500 text-[10px] md:text-xs">
           Masukan budget perjalanan anda
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1 bg-gray-800 text-[9px] md:text-sm text-white px-2 py-2 rounded-lg hover:bg-gray-700"
        >
          <Plus size={14} />
          <span>Pemasukan</span>
        </button>
      </div>

      <Table className="text-[10px] md:text-base">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">No</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Keterangan</TableHead>
            <TableHead className="text-right">Budget</TableHead>
            {/* <TableHead className="text-center">Aksi</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {budgetData.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.budgetName}</TableCell>
              <TableCell>{item.keterangan}</TableCell>
              <TableCell className="text-right">
                {item.budget.toLocaleString("id-ID", { 
                  style: "currency", 
                  currency: "IDR",
                  minimumFractionDigits: 0 
                })}
              </TableCell>
              <TableCell className="text-center">
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(item.id)}
                >
                  <X size={16} />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right font-semibold">
              {totalBudget.toLocaleString("id-ID", { 
                style: "currency", 
                currency: "IDR",
                minimumFractionDigits: 0 
              })}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>

      {/* Modal - Desain Baru */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Tambah Pemasukan</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Nama Pemasukan
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  placeholder="Contoh: Tabungan, Bonus, dll"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.budgetName}
                  onChange={(e) => setFormData({ ...formData, budgetName: e.target.value })}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Jumlah
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium">Rp</span>
                  <input
                    type="number"
                    placeholder="0"
                    className="flex-1 p-3 border rounded-lg text-lg font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.budget || ""}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      budget: Number(e.target.value) 
                    })}
                    min="0"
                  />
                </div>
                
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {[5000, 10000, 20000, 100000, 500000, 2000000].map(amount => (
                    <button
                      key={amount}
                      type="button"
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                      onClick={() => addAmount(amount)}
                    >
                      + {amount.toLocaleString("id-ID")}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Keterangan (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Untuk hari ke-1, Dana darurat, dll"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                />
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 flex justify-between">
              <button
                onClick={resetForm}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Reset
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  onClick={handleAddBudget}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                  disabled={!formData.budgetName || formData.budget <= 0}
                >
                  Tambah
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}