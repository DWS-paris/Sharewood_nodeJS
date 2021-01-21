/*
Imports
*/
    // Node
    const express = require('express');

    // Inner
    const Controllers = require('../controllers/index')
    const Mandatory = require('../services/mandatory.service');
    const { checkFields } = require('../services/request.service');
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
                    return sendBodyError(`/register`, 'POST', res, 'No data provided in the reqest body')
                }
                else{
                    // Use the controller to create data
                    const { ok, extra, miss } = checkFields( Mandatory.register, req.body )

                    // Error: bad fields provided
                    if( !ok ){ return sendFieldsError(`/register`, 'POST', res, 'Bad fields provided', miss, extra) }
                    else{
                        // Create new object
                        Controllers.user.register(req)
                        .then( apiResponse => {
                            res.render( 'index', { data: apiResponse, err: null } )
                        })
                        .catch( apiError => {
                            res.render( 'index', { data: null, err: apiError } )
                        });
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