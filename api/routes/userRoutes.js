'use strict';
module.exports = function(app,jwt) {
    var userController = require('../controllers/userController');
    app.route('/users')
        .get(jwt({secret:'h4pp1 h4ck1ng'}),userController.list_all_users)
        .post(userController.create_a_user);

    app.route('/access')
        .get(userController.sign_in);
    /*app.route('/users/:userId')
        .get(userController.get_user)
        .put(userController.update_a_user)
        .delete(userController.delete_a_user);*/
};
