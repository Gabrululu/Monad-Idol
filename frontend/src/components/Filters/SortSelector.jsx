export default function SortSelector({ value, onChange, options }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Sort by:</span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="glass px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer hover:bg-white/20 transition-all border border-monad-border focus:outline-none focus:border-monad-purple"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value} className="bg-monad-card-bg">
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
