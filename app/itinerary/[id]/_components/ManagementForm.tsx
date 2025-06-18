import React, { useState, useMemo } from "react";
import { TableBudget } from "./management/TableBudget";
import { BudgetItem, City, ExpendingItem, ItineraryPerDay } from "../_utils/typings";
import { TableCostEstimation } from "./management/TableCostEstimation";
import { GiCash, GiPayMoney, GiTakeMyMoney } from "react-icons/gi";
import { FaArrowDownShortWide } from "react-icons/fa6";
import {
  MdModeOfTravel,
  MdHotel,
  MdTrain,
  MdFastfood,
  MdOutlineNightlife,
  MdShoppingCart,
} from "react-icons/md";
import { BsCashCoin } from "react-icons/bs";

type ItineraryDaysData = ItineraryPerDay[];

interface ManagementFormProps {
  daysData: ItineraryDaysData;
  cities: City[] | undefined;
  budgetData: BudgetItem[];
  setBudgetData: React.Dispatch<React.SetStateAction<BudgetItem[]>>;
  costData: ExpendingItem[];
  setCostData: React.Dispatch<React.SetStateAction<ExpendingItem[]>>;
}

// Tipe untuk kategori yang diizinkan
type CategoryKey = 
  | "Wisata" 
  | "Hotel" 
  | "Transportasi" 
  | "Makan & minum" 
  | "Belanja" 
  | "Gaya hidup" 
  | "Cadangan" 
  | "Lain-lain";

interface CategoryData {
  amount: number;
  count: number;
}

type CategoryExpenses = {
  [key in CategoryKey]: CategoryData;
};

function ManagementForm({
  cities,
  daysData,
  budgetData,
  setBudgetData,
  costData,
  setCostData,
}: ManagementFormProps) {
  const [detailOpen, setDetailOpen] = useState(false);
  const toggleDetail = () => setDetailOpen((prev) => !prev);

  // Menghitung total budget dari semua sumber dana
  const totalBudget = useMemo(() => {
    return budgetData.reduce((sum, item) => sum + (item.budget || 0), 0);
  }, [budgetData]);

  // Menghitung total pengeluaran
  const totalExpense = useMemo(() => {
    // Pengeluaran dari itinerary (aktivitas & hotel)
    const itineraryExpenses = daysData.flatMap(day => 
      day.todos
        .filter(todo => todo.isPayable && todo.cost)
        .map(todo => todo.cost || 0)
    ).reduce((sum, cost) => sum + cost, 0);
    
    // Pengeluaran dari estimasi biaya
    const costEstimation = costData.reduce((sum, item) => sum + (item.budget || 0), 0);
    
    return itineraryExpenses + costEstimation;
  }, [daysData, costData]);

  // Menghitung pengeluaran per kategori
  const categoryExpenses = useMemo<CategoryExpenses>(() => {
    // Inisialisasi objek kategori dengan tipe yang ketat
    const categories: CategoryExpenses = {
      "Wisata": { amount: 0, count: 0 },
      "Hotel": { amount: 0, count: 0 },
      "Transportasi": { amount: 0, count: 0 },
      "Makan & minum": { amount: 0, count: 0 },
      "Belanja": { amount: 0, count: 0 },
      "Gaya hidup": { amount: 0, count: 0 },
      "Cadangan": { amount: 0, count: 0 },
      "Lain-lain": { amount: 0, count: 0 },
    };

    // Hitung pengeluaran dari itinerary
    daysData.forEach(day => {
      day.todos.forEach(todo => {
        if (!todo.isPayable || !todo.cost) return;
        
        if (todo.typeTodo === "activity") {
          categories["Wisata"].amount += todo.cost;
          categories["Wisata"].count++;
        } else if (todo.typeTodo === "hotel") {
          categories["Hotel"].amount += todo.cost;
          categories["Hotel"].count++;
        } else if (todo.typeTodo === "transportation") {
          categories["Transportasi"].amount += todo.cost;
          categories["Transportasi"].count++;
        }
      });
    });

    // Hitung pengeluaran dari estimasi biaya
    costData.forEach(item => {
      const category = item.category as CategoryKey;
      
      // Jika kategori valid, tambahkan ke kategori tersebut
      if (category && Object.keys(categories).includes(category)) {
        categories[category].amount += item.budget || 0;
        categories[category].count++;
      } else {
        // Default untuk item tanpa kategori atau kategori tidak valid
        categories["Lain-lain"].amount += item.budget || 0;
        categories["Lain-lain"].count++;
      }
    });

    return categories;
  }, [daysData, costData]);

  // Format angka ke format Rupiah
  const formatRupiah = (amount: number) => {
    return amount.toLocaleString("id-ID");
  };

  // Fungsi untuk mendapatkan ikon berdasarkan kategori
  const getCategoryIcon = (category: CategoryKey) => {
    switch(category) {
      case "Wisata": return <MdModeOfTravel />;
      case "Hotel": return <MdHotel />;
      case "Transportasi": return <MdTrain />;
      case "Makan & minum": return <MdFastfood />;
      case "Belanja": return <MdShoppingCart />;
      case "Gaya hidup": return <MdOutlineNightlife />;
      case "Cadangan": return <BsCashCoin />;
      case "Lain-lain": return <GiCash />;
      default: return <GiCash />;
    }
  };

  return (
    <div className="w-full pb-24 pt-1 md:pb-6 md:pt-6 w-full flex flex-col gap-5 md:gap-10">
      <div>
        <div className="flex flex-row justify-between w-full items-center">
          <div className="mb-2 font-semibold">Ringkasan</div>
          <div className="w-full items-center flex flex-row justify-end mt-2 md:mt-3">
            <div
              onClick={toggleDetail}
              className="px-2 py-1 md:px-3 rounded-xl bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-800 flex flex-row gap-1 items-center"
            >
              Detail <FaArrowDownShortWide />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mt-1 md:mt-2">
          <div className="w-full flex flex-row items-center justify-between text-xs md:text-base">
            <div className="flex flex-col gap-1 item-center justify-center">
              <div className="flex flex-row gap-1 items-center">
                <GiTakeMyMoney /> Budget
              </div>
              <div>Rp {formatRupiah(totalBudget)}</div>
            </div>
            <div className="flex flex-col gap-1 item-center justify-center">
              <div className="flex flex-row gap-1 items-center">
                <GiPayMoney />
                Pengeluaran
              </div>
              <div>Rp {formatRupiah(totalExpense)}</div>
            </div>

            <div className="flex flex-col gap-1 item-center justify-center">
              <div className="flex flex-row gap-1 items-center">~</div>
              <div>
                {totalBudget >= totalExpense ? "(+) " : "(-) "}
                Rp {formatRupiah(Math.abs(totalBudget - totalExpense))}
              </div>
            </div>
          </div>
        </div>

        {detailOpen && (
          <div className="mt-1 md:mt-3 w-full bg-gray-100 flex flex-col rounded px-4 py-2 gap-1 md:gap-2 text-[10px] md:text-xs">
            {Object.entries(categoryExpenses).map(([category, data]) => (
              <div 
                key={category} 
                className="flex w-full flex-row items-center justify-between"
              >
                <div className="flex flex-row gap-1 items-center">
                  {getCategoryIcon(category as CategoryKey)}
                  <div>{category}</div>
                  <div>({data.count})</div>
                </div>
                <div>Rp {formatRupiah(data.amount)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <hr className="w-full bg-gray-200" />

      <div>
        <div className=" font-semibold">Budget Trip</div>
        <TableBudget budgetData={budgetData} setBudgetData={setBudgetData} />
      </div>

      <hr className="w-full bg-gray-200" />

      <div className="mb-2 font-semibold">
        Estimasi Pengeluaran
        <TableCostEstimation
          costData={costData}
          setCostData={setCostData}
          daysData={daysData}
        />
      </div>
    </div>
  );
}

export default ManagementForm;