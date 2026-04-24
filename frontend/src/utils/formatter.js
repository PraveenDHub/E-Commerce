export const calculateDiscount = (price, mrp) => {
  if (!mrp || mrp <= 0) return 0; // prevent NaN / divide by 0
  if (price >= mrp) return 0; // no discount case

  return Math.ceil(((mrp - price) / mrp) * 100);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
