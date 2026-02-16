import { useState, useCallback } from 'react';

export default function SearchBar({ onSearch, placeholder = 'Search projects...' }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = useCallback((value) => {
        setSearchTerm(value);
        onSearch(value);
    }, [onSearch]);

    const clearSearch = () => {
        setSearchTerm('');
        onSearch('');
    };

    return (
        <div className="relative">
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder={placeholder}
                    className="input-field pl-10 pr-10"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    🔍
                </div>
                {searchTerm && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
}
