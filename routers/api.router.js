/*
Imports
*/
    // Node
    const express = require('express');

    // Inner
    const Controllers = require('../controllers/index')
    const Mandatory = require('../services/mandatory.service');
    const { checkFields } = require('../services/request.service');
    const { sendBodyError,sendFieldsError,sendApiSuccessResponse,sendApiErrorResponse } = require('../services/response.service')
//

/* 
Router definition
*/
    class ApiRooter{
        constructor( { passport, io } ){
            this.router = express.Router();
            this.passport = passport;
            this.io = io;

            
        }

        routes(){
            // Set socket connection
            this.io.on('connection', socket => {
                // CRUD: Create one item
                this.router.post('/:endpoint', this.passport.authenticate('jwt', { session: false }), (req, res) => {
                    // Check body data
                    if( typeof req.body === 'undefined' || req.body === null || Object.keys(req.body).length === 0 ){ 
                        return sendBodyError(`/api/${req.params.endpoint}`, 'POST', res, 'No data provided in the reqest body')
                    }
                    else{
                        // Use the controller to create data
                        const { ok, extra, miss } = checkFields( Mandatory[req.params.endpoint], req.body )
    
                        // Error: bad fields provided
                        if( !ok ){ return sendFieldsError(`/api/${req.params.endpoint}`, 'POST', res, 'Bad fields provided', miss, extra) }
                        else{
                            // Define author _id
                            req.body.author = req.user._id;

                            // Create new object
                            Controllers[req.params.endpoint].createOne(req, socket)
                            .then( apiResponse => sendApiSuccessResponse(`/api/${req.params.endpoint}`, 'POST', res, 'Request succeed', apiResponse) )
                            .catch( apiError => sendApiErrorResponse(`/api/${req.params.endpoint}`, 'POST', res, 'Request failed', apiError) );
                        }
                    }
                })
            })
            

            // CRUD: Read all item
            this.router.get('/:endpoint', (req, res) => {
                // Use the controller to get all data
                Controllers[req.params.endpoint].readAll()
                .then( apiResponse => sendApiSuccessResponse(`/api/${req.params.endpoint}`, 'GET', res, 'Request succeed', apiResponse) )
                .catch( apiError => sendApiErrorResponse(`/api/${req.params.endpoint}`, 'GET', res, 'Request failed', apiError) );
            })

            // CRUD: Read one item
            this.router.get('/:endpoint/:_id', (req, res) => {
                // Use the controller to get one data
                Controllers[req.params.endpoint].readOne(req.params._id)
                .then( apiResponse => sendApiSuccessResponse(`/api/${req.params.endpoint}/${req.params._id}`, 'GET', res, 'Request succeed', apiResponse) )
                .catch( apiError => sendApiErrorResponse(`/api/${req.params.endpoint}/${req.params._id}`, 'GET', res, 'Request failed', apiError) );
            })

            // CRUD: Update all item
            this.router.put('/:endpoint/:_id', this.passport.authenticate('jwt', { session: false }), (req, res) => {
                // Check body data
                if( typeof req.body === 'undefined' || req.body === null || Object.keys(req.body).length === 0 ){ 
                    return sendBodyError(`/api/${req.params.endpoint}/${req.params._id}`, 'PUT', res, 'No data provided in the reqest body')
                }
                else{
                    // Check body properties
                    const { ok, extra, miss } = checkFields(Mandatory[req.params.endpoint], req.body)

                    // Error: bad fields provided
                    if( !ok ){ return sendFieldsError(`/api/${req.params.endpoint}/${req.params._id}`, 'PUT', res, 'Bad fields provided', miss, extra) }
                    else{
                        // Use the controller to update data
                        Controllers[req.params.endpoint].updateOne(req)
                        .then( apiResponse => sendApiSuccessResponse(`/api/${req.params.endpoint}/${req.params._id}`, 'PUT', res, 'Request succeed', apiResponse) )
                        .catch( apiError => sendApiErrorResponse(`/api/${req.params.endpoint}/${req.params._id}`, 'PUT', res, 'Request failed', apiError) );
                    }
                }
            })

            // CRUD: Delete all item
            this.router.delete('/:endpoint/:_id', this.passport.authenticate('jwt', { session: false }), (req, res) => {
                // Use the controller to delete data
                Controllers[req.params.endpoint].deleteOne(req)
                .then( apiResponse => sendApiSuccessResponse(`/api/${req.params.endpoint}/${req.params._id}`, 'DELETE', res, 'Request succeed', apiResponse) )
                .catch( apiError => sendApiErrorResponse(`/api/${req.params.endpoint}/${req.params._id}`, 'DELETE', res, 'Request failed', apiError) );
            })
        }

        init(){
            // Get routes
            this.routes();

            // Retun the router
            return this.router;
        }
    }
//

/* 
Export
*/
    module.exports = ApiRooter;
//