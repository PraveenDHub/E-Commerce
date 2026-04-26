export const sendToken = (user, statusCode, res, customMessage=null) => {
    const token = user.getJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        sameSite: "none",
        secure: true,
    };

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        message:
            customMessage ||
            (statusCode === 201
                ? "User registered successfully!"
                : "User logged in successfully!"),
        user,
        token,
    });
};