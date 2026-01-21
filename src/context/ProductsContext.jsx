import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { products as productsApi } from '../services/api';
import { useAuth } from './AuthContext';
import { demoProducts } from '../utils/demoData';

const ProductsContext = createContext();

export const useProducts = () => useContext(ProductsContext);

export const ProductsProvider = ({ children }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  const fetchProducts = useCallback(async () => {
    if (!localStorage.getItem('token')) {
       setLoading(false);
       return [];
    }

    try {
      const data = await productsApi.getAll();
      
      // Ensure we always get an array
      const productList = Array.isArray(data) ? data : [];
      
      // Filter visible products
      const visibleProducts = productList.filter(p => {
        return !p.pendingDelete;
      });
      
      setProducts(visibleProducts);
      setError(null);
      
      // Dispatch sync event for real-time updates
      window.dispatchEvent(new CustomEvent('productsSync', { 
        detail: { products: visibleProducts, timestamp: Date.now() }
      }));
      
      // CRITICAL: Return the products so callers can use them immediately
      return visibleProducts;
      
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError(`Failed to load products: ${err.message}`);
      // Set empty array instead of keeping old data
      setProducts([]);
      return [];
    } finally {
      setLoading(false);
      setLastUpdated(Date.now());
    }
  }, []); // REMOVED user dependency - prevents infinite loop

  // Initial fetch only
  useEffect(() => {
    fetchProducts();
  }, []); // Only run on mount

  // REMOVED: Auto-refresh interval that was causing inventory resets
  // The 60-second interval was overwriting user changes
  // Now we only refresh on explicit request (manual refresh, WebSocket events, or sale completion)
  // This prevents stale data from overwriting fresh updates

  // Listen for clear-data events and force immediate refetch
  useEffect(() => {
    const handleDataCleared = () => {
      console.log('🔄 Data cleared event received - forcing products refresh');
      setProducts([]);
      setError(null);
      fetchProducts();
    };

    window.addEventListener('dataCleared', handleDataCleared);
    window.addEventListener('productsCleared', handleDataCleared);
    
    return () => {
      window.removeEventListener('dataCleared', handleDataCleared);
      window.removeEventListener('productsCleared', handleDataCleared);
    };
  }, []); // No dependencies

  const refreshProducts = async () => {
    setLoading(true);
    const freshProducts = await fetchProducts();
    return freshProducts;
  };

  return (
    <ProductsContext.Provider 
      value={{ 
        products, 
        loading, 
        error, 
        lastUpdated,
        refreshProducts 
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

