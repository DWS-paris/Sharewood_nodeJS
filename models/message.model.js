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
        '@type': { type: String, default: 'Message' },

        text: String,

        // Associer le profil utilisateur
        author: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },

        // Associer la conversation
        isPartOf: {
            type: Schema.Types.ObjectId,
            ref: 'conversation'
        },

        // Définir une valeur par défaut
        dateReceived: { type: Date, default: new Date() },
        isPublished: { type: Boolean, default: true }
    })
//

/* 
Export
*/
    module.exports = mongoose.model('message', MySchema);
//