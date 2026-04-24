import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SearchBar.css';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedTerm, setDebouncedTerm] = useState('');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounce search term
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 300);
        return () => clearTimeout(timerId);
    }, [searchTerm]);

    // Fetch products when debounced term changes
    useEffect(() => {
        const fetchResults = async () => {
            if (!debouncedTerm.trim()) {
                setResults([]);
                setIsOpen(false);
                return;
            }

            try {
                setIsLoading(true);
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products?keyword=${encodeURIComponent(debouncedTerm)}&limit=5`);
                setResults(res.data.products || []);
                setIsOpen(true);
            } catch (error) {
                console.error("Error fetching search results:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [debouncedTerm]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            setIsOpen(false);
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    const handleClear = () => {
        setSearchTerm('');
        setResults([]);
        setIsOpen(false);
    };

    const highlightText = (text, highlight) => {
        if (!highlight.trim()) return text;
        const regex = new RegExp(`(${highlight})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, index) =>
            regex.test(part) ? <span key={`${index}-${part}`} className="search-highlight">{part}</span> : part
        );
    };

    const getImageUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `${import.meta.env.VITE_BACKEND_URL}/${url}`;
    };

    return (
        <div className="search-bar-container" ref={dropdownRef}>
            <form onSubmit={handleSearchSubmit} className="search-form">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        if (!isOpen && e.target.value.trim()) setIsOpen(true);
                    }}
                    onFocus={() => {
                        if (searchTerm.trim()) setIsOpen(true);
                    }}
                />
                {searchTerm && (
                    <button type="button" className="search-clear-btn" onClick={handleClear}>
                        &times;
                    </button>
                )}
            </form>

            {isOpen && searchTerm.trim() && (
                <div className="search-dropdown">
                    {isLoading ? (
                        <div className="search-loading">Loading...</div>
                    ) : results.length > 0 ? (
                        <>
                            <ul className="search-results-list">
                                {results.map((product) => (
                                    <li
                                        key={product._id}
                                        role="button"
                                        tabIndex="0"
                                        onKeyDown={(e) => {
                                            if(e.key === 'Enter' || e.key === ' ') {
                                                setIsOpen(false);
                                                navigate(`/product/${product._id}`);
                                            }
                                        }}
                                        className="search-result-item"
                                        onClick={() => {
                                            setIsOpen(false);
                                            navigate(`/product/${product._id}`);
                                        }}
                                    >
                                        <img
                                            src={getImageUrl(product.imageUrl?.[0])}
                                            alt={product.name}
                                            className="search-result-image"
                                        />
                                        <div className="search-result-info">
                                            <div className="search-result-name">
                                                {highlightText(product.name, debouncedTerm)}
                                            </div>
                                            <div className="search-result-price">${product.price}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div
                                        className="search-see-all"
                                        role="button"
                                        tabIndex="0"
                                        onKeyDown={(e) => {
                                            if(e.key === 'Enter' || e.key === ' ') {
                                                setIsOpen(false);
                                                navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
                                            }
                                        }}
                                        onClick={() => {
                                            setIsOpen(false);
                                            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
                                        }}
                                    >
                                        See all results for "{searchTerm}"
                            </div>
                        </>
                    ) : (
                        <div className="search-no-results">
                            No products found matching "{searchTerm}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
