import React, { useState } from 'react';
import Card from "./card";

const Home = ({ products }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const categories = [
        'All',
        'Electronics',
        'Fashion',
        'Home & Kitchen',
        'Beauty & Personal Care',
        'Sports & Outdoors',
        'Books',
        'Toys & Games',
        'Other'
    ];

    let filteredProducts = selectedCategory === 'All'
        ? [...products]
        : products.filter(p => p.category === selectedCategory);

    // Apply price filter
    if (minPrice !== '') {
        filteredProducts = filteredProducts.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice !== '') {
        filteredProducts = filteredProducts.filter(p => p.price <= Number(maxPrice));
    }

    // Apply sorting
    if (sortBy === 'price_asc') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
        // Fallback to _id if createdAt is missing, as ObjectIds contain timestamps
        filteredProducts.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(parseInt(a._id.substring(0, 8), 16) * 1000);
            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(parseInt(b._id.substring(0, 8), 16) * 1000);
            return dateB - dateA;
        });
    } else if (sortBy === 'top_rated') {
        filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return (
        <div className="page-container">
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="page-title">Discover Products</h1>
                <p className="page-subtitle">
                    Explore our curated collection of premium products
                </p>

                {/* Category Filter */}
                <div className="category-filter-container" style={{
                    display: 'flex',
                    gap: '0.75rem',
                    overflowX: 'auto',
                    padding: '1rem 0',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            style={{
                                padding: '0.5rem 1.25rem',
                                borderRadius: '2rem',
                                border: '1px solid var(--border-color)',
                                backgroundColor: selectedCategory === cat ? 'var(--primary-color)' : 'transparent',
                                color: selectedCategory === cat ? 'white' : 'var(--text-color)',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s ease',
                                fontSize: '0.9rem',
                                fontWeight: '500'
                            }}
                            className="category-btn"
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Sort & Filter Controls (Client-side) */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
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
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="form-input"
                            style={{ width: '100px' }}
                        />
                        <span style={{ color: 'var(--text-secondary)' }}>-</span>
                        <input
                            type="number"
                            placeholder="Max $"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="form-input"
                            style={{ width: '100px' }}
                        />
                    </div>
                </div>
            </div>

            <div className="products-grid">
                {filteredProducts && filteredProducts.length > 0 ? (
                    filteredProducts.map((prod, index) => (
                        <div key={prod._id} style={{ animationDelay: `${index * 0.05}s` }}>
                            <Card
                                id={prod._id}
                                name={prod.name}
                                image={prod.imageUrl[0]}
                                description={prod.description}
                                price={prod.price}
                                showDetailsLink={true}
                                fullProduct={prod}
                            />
                        </div>
                    ))
                ) : (
                    <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                        <div className="empty-state-icon">—</div>
                        <h3 className="empty-state-title">No products found</h3>
                        <p className="empty-state-text">Try selecting a different category or check back later</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;