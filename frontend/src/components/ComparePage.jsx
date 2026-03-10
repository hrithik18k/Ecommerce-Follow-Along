import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeCompareProduct } from '../store/compareSlice';

const ComparePage = () => {
    const selectedProducts = useSelector(state => state.compare.selectedProducts);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    if (selectedProducts.length === 0) {
        return (
            <div className="page-container" style={{ textAlign: 'center', marginTop: '4rem' }}>
                <h2>No Products Selected for Comparison</h2>
                <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>
                    Browse Products
                </button>
            </div>
        );
    }

    return (
        <div className="page-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1 className="page-title">Compare Products</h1>
            <p className="page-subtitle">See how your selected products stack up against each other.</p>

            <div style={{ overflowX: 'auto', marginTop: '2rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)', width: '20%' }}>Features</th>
                            {selectedProducts.map(prod => (
                                <th key={`header-${prod._id}`} style={{ padding: '1rem', borderBottom: '1px solid var(--border)', width: `${80 / selectedProducts.length}%`, textAlign: 'center' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                        <img
                                            src={prod.imageUrl[0].startsWith('http') ? prod.imageUrl[0] : `${import.meta.env.VITE_BACKEND_URL}/${prod.imageUrl[0]}`}
                                            alt={prod.name}
                                            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                                        />
                                        <h3 style={{ fontSize: '1rem', margin: 0 }}>{prod.name}</h3>
                                        <button
                                            onClick={() => dispatch(removeCompareProduct(prod._id))}
                                            style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', fontSize: '0.85rem' }}
                                        >Remove</button>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: 'bold' }}>Price</td>
                            {selectedProducts.map(prod => (
                                <td key={`price-${prod._id}`} style={{ padding: '1rem', borderBottom: '1px solid var(--border)', textAlign: 'center', fontSize: '1.2rem', color: 'var(--color-accent)' }}>
                                    ${prod.price.toFixed(2)}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: 'bold' }}>Category</td>
                            {selectedProducts.map(prod => (
                                <td key={`cat-${prod._id}`} style={{ padding: '1rem', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                                    {prod.category}
                                </td>
                            ))}
                        </tr>
                        {/* If we have ratings, show them. Backend might not have ratings yet. */}
                        <tr>
                            <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: 'bold' }}>Stock</td>
                            {selectedProducts.map(prod => (
                                <td key={`stock-${prod._id}`} style={{ padding: '1rem', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                                    {prod.stock > 0 ? (
                                        <span style={{ color: 'var(--color-success)' }}>In Stock ({prod.stock})</span>
                                    ) : (
                                        <span style={{ color: 'var(--color-danger)' }}>Out of Stock</span>
                                    )}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: 'bold' }}>Description</td>
                            {selectedProducts.map(prod => (
                                <td key={`desc-${prod._id}`} style={{ padding: '1rem', borderBottom: '1px solid var(--border)', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    {prod.description}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td style={{ padding: '1rem' }}></td>
                            {selectedProducts.map(prod => (
                                <td key={`action-${prod._id}`} style={{ padding: '1rem', textAlign: 'center' }}>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => navigate(`/product/${prod._id}`)}
                                    >
                                        View Product
                                    </button>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComparePage;
