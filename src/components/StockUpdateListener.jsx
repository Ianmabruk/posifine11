import { useEffect } from 'react';
import { useProducts } from '../context/ProductsContext';

export default function StockUpdateListener() {
  const { refreshProducts } = useProducts();

  useEffect(() => {
    // Listen for real-time stock updates
    const handleStockUpdate = (event) => {
      console.log(' Stock update received:', event.detail);
      // Refresh products to get latest stock
      refreshProducts();
    };

    // Listen for sale completion events
    const handleSaleComplete = (event) => {
      console.log(' Sale completed, refreshing stock:', event.detail);
      refreshProducts();
    };

    // Listen for product changes from WebSocket or other sources
    const handleProductsSync = (event) => {
      console.log(' Products sync event:', event.detail);
      // Products context will handle the update
    };

    window.addEventListener('stockUpdate', handleStockUpdate);
    window.addEventListener('saleComplete', handleSaleComplete);
    window.addEventListener('productsSync', handleProductsSync);

    return () => {
      window.removeEventListener('stockUpdate', handleStockUpdate);
      window.removeEventListener('saleComplete', handleSaleComplete);
      window.removeEventListener('productsSync', handleProductsSync);
    };
  }, [refreshProducts]);

  return null; // This component doesn't render anything
}
