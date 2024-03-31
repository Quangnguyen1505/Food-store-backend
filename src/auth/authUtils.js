const JWT = require('jsonwebtoken');
const createTokenPair = async ( payload, publicKey, privateKey )=>{
    try {
        const asscessToken = JWT.sign( payload, publicKey, {
            // algorithm: 'RS256',
            expiresIn: '2 days'
        });

        const refreshToken = JWT.sign( payload, privateKey, {
            // algorithm: 'RS256',
            expiresIn: '7 days'
        });

        JWT.verify( asscessToken, publicKey, ( err, decode )=>{
            if(err){
                console.log("asscessToken verify error",err);
            }else{
                console.log("asscessToken verify successfully! ",decode);
            }
        });

        return {asscessToken,refreshToken};

    } catch (error) {
        return error
    }
}

module.exports = {
    createTokenPair
}