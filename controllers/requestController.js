const Request = require('../models/requestModel');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { sendWelcomeEmail } = require('../nodemailer/email');
require('dotenv').config()

class RequestController {
    async createRequest(req, res) {
        try {
            const { services, full_name, email, organisation } = req.body;

            if (!services || !Array.isArray(services) || services.length === 0) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'At least one service is required'
                });
            }
            if (!full_name || !email || !organisation) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'All customer fields are required'
                });
            }

            const ticket_number = `TCK-${Math.floor(100000 + Math.random() * 900000)}`;

            const requestData = {
                service: services,  // store array in JSONB column
                full_name,
                email,
                organisation,
                ticket_number
            };

            const request = await Request.create(requestData);

            return res.status(201).json({
                status: 201,
                success: true,
                message: 'Request sent successfully',
                data: request
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: 500,
                success: false,
                message: 'Error occurred',
                error: error.message
            });
        }
    }

    async getAllRequest(req, res) {
        try {
            const request = await Request.findAll({ order: [['createdAt', 'DESC']] });

            if (request.length === 0) {
                return res.status(200).json({
                    status: 200,
                    success: true,
                    message: 'No request received yet',
                    data: []
                });
            } else {
                return res.status(200).json({
                    status: 200,
                    success: true,
                    message: 'Requests fetched successfully',
                    data: request
                });
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: 500,
                success: false,
                message: 'Error occurred',
                error: error.message
            });
        }
    }

    async registerUser(req, res) {
        try {
            const { full_name, email, password } = req.body;


            if (!full_name || !email || !password) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'All fields are required'
                });
            }

            const user = await User.findOne({ where: { email } });

            if (user) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'User Already exists'
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const Data = {
                full_name,  // store array in JSONB column
                password: hashedPassword,
                email
            };

            const result = await User.create(Data);

            return res.status(201).json({
                status: 201,
                success: true,
                message: 'User Created Successfully',
                data: result
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: 500,
                success: false,
                message: 'Error occurred',
                error: error.message
            });
        }
    }

    async login(req, res) {
        try {

            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'All fields are required'
                });
            }

            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'User is not found'
                });
            }

            const match = await bcrypt.compare(password, user.password)

            if(!match){
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'Password is not correct'
                });
            }

            const token = await jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '7d'});

            res.cookie('accessToken', token, {
                secure: false,
                httpOnly: false,
                sameSite: 'none',
                maxAge: 15 * 60 * 1000
            })

            const data = {
                id: user.id,
                full_name: user.full_name,
                email: user.email
            }

            return res.status(200).json({
                status: 200,
                success: true,
                message: 'Loggedin successfully',
                data: data,
                token
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: 500,
                success: false,
                message: 'Error occurred',
                error: error.message
            });
        }
    }
}

module.exports = RequestController