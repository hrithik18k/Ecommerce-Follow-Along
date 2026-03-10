import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeCompareProduct, clearCompare } from '../store/compareSlice';

const CompareBar = () => {
    const selectedProducts = useSelector(state => state.compare.selectedProducts);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    if (selectedProducts.length === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            background: 'var(--surface)',
            borderTop: '1px solid var(--border)',
            padding: '1rem',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backdropFilter: 'blur(10px)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', overflowX: 'auto' }}>
                <div style={{ fontWeight: 'bold', marginRight: '1rem' }}>
                    Compare ({selectedProducts.length}/3)
                </div>
                {selectedProducts.map(prod => (
                    <div key={prod._id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                        <img
                            src={prod.imageUrl[0].startsWith('http') ? prod.imageUrl[0] : `${import.meta.env.VITE_BACKEND_URL}/${prod.imageUrl[0]}`}
                            alt={prod.name}
                            style={{ width: '30px', height: '30px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                        <span style={{ fontSize: '0.85rem', maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prod.name}</span>
                        <button
                            onClick={() => dispatch(removeCompareProduct(prod._id))}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1rem' }}
                        >×</button>
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                    onClick={() => dispatch(clearCompare())}
                    style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                >
                    Clear All
                </button>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/compare')}
                    disabled={selectedProducts.length < 2}
                >
                    Compare Now
                </button>
            </div>
        </div>
    );
};

export default CompareBar;
