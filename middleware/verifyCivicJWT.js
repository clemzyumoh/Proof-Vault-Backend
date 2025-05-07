// // middleware/verifyCivicJWT.js
// import jwt from "jsonwebtoken";
// import jwksClient from "jwks-rsa";

// const client = jwksClient({
//   jwksUri: "https://auth.civic.com/.well-known/jwks.json",
//   cache: true,
// });

// // function getKey(header, callback) {
// //   client.getSigningKey(header.kid, function (err, key) {
// //     const signingKey = key.getPublicKey();
// //     callback(null, signingKey);
// //   });
// // }

// function getKey(header, callback) {
//   client.getSigningKey(header.kid, function (err, key) {
//     if (err || !key) {
//       console.error("Failed to get signing key", err);
//       callback(err || new Error("Signing key not found"));
//       return;
//     }

//     const signingKey = key.getPublicKey(); // or key.rsaPublicKey
//     callback(null, signingKey);
//   });
// }


// export const verifyCivicJWT = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) return res.status(401).json({ message: "Missing Civic token" });

//   jwt.verify(token, getKey, {}, (err, decoded) => {
//     if (err) return res.status(403).json({ message: "Invalid Civic token" });

//     req.user = decoded;
//     next();
//   });
// };

// middleware/verifyCivicJWT.js
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

// Set up JWKS client
const client = jwksClient({
  jwksUri: "https://auth.civic.com/.well-known/jwks.json",
  cache: true,
  rateLimit: true,
});

// Dynamically get signing key
function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err || !key) {
      console.error("Failed to get signing key:", err);
      return callback(err || new Error("Signing key not found"));
    }

    // Fallback support for different key formats
    const signingKey =
      key.getPublicKey?.() || key.publicKey || key.rsaPublicKey;

    if (!signingKey) {
      console.error("Unable to extract signing key from JWKS response");
      return callback(new Error("Invalid key format"));
    }

    callback(null, signingKey);
  });
}

// Middleware to verify Civic JWT
export const verifyCivicJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid Civic token" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, getKey, {}, (err, decoded) => {
    if (err) {
      console.error("JWT verification failed:", err);
      return res.status(403).json({ message: "Invalid Civic token" });
    }

    req.user = decoded;
    next();
  });
};
