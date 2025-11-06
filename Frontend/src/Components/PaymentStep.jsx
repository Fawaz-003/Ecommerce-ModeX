import React from 'react';

const PaymentStep = ({ formData, handleInputChange, onContinue }) => {
  const isContinueDisabled = !formData.paymentMethod;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Payment Options</h3>
      
      <div className="space-y-3">
        <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
          formData.paymentMethod === 'card' ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' : 'border-gray-300 hover:border-gray-400'
        }`}>
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={formData.paymentMethod === 'card'}
            onChange={handleInputChange}
            className="w-4 h-4 text-indigo-600"
          />
          <span className="ml-3 text-gray-900 font-medium">Credit / Debit card</span>
        </label>
        
        {formData.paymentMethod === 'card' && (
          <div className="ml-7 p-4 bg-gray-50 rounded-lg space-y-3">
            <input type="text" name="cardNumber" placeholder="Card number" value={formData.cardNumber} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" />
            <div className="grid grid-cols-2 gap-3">
              <input type="text" name="expiration" placeholder="MM / YY" value={formData.expiration} onChange={handleInputChange} className="px-4 py-2.5 border border-gray-300 rounded-lg" />
              <input type="text" name="cvv" placeholder="CVV" value={formData.cvv} onChange={handleInputChange} className="px-4 py-2.5 border border-gray-300 rounded-lg" />
            </div>
          </div>
        )}

        <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
          formData.paymentMethod === 'cod' ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' : 'border-gray-300 hover:border-gray-400'
        }`}>
          <input
            type="radio"
            name="paymentMethod"
            value="cod"
            checked={formData.paymentMethod === 'cod'}
            onChange={handleInputChange}
            className="w-4 h-4 text-indigo-600"
          />
          <span className="ml-3 text-gray-900 font-medium">Cash on Delivery (COD)</span>
        </label>
      </div>

      <div className="mt-8">
        <button
          onClick={onContinue}
          disabled={isContinueDisabled}
          className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Review Order
        </button>
      </div>
    </div>
  );
};

export default PaymentStep;