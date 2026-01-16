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
       return;
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
      
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError(`Failed to load products: ${err.message}`);
      // Set empty array instead of keeping old data
      setProducts([]);
    } finally {
      setLoading(false);
      setLastUpdated(Date.now());
    }
  }, []); // REMOVED user dependency - prevents infinite loop

  // Initial fetch only
  useEffect(() => {
    fetchProducts();
  }, []); // Only run on mount

  // Auto-refresh interval (every 60 seconds) for background sync
  useEffect(() => {
    const intervalId = setInterval(() => {
        fetchProducts();
    }, 60000); // 60 seconds - minimal polling

    return () => clearInterval(intervalId);
  }, []); // No dependencies

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

  // Listen for STOCK_UPDATED events from backend broadcasts and refresh immediately
  useEffect(() => {
    const handleStockUpdated = (event) => {
      console.log('📦 STOCK_UPDATED event received - refreshing products');
      // Immediately refresh to get latest stock quantities
      fetchProducts();
    };

    window.addEventListener('STOCK_UPDATED', handleStockUpdated);
    
    return () => {
      window.removeEventListener('STOCK_UPDATED', handleStockUpdated);
    };
  }, [fetchProducts]);

  // Listen for PRODUCT_ADDED/PRODUCT_UPDATED events
  useEffect(() => {
    const handleProductChanged = (event) => {
      console.log('📝 Product changed - refreshing products');
      fetchProducts();
    };

    window.addEventListener('PRODUCT_ADDED', handleProductChanged);
    window.addEventListener('PRODUCT_UPDATED', handleProductChanged);
    window.addEventListener('productCreated', handleProductChanged);
    window.addEventListener('productUpdated', handleProductChanged);
    
    return () => {
      window.removeEventListener('PRODUCT_ADDED', handleProductChanged);
      window.removeEventListener('PRODUCT_UPDATED', handleProductChanged);
      window.removeEventListener('productCreated', handleProductChanged);
      window.removeEventListener('productUpdated', handleProductChanged);
    };
  }, [fetchProducts]);

  const refreshProducts = async () => {
    setLoading(true);
    await fetchProducts();
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

