import React from 'react';

const Step = ({ active, completed, label, isLast = false }) => {
  return (
    <div className="flex-1 flex items-center">
      {/* Circle */}
      <div
        className={`w-10 h-10 flex items-center justify-center rounded-2xl text-lg font-semibold
          transition-all duration-300 shadow-md
          ${completed 
            ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-green-200" 
            : ""}
          ${active 
            ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-blue-200 ring-4 ring-blue-100" 
            : ""}
          ${!active && !completed 
            ? "bg-white border-2 border-gray-300 text-gray-400" 
            : ""}
        `}
      >
        {completed ? (
          <span className="text-xl">✓</span>
        ) : (
          <span>{!active && !completed ? "○" : ""}</span>
        )}
      </div>

      {/* Label */}
      <div className="ml-3">
        <span
          className={`text-sm font-semibold tracking-wide transition-colors duration-300
            ${completed ? "text-emerald-600" : ""}
            ${active ? "text-blue-700" : ""}
            ${!active && !completed ? "text-gray-400" : ""}
          `}
        >
          {label}
        </span>
      </div>

      {/* Connector Line */}
      {!isLast && (
        <div className="flex-1 h-[3px] mx-4 bg-gray-200 relative overflow-hidden">
          <div
            className={`absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-500
              ${completed ? "w-full" : "w-0"}`}
          />
        </div>
      )}
    </div>
  );
};

const CheckoutSteps = ({ shipping, confirmOrder, payment }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-8">
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 p-8">
        <div className="flex items-center justify-between">
          
          {/* Step 1 - Shipping */}
          <Step
            active={shipping}
            completed={confirmOrder || payment}
            label="Shipping Details"
          />

          {/* Step 2 - Confirm Order */}
          <Step
            active={confirmOrder}
            completed={payment}
            label="Confirm Order"
          />

          {/* Step 3 - Payment (Last Step) */}
          <Step
            active={payment}
            completed={payment}
            label="Payment"
            isLast={true}
          />

        </div>
      </div>
    </div>
  );
};

export default CheckoutSteps;