import React from "react";

interface PriceFilterProps {
  minPrice: number;
  maxPrice: number;
  value: number;
  onChange: (value: number) => void;
}

const PriceFilter: React.FC<PriceFilterProps> = ({
  minPrice = 0,
  maxPrice = 3000000,
  value,
  onChange,
}) => {
  // Preset harga
  const pricePresets = [
    { label: "Rp 0 - Rp 200.000", value: 200000 },
    { label: "Rp 200.000 - Rp 300.000", value: 300000 },
    { label: "Rp 300.000 - Rp 500.000", value: 500000 },
    { label: "Rp 500.000 - Rp 1.000.000", value: 1000000 },
    { label: "Rp 1.000.000 - Rp 3.000.000", value: 3000000 },
  ];

  // Handle perubahan slider atau input manual
  const handleChange = (newValue: number) => {
    const roundedValue = Math.round(newValue / 1000) * 1000; // Pastikan kelipatan 1.000
    onChange(roundedValue);
  };

  // Handle perubahan preset
  const handlePresetChange = (presetValue: number) => {
    onChange(presetValue);
  };

  return (
    <div className="space-y-4">
      {/* Slider Dinamis */}
      <div>
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={value}
          step={1000}
          onChange={(e) => handleChange(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm mt-1">
          <span>
            {minPrice.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </span>
          <span>
            {maxPrice.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </span>
        </div>
      </div>

      {/* Input Manual */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label htmlFor="cost" className="block text-sm font-medium">
            Biaya
          </label>
          <input
            type="number"
            id="cost"
            value={value}
            step={1000}
            onChange={(e) => handleChange(parseInt(e.target.value))}
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>

      {/* Opsi Kategori Harga (Preset) */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Pilih Rentang Harga:</p>
        <div className="grid grid-cols-2 gap-2">
          {pricePresets.map((preset, index) => (
            <button
              key={index}
              onClick={() => handlePresetChange(preset.value)}
              className={`p-2 border rounded-md text-sm ${
                value === preset.value
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;