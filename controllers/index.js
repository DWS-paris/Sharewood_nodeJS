/* 
Definition
*/
    const Controllers = {
        conversation: require('./conversation.controller'),
        message: require('./message.controller'),
        post: require('./post.controller'),
        user: require('./user.controller')
    }
//

/* 
Export
*/
    module.exports = Controllers;
//