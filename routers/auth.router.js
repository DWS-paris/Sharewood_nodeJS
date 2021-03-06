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
    class AuthRooter{
        constructor( { passport } ){
            this.router = express.Router();
            this.passport = passport;
        }

        routes(){
            // Auth: register user
            this.router.post('/register', (req, res) => {
                // Check body data
                if( typeof req.body === 'undefined' || req.body === null || Object.keys(req.body).length === 0 ){ 
                    return sendBodyError(`/api/auth/register`, 'POST', res, 'No data provided in the reqest body')
                }
                else{
                    // Use the controller to create data
                    const { ok, extra, miss } = checkFields( Mandatory.register, req.body )

                    // Error: bad fields provided
                    if( !ok ){ return sendFieldsError(`/api/auth/register`, 'POST', res, 'Bad fields provided', miss, extra) }
                    else{
                        // Create new object
                        Controllers.user.register(req)
                        .then( apiResponse => sendApiSuccessResponse(`/api/auth/register`, 'POST', res, 'Request succeed', apiResponse) )
                        .catch( apiError => sendApiErrorResponse(`/api/auth/register`, 'POST', res, 'Request failed', apiError) );
                    }
                }
            })

            // Auth: login user
            this.router.post('/login', (req, res) => {
                // Check body data
                if( typeof req.body === 'undefined' || req.body === null || Object.keys(req.body).length === 0 ){ 
                    return sendBodyError(`/api/auth/login`, 'POST', res, 'No data provided in the reqest body')
                }
                else{
                    // Use the controller to create data
                    const { ok, extra, miss } = checkFields( Mandatory.login, req.body )

                    // Error: bad fields provided
                    if( !ok ){ return sendFieldsError(`/api/auth/login`, 'POST', res, 'Bad fields provided', miss, extra) }
                    else{
                        // Create new object
                        Controllers.user.login(req, res)
                        .then( apiResponse => sendApiSuccessResponse(`/api/auth/login`, 'POST', res, 'Request succeed', apiResponse) )
                        .catch( apiError => sendApiErrorResponse(`/api/auth/login`, 'POST', res, 'Request failed', apiError) );
                    }
                }
            })

            // Auth: user informations
            this.router.get('/me', this.passport.authenticate('jwt', { session: false }), (req, res) => {
                // Get data from the controller
                Controllers.user.me(req, res)
                .then( apiResponse => sendApiSuccessResponse(`/api/auth/me`, 'GET', res, 'Request succeed', apiResponse) )
                .catch( apiError => sendApiErrorResponse(`/api/auth/me`, 'GET', res, 'Request failed', apiError) );
            })

            // Auth: add user has conversation contributor
            this.router.post('/conversation/:_id', this.passport.authenticate('jwt', { session: false }), (req, res) => {
                // Get data from the controller
                Controllers.conversation.registerContributor(req)
                .then( apiResponse => sendApiSuccessResponse(`/api/auth/conversation`, 'POST', res, 'Request succeed', apiResponse) )
                .catch( apiError => sendApiErrorResponse(`/api/auth/conversation`, 'POST', res, 'Request failed', apiError) );
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
    module.exports = AuthRooter;
//