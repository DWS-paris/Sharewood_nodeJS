/* 
Import
*/
    // Node
    const Models = require('../models/index');
    const bcrypt = require('bcrypt');

    // Inner
    const { cryptData, decryptData } = require('../services/crypto.service')
//

/* 
CRUD methods
*/
    const register = req => {
        return new Promise( async (resolve, reject) => {
            // Encrypt user password
            req.body.password = await bcrypt.hash(req.body.password, 10);

            // Encrypt personal data
            req.body.givenName = cryptData(req.body.givenName);
            req.body.familyName = cryptData(req.body.familyName);

            // Register new user
            Models.user.create(req.body)
            .then( data => resolve(data) )
            .catch( err => reject(err) );
        })
    }

    const login = (req, res) => {
        return new Promise( (resolve, reject) => {
            // Search user from email
            Models.user.findOne( { email: req.body.email }, (err, data) => {
                if( err || data === null ){ return reject({err, data}) }
                else{
                    // Check user password
                    const validatedPassword = bcrypt.compareSync( req.body.password, data.password )
                    if( !validatedPassword ){ return reject('Password not valid') }
                    else{ 
                        // Generate user JWT
                        const userJwt = data.generateJwt(data);

                        // Set response cookie
                        res.cookie( process.env.COOKIE_NAME, userJwt, { maxAge: 700000, httpOnly: true } )

                        // Decrypt personal data
                        const clearData = decryptData(data, 'givenName', 'familyName')

                        return resolve(clearData);
                    }
                }
            })
        })
    }

    const me = (req, res) => {
        return new Promise( (resolve, reject) => {
            // Search user from email
            Models.user.findOne( { email: req.user.email } )
            .populate('posts')
            .exec( (err, data) => {
                if( err ){ return reject(err) }
                else{ return resolve(data) }
            })
        })
    }
//

/* 
Export controller methods
*/
    module.exports = {
        register,
        login,
        me
    }
//