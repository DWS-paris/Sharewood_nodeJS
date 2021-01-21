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
    class BackendRooter{
        constructor( { passport } ){
            this.router = express.Router();
            this.passport = passport;
        }

        routes(){
            // Define index route
            this.router.get('/', (req, res) => {
                return sendApiSuccessResponse(`/`, 'GET', res, 'Request succeed', null, 'index')
            })

            // Define index route
            this.router.get('/connected', this.passport.authenticate('jwt', { session: false }), (req, res) => {
                Controllers.conversation.readAll()
                .then( apiResponse => sendApiSuccessResponse(`/conversation`, 'POST', res, 'Request succeed', apiResponse, 'connected') )
                .catch( apiError => sendApiErrorResponse(`/conversation`, 'POST', res, 'Request failed', apiError, 'connected') );
            })

            this.router.get('/register', (req, res) => {
                // Return "register.ejs" file
                return sendApiSuccessResponse(`/register`, 'POST', res, 'Request succeed', null, 'register')
            })

            // Define register route
            this.router.post('/register', (req, res) => {
                // Check body data
                if( typeof req.body === 'undefined' || req.body === null || Object.keys(req.body).length === 0 ){ 
                    return sendBodyError(`/register`, 'POST', res, 'No data provided in the reqest body', 'register')
                }
                else{
                    // Use the controller to create data
                    const { ok, extra, miss } = checkFields( Mandatory.register, req.body )

                    // Error: bad fields provided
                    if( !ok ){ return sendFieldsError(`/register`, 'POST', res, 'Bad fields provided', miss, extra, 'register') }
                    else{
                        Controllers.user.register(req)
                        .then( apiResponse => sendApiSuccessResponse(`/register`, 'POST', res, 'Request succeed', apiResponse, 'login') )
                        .catch( apiError => sendApiErrorResponse(`/register`, 'POST', res, 'Request failed', apiError, 'register') );
                    }
                }
            })

            this.router.get('/login', (req, res) => {
                // Return "login.ejs" file
                return sendApiSuccessResponse(`/register`, 'POST', res, 'Request succeed', null, 'login')
            })

            // Define login route
            this.router.post('/login', (req, res) => {
                // Check body data
                if( typeof req.body === 'undefined' || req.body === null || Object.keys(req.body).length === 0 ){ 
                    return sendBodyError(`/register`, 'POST', res, 'No data provided in the reqest body', 'login')
                }
                else{
                    // TODO: check admin user email
                    // Use the controller to create data
                    const { ok, extra, miss } = checkFields( Mandatory.login, req.body )

                    // Error: bad fields provided
                    if( !ok ){ return sendFieldsError(`/register`, 'POST', res, 'Bad fields provided', miss, extra, 'login') }
                    else{
                        Controllers.user.login(req, res)
                        .then( apiResponse => sendApiSuccessResponse(`/register`, 'POST', res, 'Request succeed', apiResponse, '/', true) )
                        .catch( apiError => sendApiErrorResponse(`/register`, 'POST', res, 'Request failed', apiError, 'login') );
                    }
                }
            })

            // Define GET conversation route

            // Define POST conversation route
            this.router.post('/conversation', this.passport.authenticate('jwt', { session: false }), (req, res) => {
                // Check body data
                if( typeof req.body === 'undefined' || req.body === null || Object.keys(req.body).length === 0 ){ 
                    return sendBodyError(`/conversation`, 'POST', res, 'No data provided in the reqest body', 'connected')
                }
                else{
                    // Use the controller to create data
                    const { ok, extra, miss } = checkFields( Mandatory.conversation, req.body )

                    // Error: bad fields provided
                    if( !ok ){ return sendFieldsError(`/conversation`, 'POST', res, 'Bad fields provided', miss, extra, 'connected') }
                    else{
                        // Define author _id
                        req.body.author = req.user._id;

                        // Create new object
                        Controllers.conversation.createOne(req)
                        .then( apiResponse => sendApiSuccessResponse(`/conversation`, 'POST', res, 'Request succeed', apiResponse, '/connected', true) )
                        .catch( apiError => sendApiErrorResponse(`/conversation`, 'POST', res, 'Request failed', apiError, 'connected') );
                    }
                }
            })

            // Define GET conversation/:_id route
            this.router.get('/conversation/:_id', this.passport.authenticate('jwt', { session: false }), (req, res) => {
                // Create new object
                Controllers.conversation.readOne(req.params._id)
                .then( apiResponse => sendApiSuccessResponse(`/conversation/${req.params._id}`, 'GET', res, 'Request succeed', apiResponse, `conversation`, ) )
                .catch( apiError => sendApiErrorResponse(`/conversation/${req.params._id}`, 'GET', res, 'Request failed', apiError, 'connected') );
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
    module.exports = BackendRooter;
//