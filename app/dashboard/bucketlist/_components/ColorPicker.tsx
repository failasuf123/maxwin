const colors = ["#FF5733", "#33C1FF", "#33FF8A", "#FF33EC", "#FFD633", "#A633FF", "#FF3366", "#33FFF2", "#FF9966", "#6C757D"];

export default function ColorPicker({ selected, onSelect }: {
  selected: string;
  onSelect: (color: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color, index) => (
        <button
          key={index}
          className={`w-8 h-8 rounded-full border-2 ${
            selected === color ? 'border-black' : 'border-gray-300'
          }`}
          style={{ backgroundColor: color }}
          onClick={() => onSelect(color)}
        />
      ))}
    </div>
  );
}
