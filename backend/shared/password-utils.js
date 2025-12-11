const bcrypt = require('bcrypt');

const encodePassword = (raw) => {
    try {        
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(raw, salt);
        return hashedPassword
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const matchPassword = (raw, encoded) => {
    try {        
        const isMatch = bcrypt.compareSync(raw, encoded);
        if (!isMatch) return false
        return true
    } catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports = { encodePassword, matchPassword };
