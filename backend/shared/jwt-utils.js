const jwt = require('jsonwebtoken');

/**
 * 1. Checks if a token is provided.
 * 2. Splits the token if it’s in the Bearer <token> format.
 * 3. Uses the verify() function from jsonwebtoken to verify the token against the secret.
 * 4. Returns the decoded payload if the token is valid.
 *
 * Parameters:
 * token (string) – The JWT token to decode. Usually comes in the HTTP Authorization header like "Bearer <token>".
 *
 * Returns:
 * The decoded payload object if the token is valid.
 * undefined if no token is provided or if the token is invalid.
 */
const decodeToken = (token) => {
    if(token) {
        try{
            const [scheme, splitToken] = token.split(' '); 
            if (scheme !== "Bearer" || !splitToken) return undefined;      
            const decodedToken = jwt.verify(splitToken, process.env.TOKEN_SECRET);
            return decodedToken
        } catch (error) {
        console.log(error);
        throw error;
    }
    }
};

/**
 * 1. Uses the sign() function from the jsonwebtoken library.
 * 2. Signs the provided payload with a secret key.
 * 3. Sets an expiration time (expiresIn) for the token to 6h hours.
 *
 * Parameters:
 * payload (object) – The data you want to encode in the token (e.g., user ID, role, email).
 *
 * Returns:
 * A string representing the JWT token.
 */

const encodeToken = (payload) => {    
    return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "6h" });
};

module.exports = { decodeToken, encodeToken };
