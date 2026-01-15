import { useState, useEffect } from 'react';
import { AlertCircle, Check, Package, Zap } from 'lucide-react';

export default function StockDeductionSummary({ deductions, isOpen, onClose }) {
  const [displayedDeductions, setDisplayedDeductions] = useState(null);

  useEffect(() => {
    if (isOpen && deductions) {
      setDisplayedDeductions(deductions);
    }
  }, [isOpen, deductions]);

  if (!isOpen || !displayedDeductions) {
    return null;
  }

  const products = displayedDeductions.products || [];
  const expenses = displayedDeductions.expenses || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 sticky top-0">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Stock Deducted</h2>
              <p className="text-green-100 text-sm">✅ Sale completed successfully</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Products Section */}
          {products && products.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-500" />
                Products Deducted ({products.length})
              </h3>
              <div className="space-y-2">
                {products.map((product, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:bg-gray-100 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">
                          {product.parent_product ? `Ingredient of: ${product.parent_product}` : 'Direct sale'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono text-red-600 font-semibold">
                          -{product.deducted} {product.unit}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600 flex justify-between">
                      <span>Before: {product.before_qty} {product.unit}</span>
                      <span>After: {product.after_qty} {product.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expenses Section */}
          {expenses && expenses.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                Expenses Deducted ({expenses.length})
              </h3>
              <div className="space-y-2">
                {expenses.map((expense, idx) => (
                  <div
                    key={idx}
                    className="bg-amber-50 rounded-lg p-3 border border-amber-200 hover:bg-amber-100 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-amber-900">{expense.name}</p>
                        <p className="text-sm text-amber-700">Ingredient</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono text-amber-600 font-semibold">
                          -{expense.deducted} {expense.unit}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-amber-700 flex justify-between">
                      <span>Before: {expense.before_qty} {expense.unit}</span>
                      <span>After: {expense.after_qty} {expense.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary Stats */}
          {(products.length > 0 || expenses.length > 0) && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">{products.length + expenses.length} items</span> deducted atomically from inventory
              </p>
              <p className="text-xs text-blue-700 mt-1">
                All changes applied simultaneously - no partial deductions
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 border-t border-gray-200 sticky bottom-0">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
