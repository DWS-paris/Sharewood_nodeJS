/* 
Definition
*/
    const Mandatory = {
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