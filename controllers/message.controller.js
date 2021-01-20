/* 
Import
*/
    const Models = require('../models/index');
//

/* 
CRUD methods
*/
    const createOne = req => {
        return new Promise( (resolve, reject) => {
            Models.message.create( req.body )
            .then( async data => {

                // Update user
                const updatedUser = await Models.user.updateOne(
                    { _id: req.user._id },
                    { $push: { messages: data._id } }
                )

                // Update conversation
                const updatedConversation = await Models.conversation.updateOne(
                    { _id: data.isPartOf },
                    { $push: { messages: data._id } }
                )

                return resolve( await readOne(data._id) )
            })
            .catch( err => reject(err) )
        })
    }

    const readOne = _id => {
        return new Promise( (resolve, reject) => {
            Models.message.findOne( { _id: _id } )
            .populate('author', ['-__v', '-messages', '-posts', '-conversations'])
            .populate('conversation', ['-__v', '-messages'])
            .exec( (err, data) => {
                if( err ){ return reject(err) }
                else{ 
                    data.author = decryptData(data.author, 'givenName', 'familyName')

                    // TODO: check user password from cookie
                    return resolve(data) 
                }
            })
        })
    }

    const readAll = () => {
        return new Promise( (resolve, reject) => {
            Models.message.find( async (err, data) => {
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
            Models.message.findOneAndUpdate( { _id: req.params._id }, req.body, (err, data) => {
                if( err ){ return reject(err) }
                else{ return resolve(data) }
            })
        })
    }

    const deleteOne = req => {
        // TODO: check user ID
        return new Promise( (resolve, reject) => {
            Models.message.findByIdAndRemove( { _id: req.params._id }, (err, data) => {
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
        deleteOne
    }
//