import React, { useState } from 'react';
import Card from "./card";

const Home = ({ products }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');

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

    const filteredProducts = selectedCategory === 'All'
        ? products
        : products.filter(p => p.category === selectedCategory);

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