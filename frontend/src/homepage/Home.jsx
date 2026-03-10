import React, { useState } from 'react';
import Card from "./card";

const Home = ({ products }) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 className="page-title">Discover Products</h1>
                        <p className="page-subtitle">
                            Explore our curated collection of premium products
                        </p>
                    </div>

                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="btn btn-glass"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius-md)', backgroundColor: isFilterOpen ? 'var(--surface-active)' : 'transparent', borderColor: isFilterOpen ? 'var(--color-accent)' : 'var(--border)' }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="6" r="2"></circle>
                            <line x1="3" y1="6" x2="7" y2="6"></line>
                            <line x1="11" y1="6" x2="21" y2="6"></line>
                            <circle cx="17" cy="12" r="2"></circle>
                            <line x1="3" y1="12" x2="15" y2="12"></line>
                            <line x1="19" y1="12" x2="21" y2="12"></line>
                            <circle cx="11" cy="18" r="2"></circle>
                            <line x1="3" y1="18" x2="9" y2="18"></line>
                            <line x1="13" y1="18" x2="21" y2="18"></line>
                        </svg>
                        Filters
                    </button>
                </div>

                {/* Filter Dropdown Panel */}
                {isFilterOpen && (
                    <div style={{
                        marginTop: '1.5rem',
                        padding: '1.5rem',
                        background: 'var(--navbar-bg)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)',
                        animation: 'fadeInUp 0.3s ease',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
                    }}>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Category Filter */}
                            <div>
                                <h4 style={{ marginBottom: '0.8rem', fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: '600' }}>Category</h4>
                                <div style={{
                                    display: 'flex',
                                    gap: '0.5rem',
                                    flexWrap: 'wrap'
                                }}>
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            style={{
                                                padding: '0.4rem 1.2rem',
                                                borderRadius: '2rem',
                                                border: '1px solid',
                                                borderColor: selectedCategory === cat ? 'var(--color-accent)' : 'var(--border)',
                                                backgroundColor: selectedCategory === cat ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                                                color: selectedCategory === cat ? 'var(--color-accent)' : 'var(--text-secondary)',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                fontSize: '0.85rem',
                                                fontWeight: '500'
                                            }}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                                {/* Sort Filter */}
                                <div style={{ flex: '1 1 200px' }}>
                                    <h4 style={{ marginBottom: '0.8rem', fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: '600' }}>Sort By</h4>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="form-select"
                                        style={{ width: '100%' }}
                                    >
                                        <option value="">Default Sorting</option>
                                        <option value="price_asc">Price: Low to High</option>
                                        <option value="price_desc">Price: High to Low</option>
                                        <option value="newest">Newest Arrivals</option>
                                        <option value="top_rated">Top Rated</option>
                                    </select>
                                </div>

                                {/* Price Filter */}
                                <div style={{ flex: '1 1 300px' }}>
                                    <h4 style={{ marginBottom: '0.8rem', fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: '600' }}>Price Range</h4>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <input
                                            type="number"
                                            placeholder="Min $"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                            className="form-input"
                                            style={{ flex: 1 }}
                                        />
                                        <span style={{ color: 'var(--text-secondary)' }}>to</span>
                                        <input
                                            type="number"
                                            placeholder="Max $"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                            className="form-input"
                                            style={{ flex: 1 }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
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