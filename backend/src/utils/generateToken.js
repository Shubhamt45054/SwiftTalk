import jwt from 'jsonwebtoken';

export const genereateToken = (userID,res) =>{

    const token = jwt.sign({userID}, process.env.JWT_SECRET,{
        expiresIn : '7d',
    });

    res.cookie('jwtToken', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true, // prevent XSS attacks cross site scripting attacks
        sameSite: 'strict', // CSRF attacks cross site request forgery attackas
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    });

    return token;
};


