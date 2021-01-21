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
        constructor(){
            this.router = express.Router();
        }

        routes(){
            // Define index route
            this.router.get('/', (req, res) => {
                // Return "index.ejs" file
                return res.render('index')
            })

            // Define index route
            this.router.post('/register', (req, res) => {
                // Check body data
                if( typeof req.body === 'undefined' || req.body === null || Object.keys(req.body).length === 0 ){ 
                    return sendBodyError(`/register`, 'POST', res, 'No data provided in the reqest body', 'index')
                }
                else{
                    // Use the controller to create data
                    const { ok, extra, miss } = checkFields( Mandatory.register, req.body )

                    // Error: bad fields provided
                    if( !ok ){ return sendFieldsError(`/register`, 'POST', res, 'Bad fields provided', miss, extra, 'index') }
                    else{
                        Controllers.user.register(req)
                        .then( apiResponse => sendApiSuccessResponse(`/register`, 'POST', res, 'Request succeed', apiResponse, 'index') )
                        .catch( apiError => sendApiErrorResponse(`/register`, 'POST', res, 'Request failed', apiError, 'index') );
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