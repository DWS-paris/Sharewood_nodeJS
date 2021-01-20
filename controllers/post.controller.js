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
            Models.post.create( req.body )
            .then( async data => {

                // Update user
                const updatedUser = await Models.user.updateOne(
                    { _id: req.user._id },
                    { $push: { posts: data._id } }
                )

                return resolve({ data, updatedUser })
            })
            .catch( err => reject(err) )
        })
    }

    const readOne = req => {
        return new Promise( (resolve, reject) => {
            Models.post.findById( req.params._id, (err, data) => {
                if( err ){ return reject(err) }
                else{ return resolve(data) }
            })
        })
    }

    const readAll = () => {
        return new Promise( (resolve, reject) => {
            Models.post.find( (err, data) => {
                if( err ){ return reject(err) }
                else{ return resolve(data) }
            })
        })
    }

    const updateOne = req => {
        return new Promise( (resolve, reject) => {
            Models.post.findOneAndUpdate( { _id: req.params._id }, req.body, (err, data) => {
                if( err ){ return reject(err) }
                else{ return resolve(data) }
            })
        })
    }

    const deleteOne = req => {
        return new Promise( (resolve, reject) => {
            Models.post.findByIdAndRemove( { _id: req.params._id }, (err, data) => {
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