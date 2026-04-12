import { motion } from "framer-motion";

const steps = ["Ordered", "Packed", "Shipped", "Delivered"];

const getStepIndex = (status) => {
  const map = {
    Processing: 0,
    Packed: 1,
    Shipped: 2,
    Delivered: 3,
    Cancelled: 0, // Reset to start
  };
  return map[status] ?? 0;
};

const OrderTimeline = ({ status }) => {
  const currentStep = getStepIndex(status);

  return (
    <div className="relative py-8 px-4">
      {/* Background Line */}
      <div className="absolute top-12 left-0 right-0 h-1 bg-gray-200 rounded-full" />

      {/* Green Progress Line */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute top-12 left-0 h-1 bg-green-500 rounded-full"
      />

      <div className="relative flex items-start justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            {/* Circle */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.15 }}
              className={`w-11 h-11 flex items-center justify-center rounded-full text-lg font-bold shadow-md z-10 border-4 border-white
                ${
                  index <= currentStep
                    ? "bg-green-500 text-white"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
            >
              {index <= currentStep ? "✓" : index + 1}
            </motion.div>

            {/* Label */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 + 0.2 }}
              className={`text-sm mt-4 font-medium text-center ${
                index <= currentStep ? "text-green-700" : "text-gray-500"
              }`}
            >
              {step}
            </motion.p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTimeline;