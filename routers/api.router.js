/*
Imports
*/
    // Node
    const express = require('express');
const Controllers = require('../controllers/index');

    // Inner
    const Controller = require('../controllers/index')
    const Mandatory = require('../services/mandatory.service');
    const { checkFields } = require('../services/request.service');
//

/* 
Router definition
*/
    class ApiRooter{
        constructor(){
            this.router = express.Router();
        }

        routes(){
            // CRUD: Create one item
            this.router.post('/:endpoint', (req, res) => {
                // Check body data
                if( typeof req.body === 'undefined' || req.body === null || Object.keys(req.body).length === 0 ){ 
                    return res.json( { 
                        route: `/api/${req.params.endpoint}}` ,
                        method: 'POST',
                        msg: 'No data provided',
                        err: null,
                        data: null
                    })
                }
                else{
                    // Use the controller to create data
                    const { ok, extra, miss } = checkFields( Mandatory[req.params.endpoint], req.body )

                    // Error: bad fields provided
                    if( !ok ){
                        return res.json( { 
                            route: `/api/${req.params.endpoint}}` ,
                            method: 'POST',
                            msg: 'Bad fileds provided',
                            err: { miss, extra },
                            data: null
                        })
                    }
                    else{
                        // Create new object
                        Controllers[req.params.endpoint].createOne(req)
                        .then( apiReponse => {
                            return res.json( { 
                                route: `/api/${req.params.endpoint}}` ,
                                method: 'POST',
                                msg: 'Data created',
                                err: null,
                                data: apiReponse
                            })
                        })
                        .catch( apiError => {
                            return res.json( { 
                                route: `/api/${req.params.endpoint}}` ,
                                method: 'POST',
                                msg: 'Data not created',
                                err: apiError,
                                data: null
                            })
                        })
                    }
                }
            })

            // CRUD: Read all item
            this.router.get('/:endpoint', (req, res) => {
                // Use the controller to get all data
                Controllers[req.params.endpoint].readAll()
                .then( apiReponse => {
                    return res.json( { 
                        route: `/api/${req.params.endpoint}` ,
                        method: 'GET',
                        msg: 'Data found',
                        err: null,
                        data: apiReponse
                    })
                })
                .catch( apiError => {
                    return res.json( { 
                        route: `/api/${req.params.endpoint}` ,
                        method: 'GET',
                        msg: 'Data not found',
                        err: apiError,
                        data: null
                    })
                })
            })

            // CRUD: Read one item
            this.router.get('/:endpoint/:_id', (req, res) => {
                // Use the controller to get one data
                Controllers[req.params.endpoint].readOne(req)
                .then( apiReponse => {
                    return res.json( { 
                        route: `/api/${req.params.endpoint}/${req.params._id}` ,
                        method: 'GET',
                        msg: 'Data found',
                        err: null,
                        data: apiReponse
                    })
                })
                .catch( apiError => {
                    return res.json( { 
                        route: `/api/${req.params.endpoint}/${req.params._id}` ,
                        method: 'GET',
                        msg: 'Data not found',
                        err: apiError,
                        data: null
                    })
                })
            })

            // CRUD: Update all item
            this.router.put('/:endpoint/:_id', (req, res) => {
                // Check body data
                if( typeof req.body === 'undefined' || req.body === null || Object.keys(req.body).length === 0 ){ 
                    return res.json( { 
                        route: `/api/${req.params.endpoint}/${req.params._id}` ,
                        method: 'PUT',
                        msg: 'No data provided',
                        err: null,
                        data: null
                    })
                }
                else{
                    // Check body properties
                    const { ok, extra, miss } = checkFields(Mandatory[req.params.endpoint])

                    // Error: bad fields provided
                    if( !ok ){
                        return res.json( { 
                            route: `/api/${req.params.endpoint}/${req.params._id}` ,
                            method: 'PUT',
                            msg: 'Bad fileds provided',
                            err: { miss, extra },
                            data: null
                        })
                    }
                    else{
                        // Use the controller to update data
                        Controllers[req.params.endpoint].updateOne(req)
                        .then( apiReponse => {
                            return res.json( { 
                                route: `/api/${req.params.endpoint}/${req.params._id}` ,
                                method: 'PUT',
                                msg: 'Data created',
                                err: null,
                                data: apiReponse
                            })
                        })
                        .catch( apiError => {
                            return res.json( { 
                                route: `/api/${req.params.endpoint}}` ,
                                method: 'PUT',
                                msg: 'Data not created',
                                err: apiError,
                                data: null
                            })
                        })
                    }
                }
            })

            // CRUD: Delete all item
            this.router.delete('/:endpoint/:_id', (req, res) => {
                // Use the controller to delete data
                Controllers[req.params.endpoint].deleteOne(req)
                .then( apiReponse => {
                    return res.json( { 
                        route: `/api/${req.params.endpoint}/${req.params._id}` ,
                        method: 'DELETE',
                        msg: 'Data deleted',
                        err: null,
                        data: apiReponse
                    })
                })
                .catch( apiError => {
                    return res.json( { 
                        route: `/api/${req.params.endpoint}/${req.params._id}` ,
                        method: 'DELETE',
                        msg: 'Data not deleted',
                        err: apiError,
                        data: null
                    })
                })
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