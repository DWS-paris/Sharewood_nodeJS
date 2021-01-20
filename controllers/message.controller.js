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

                return resolve({ data, updatedUser, updatedConversation })
            })
            .catch( err => reject(err) )
        })
    }

    const readOne = _id => {
        return new Promise( (resolve, reject) => {
            Models.message.findById( _id, (err, data) => {
                if( err ){ return reject(err) }
                else{ return resolve(data) }
            })
        })
    }

    const readAll = () => {
        return new Promise( (resolve, reject) => {
            Models.message.find( (err, data) => {
                if( err ){ return reject(err) }
                else{ return resolve(data) }
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