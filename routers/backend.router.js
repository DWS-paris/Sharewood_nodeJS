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
                // Return "index.ejs" file
                return sendApiSuccessResponse(`/register`, 'GET', res, 'Request succeed', null, 'connected')
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