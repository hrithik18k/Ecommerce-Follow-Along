import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Card from '../homepage/card';
import './SearchResultsPage.css';

const SearchResultsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const pageParam = parseInt(searchParams.get('page')) || 1;
    const sortParam = searchParams.get('sort') || '';
    const minPriceParam = searchParams.get('minPrice') || '';
    const maxPriceParam = searchParams.get('maxPrice') || '';

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // UI states for filter (allows user to type before applying)
    const [minPriceInput, setMinPriceInput] = useState(minPriceParam);
    const [maxPriceInput, setMaxPriceInput] = useState(maxPriceParam);

    // Pagination state
    const [page, setPage] = useState(pageParam);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    useEffect(() => {
        setPage(pageParam);
    }, [pageParam]);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setProducts([]);
                setTotalResults(0);
                return;
            }

            try {
                setIsLoading(true);
                setError('');

                let fetchUrl = `${import.meta.env.VITE_BACKEND_URL}/api/products?keyword=${encodeURIComponent(query)}&page=${page}&limit=10`;
                if (sortParam) fetchUrl += `&sort=${sortParam}`;
                if (minPriceParam) fetchUrl += `&minPrice=${minPriceParam}`;
                if (maxPriceParam) fetchUrl += `&maxPrice=${maxPriceParam}`;

                const res = await axios.get(fetchUrl);
                setProducts(res.data.products || []);
                setTotalPages(res.data.pages || 1);
                setTotalResults(res.data.total || 0);
            } catch (err) {
                console.error("Error fetching search results:", err);
                setError('Failed to load search results. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [query, page, sortParam, minPriceParam, maxPriceParam]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            updateSearchParams({ page: newPage });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const updateSearchParams = (newParams) => {
        const params = new URLSearchParams(searchParams);
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === '' || value === null) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        // reset to page 1 if changing filters/sort, unless page was explicitly passed
        if (!newParams.page) {
            params.set('page', 1);
        }
        setSearchParams(params);
    };

    const handleApplyFilters = () => {
        updateSearchParams({ minPrice: minPriceInput, maxPrice: maxPriceInput });
    };

    return (
        <div className="page-container search-results-page">
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="page-title">Search Results</h1>
                <p className="page-subtitle">
                    {query ? `Showing results for "${query}"` : 'Enter a search term'}
                </p>
                {query && !isLoading && (
                    <p className="search-meta">
                        Found {totalResults} result{totalResults !== 1 ? 's' : ''}
                    </p>
                )}
            </div>

            {/* Sort & Filter Controls (Backend-driven) */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '2rem' }}>
                <select
                    value={sortParam}
                    onChange={(e) => updateSearchParams({ sort: e.target.value })}
                    className="form-input"
                    style={{ width: 'auto', flex: '1 1 200px' }}
                >
                    <option value="">Sort By...</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="newest">Newest Arrivals</option>
                    <option value="top_rated">Top Rated</option>
                </select>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flex: '1 1 300px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Price Range:</span>
                    <input
                        type="number"
                        placeholder="Min $"
                        value={minPriceInput}
                        onChange={(e) => setMinPriceInput(e.target.value)}
                        className="form-input"
                        style={{ width: '100px' }}
                    />
                    <span style={{ color: 'var(--text-secondary)' }}>-</span>
                    <input
                        type="number"
                        placeholder="Max $"
                        value={maxPriceInput}
                        onChange={(e) => setMaxPriceInput(e.target.value)}
                        className="form-input"
                        style={{ width: '100px' }}
                    />
                    <button
                        onClick={handleApplyFilters}
                        style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-accent)', background: 'transparent', color: 'var(--color-accent)', cursor: 'pointer' }}
                    >
                        Apply
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="search-results-loading">
                    <div className="loading-spinner"></div>
                    <p>Searching...</p>
                </div>
            ) : error ? (
                <div className="empty-state">
                    <div className="empty-state-icon">⚠️</div>
                    <h3 className="empty-state-title">Error</h3>
                    <p className="empty-state-text">{error}</p>
                </div>
            ) : products.length > 0 ? (
                <>
                    <div className="products-grid">
                        {products.map((prod, index) => (
                            <div key={prod._id} style={{ animationDelay: `${index * 0.05}s` }}>
                                <Card
                                    id={prod._id}
                                    name={prod.name}
                                    image={prod.imageUrl?.[0]}
                                    description={prod.description}
                                    price={prod.price}
                                    showDetailsLink={true}
                                    fullProduct={prod}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="pagination-container">
                            <button
                                className="pagination-btn"
                                disabled={page === 1}
                                onClick={() => handlePageChange(page - 1)}
                            >
                                Previous
                            </button>

                            <span className="pagination-info">
                                Page {page} of {totalPages}
                            </span>

                            <button
                                className="pagination-btn"
                                disabled={page === totalPages}
                                onClick={() => handlePageChange(page + 1)}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="empty-state">
                    <div className="empty-state-icon">🔍</div>
                    <h3 className="empty-state-title">No products found</h3>
                    <p className="empty-state-text">
                        We couldn't find any products matching "{query}". Try checking your spelling or use more general terms.
                    </p>
                </div>
            )}
        </div>
    );
};

export default SearchResultsPage;
