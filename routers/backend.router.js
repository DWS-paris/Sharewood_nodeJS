/*
Imports
*/
    // Node
    const express = require('express');
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