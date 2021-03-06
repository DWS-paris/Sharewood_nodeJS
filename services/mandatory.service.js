/* 
Definition
*/
    const Mandatory = {
        conversation: ['description'],
        message: ['text', 'isPartOf'],
        post: ['headline', 'body'],
        register: ['givenName', 'familyName', 'password', 'email'],
        login: ['email', 'password'],
    }
//

/* 
Export
*/
    module.exports = Mandatory;
//