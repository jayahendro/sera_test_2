const amqp = require('amqplib/callback_api');
require('dotenv').config();

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

	amqp.connect(`${process.env.RABBITMQ_CONNECTION}://${process.env.RABBITMQ_HOST}`, (error0, connection) => {
		if (error0) {
			return res.status(500).json({
				error: 'Failed to connect to RabbitMQ'
			});
		}

		connection.createChannel((error1, channel) => {
			if (error1) {
				return res.status(500).json({
					error: 'Failed to create channel to RabbitMQ'
				});
			}

			const queue = 'email';

			channel.assertQueue(queue, {
				durable: false
			});
			channel.sendToQueue(queue, Buffer.from(newUser.email))

			setTimeout(() => {
				connection.close();
				res.status(201).json(newUser);
			}, 500);
		});
	});
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