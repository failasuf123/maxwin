const icons = ["✈️", "🏔️", "🌊", "📚", "🎨", "🎵", "🍽️", "🎬", "🚲", "🎮"];

export default function IconPicker({ selected, onSelect }: {
  selected: string;
  onSelect: (icon: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {icons.map((icon, index) => (
        <button
          key={index}
          className={`text-xl p-2 rounded border ${
            selected === icon ? 'bg-gray-200 border-black' : 'border-gray-300'
          }`}
          onClick={() => onSelect(icon)}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}
