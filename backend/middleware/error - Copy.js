
const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;

    if(err.code === 11000){
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];

    err.message = `${field} '${value}' is already registered`;
    err.statusCode = 400;
    }


    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};

export default errorMiddleware;