/* 
Import
*/
    // Inner
    const Models = require('../models/index');
    const { cryptData, decryptData } = require('../services/crypto.service')
//

/* 
CRUD methods
*/
    const createOne = req => {
        return new Promise( (resolve, reject) => {
            // Set first contributor
            req.body.contributors = [req.user._id]

            // Create new conversation
            Models.conversation.create( req.body )
            .then( async data => {

                // Update user
                const updatedUser = await Models.user.updateOne(
                    { _id: req.user._id },
                    { $push: { conversations: data._id } }
                )

                // Return data
                return resolve( await readOne(data._id))
            })
            .catch( err => reject(err) )
        })
    }

    const readOne = _id => {
        return new Promise( (resolve, reject) => {
            Models.conversation.findOne( { _id: _id } )
            .populate('author', ['-__v', '-messages', '-posts', '-conversations'])
            .populate('contributors', ['-__v', '-messages', '-posts', '-conversations'])
            .populate('messages', ['-author', '-__v', '-isPublished', '-isPartOf'])
            .exec( (err, data) => {
                if( err ){ return reject(err) }
                else{ 
                    let contributors = []
                    for( let item of data.contributors ){
                        contributors.push( decryptData(item, 'givenName', 'familyName' ))
                    }
                    data.author = decryptData(data.author, 'givenName', 'familyName')
                    data.contributor = contributors

                    // TODO: check user password from cookie
                    return resolve(data) 
                }
            })
        })
    }

    const readAll = () => {
        return new Promise( (resolve, reject) => {
            Models.conversation.find( async (err, data) => {
                if( err ){ return reject(err) }
                else{ 
                    let dataCollection = [];
                    for( let item of data ){
                        dataCollection.push( await readOne(item._id) )
                    }

                    return resolve(dataCollection);
                }
            })
        })
    }

    const updateOne = req => {
        // TODO: check user ID
        return new Promise( (resolve, reject) => {
            Models.conversation.findOneAndUpdate( { _id: req.params._id }, req.body, (err, data) => {
                if( err ){ return reject(err) }
                else{ return resolve(data) }
            })
        })
    }

    const deleteOne = req => {
        // TODO: check user ID
        return new Promise( (resolve, reject) => {
            Models.conversation.findByIdAndRemove( { _id: req.params._id }, (err, data) => {
                if( err ){ return reject(err) }
                else{ return resolve(data) }
            })
        })
    }

    const registerContributor = req => {
        return new Promise( (resolve, reject) => {
            Models.conversation.findOneAndUpdate( { _id: resolve.params._id }, { $push: { contributors: req.user._id } }, (err, data) => {
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
        readAll,
        readOne,
        createOne,
        updateOne,
        deleteOne,
        registerContributor
    }
//