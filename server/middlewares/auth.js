import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.json({ success: false, message: "Not Authorized. Login Again" });
    }

    // Decode the token to get the user's ID
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    
    // === THE FIX ===
    // If req.body doesn't exist (because it's a GET or DELETE request), initialize it as an empty object!
    if (!req.body) {
      req.body = {};
    }
    
    // Now it is safe to attach the userId
    req.body.userId = tokenDecode.id;
    next();

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;