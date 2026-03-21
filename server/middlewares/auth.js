import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.json({ success: false, message: "Not Authorized. Login Again" });
    }

    // Decode the token to get the user's ID
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the user ID to the request body so our controllers can use it
    req.body.userId = tokenDecode.id;
    next();

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;