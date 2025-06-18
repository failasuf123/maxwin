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
import { useEffect, useState, useMemo, useRef } from "react";
import {  ExpendingItem, Itinerary, Todo, ItineraryPerDay} from "../../_utils/typings";
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react";

type ItineraryDaysData = Itinerary["itineraries"];



interface TableCostEstimationProps {
  costData: ExpendingItem[];
  setCostData: React.Dispatch<React.SetStateAction<ExpendingItem[]>>;
  daysData: ItineraryDaysData;
}

// Tipe untuk kategori pengeluaran baru
type ExpenditureCategory = 
  | "Makan & minum" 
  | "Belanja" 
  | "Transportasi"
  | "Gaya hidup" 
  | "Cadangan"
  | "Lain-lain";

export function TableCostEstimation({ costData, setCostData, daysData }: TableCostEstimationProps) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    budgetName: "",
    budget: 0,
    category: "Makan & minum" as ExpenditureCategory,
    day: "1"
  });
  const [expandedDays, setExpandedDays] = useState<number[]>([]);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   // Expand first day by default
  //   if (daysData.length > 0 && expandedDays.length === 0) {
  //     setExpandedDays([1]);
  //   }
  // }, [daysData, expandedDays.length]);

  

  // Focus input when modal opens
  useEffect(() => {
    if (showModal && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [showModal]);

  // Toggle day expansion
  // const toggleDay = (day: number) => {
  //   if (expandedDays.includes(day)) {
  //     setExpandedDays(expandedDays.filter(d => d !== day));
  //   } else {
  //     setExpandedDays([...expandedDays, day]);
  //   }
  // };

  const toggleDay = (day: number) => {
    setExpandedDays(prev => {
      if (prev.includes(day)) {
        // Tutup hari ini jika sudah terbuka
        return prev.filter(d => d !== day);
      } else {
        // Buka hari ini
        return [...prev, day];
      }
    });
  };

  const handleAddBudget = () => {
    if (!formData.budgetName || formData.budget <= 0) return;
    
    const newItem: ExpendingItem = {
      id: Math.random().toString(36).substr(2, 9),
      budgetName: formData.budgetName,
      budget: formData.budget,
      category: formData.category,
      index: "",
      day: formData.day,
      keterangan: "" // Kolom ini bisa dihapus jika tidak digunakan
    };
    
    setCostData(prev => [...prev, newItem]);
    setFormData({ 
      budgetName: "", 
      budget: 0, 
      category: "Makan & minum",
      day: formData.day
    });
    setShowModal(false);
  };

  const handleDelete = (idToDelete: string) => {
    setCostData(prev => prev.filter(item => item.id !== idToDelete));
  };

  // Add amount to budget
  const addAmount = (amount: number) => {
    setFormData(prev => ({
      ...prev,
      budget: prev.budget + amount
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      budgetName: "",
      budget: 0,
      category: "Makan & minum",
      day: formData.day
    });
  };

  // Calculate totals per day
  const dayTotals = useMemo(() => {
    return daysData.map(day => {
      const itineraryCost = day.todos.reduce((sum, todo) => sum + (todo.cost || 0), 0);
      const additionalCosts = costData
        .filter(item => item.day === day.day.toString())
        .reduce((sum, item) => sum + item.budget, 0);
      
      return {
        day: day.day,
        total: itineraryCost + additionalCosts
      };
    });
  }, [daysData, costData]);

  // Calculate overall total
  const totalBudget = useMemo(() => {
    return dayTotals.reduce((sum, dayTotal) => sum + dayTotal.total, 0);
  }, [dayTotals]);

  return (
    <div className="flex flex-col gap-4">
      <div className="text-gray-500 text-[10px] md:text-xs">
        Perhitungan estimasi pengeluaran anda selama liburan
      </div>

      {daysData.map(day => {
        // Get additional costs for this day
        const dayAdditionalCosts = costData.filter(item => 
          item.day === day.day.toString()
        );
        
        // Combine todos and additional costs
        const allItems = [
          ...day.todos.map(todo => ({
            type: "itinerary" as const,
            ...todo
          })),
          ...dayAdditionalCosts.map(item => ({
            type: "additional" as const,
            ...item
          }))
        ];
        
        return (
          <div key={day.uniqueId} className="border rounded-lg overflow-hidden">
            <div 
              className="flex justify-between items-center p-3 bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => toggleDay(day.day)}
            >
              <div className="font-semibold flex items-center gap-2">
                Hari {day.day}
                {expandedDays.includes(day.day) ? 
                  <ChevronUp size={16} /> : 
                  <ChevronDown size={16} />
                }
              </div>
              <div className="text-sm">
                Total: {dayTotals.find(d => d.day === day.day)?.total.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0
                })}
              </div>
            </div>
            
            {expandedDays.includes(day.day) && (
              <div className="p-1">
                <Table className="text-[10px] md:text-base">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">No</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead className="text-center">Kategori</TableHead>
                      <TableHead className="text-right">Budget</TableHead>
                      {/* <TableHead className="text-center">Aksi</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody className="font-normal">
                    {allItems.map((item, index) => (
                      <TableRow key={item.type === "itinerary" ? item.uniqueId || index : item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          {item.type === "itinerary" ? item.nameTodo : item.budgetName}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.type === "itinerary" ? 
                            (item.typeTodo === "hotel" ? "Hotel" : 
                             item.typeTodo === "activity" ? "Wisata" : 
                             "Transportasi") : 
                            item.category}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.type === "itinerary" ? 
                            (item.cost !== undefined ? 
                              item.cost.toLocaleString("id-ID", { 
                                style: "currency", 
                                currency: "IDR",
                                minimumFractionDigits: 0 
                              }) : '-'
                            ) : 
                            item.budget.toLocaleString("id-ID", { 
                              style: "currency", 
                              currency: "IDR",
                              minimumFractionDigits: 0 
                            })
                          }
                        </TableCell>
                        <TableCell className="text-center">
                          {item.type === "additional" && (
                            <button
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDelete(item.id)}
                            >
                              <X size={16} />
                            </button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="flex justify-center items-center mt-2">
                  <button
                    onClick={() => {
                      setFormData(prev => ({ 
                        ...prev, 
                        day: day.day.toString(),
                        budgetName: "",
                        budget: 0,
                        category: "Makan & minum"
                      }));
                      setShowModal(true);
                    }}
                    className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 md:px-4 md:py-2 rounded-lg text-xs md:text-sm"
                  >
                    <Plus size={14} />
                    Tambah Biaya
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div className="mt-4 p-3 bg-gray-100 rounded-lg">
        <div className="flex justify-between items-center">
          <div className="font-semibold">Total Keseluruhan</div>
          <div className="text-sm md:text-base font-semibold text-black">
            {totalBudget.toLocaleString("id-ID", { 
              style: "currency", 
              currency: "IDR",
              minimumFractionDigits: 0 
            })}
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                Tambah Biaya untuk Hari {formData.day}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-xs md:text-sm font-medium mb-1">
                  Nama Biaya
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  placeholder="Contoh: Makan siang, Tiket kereta, dll"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.budgetName}
                  onChange={(e) => setFormData({ ...formData, budgetName: e.target.value })}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-xs  md:text-sm font-medium mb-1">
                  Kategori
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    category: e.target.value as ExpenditureCategory 
                  })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Makan & minum">Makan & minum</option>
                  <option value="transportation">Transportasi</option>
                  <option value="Belanja">Belanja</option>
                  <option value="Gaya hidup">Gaya hidup</option>
                  <option value="Cadangan">Cadangan</option>
                  <option value="Lain-lain">Lain-lain</option>
                </select>
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
                  {[10000, 20000, 50000, 100000].map(amount => (
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
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}