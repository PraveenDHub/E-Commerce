export const updateProductRatings = (product) => {

    const reviews = product.reviews;

    const sum = reviews.reduce((acc, rev) => acc + rev.rating, 0);

    product.numOfReviews = reviews.length;
    product.ratings = reviews.length ? Math.round((sum / reviews.length) * 10) / 10 : 0;
};