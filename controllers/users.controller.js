const model = require('../models/users.model');

function postUser(req, res) {
    if (!req.body.name) {
        return res.status(400).json({
            error: 'Missing user name'
        });
    }

    if (!req.body.email) {
        return res.status(400).json({
            error: 'Missing user email'
        });
    } else {
        const user = model.find(user => user.email === req.body.email);
        if (user) {
            return res.status(409).json({
                error: 'User email already existed'
            });
        }
    }

    const newUser = {
        id: model.length + 1,
        name: req.body.name,
        email: req.body.email
    }
    model.push(newUser);

    res.status(201).json(newUser);
}

function getUsers(req, res) {
    res.json(model);
}

function getUser(req, res) {
    const { userId } = req.params;
    const user = model.find(user => user.id === Number(userId));

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({
            error: 'User not found'
        });
    }
}

function putUser(req, res) {
    const { userId } = req.params;
    const { name, email } = req.body;
    const index = model.findIndex(user => user.id === Number(userId));

    if (!model[index]) {
        res.status(404).json({
            error: 'User not found'
        });
    } else {
        model[index].name = name;
        model[index].email = email;

        res.status(200).json(model[index]);
    }
}

function deleteUser(req, res) {
    const { userId } = req.params;
    const index = model.findIndex(user => user.id === Number(userId));

    if (!model[index]) {
        res.status(404).json({
            error: 'User not found'
        });
    } else {
        const deletedUser = model[index];
        model.splice(index, 1);
        res.status(200).json(deletedUser);
    }
}

module.exports = {
    postUser,
    getUsers,
    getUser,
    putUser,
    deleteUser
}