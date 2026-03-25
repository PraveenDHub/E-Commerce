export const calculateDiscount = (price,mrp) => {
    return Math.ceil(((mrp - price) / mrp) * 100);
};

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN',{
        day:"2-digit",
        month:"short",
        year:"numeric"
    })
}