/*
Import
*/
    const mongoose = require('mongoose');
    const { Schema } = mongoose;
//

/* 
Definition
*/
    const MySchema = new Schema({
        // Schema.org
        '@context': { type: String, default: 'http://schema.org' },
        '@type': { type: String, default: 'Conversation' },

        description: String,

        // Associer les profils utilisateurs
        contributors: [{
            type: Schema.Types.ObjectId,
            ref: 'user',
            default: []
        }],

        // Associer les messages
        messages: [{
            type: Schema.Types.ObjectId,
            ref: 'message',
            default: []
        }],

        author: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },

        // Définir une valeur par défaut
        creationDate: { type: Date, default: new Date() },
        isPublished: { type: Boolean, default: true }
    })
//

/* 
Export
*/
    module.exports = mongoose.model('conversation', MySchema);
//