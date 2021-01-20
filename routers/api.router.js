/*
Imports
*/
    // Node
    const express = require('express');
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
               return res.json( { 
                   route: `/api/${req.params.endpoint}` ,
                   method: 'POST'
                })
            })

            // CRUD: Read all item
            this.router.get('/:endpoint/:_id', (req, res) => {
                return res.json( { 
                    route: `/api/${req.params.endpoint}/${req.params._id}` ,
                    method: 'GET'
                })
            })

            // CRUD: Read one item
            this.router.get('/:endpoint', (req, res) => {
                return res.json( { 
                    route: `/api/${req.params.endpoint}` ,
                    method: 'GET'
                })
            })

            // CRUD: Update all item
            this.router.put('/:endpoint/:_id', (req, res) => {
                return res.json( { 
                    route: `/api/${req.params.endpoint}/${req.params._id}` ,
                    method: 'PUT'
                })
            })

            // CRUD: Delete all item
            this.router.delete('/:endpoint/:_id', (req, res) => {
                return res.json( { 
                    route: `/api/${req.params.endpoint}/${req.params._id}` ,
                    method: 'DELETE'
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