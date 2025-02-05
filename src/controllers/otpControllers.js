const Otp = require('../models/Otp');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const CandidateUser = require('../models/Candidate');
const RecruiterUser = require('../models/Recruiter');

const verifyOtp = async (req, res) => {
    try {
        const { otp, type, email } = req.body;

        console.log('Received request body:', req.body);

        if (!otp || !type || !email) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        console.log('Finding user...');
        let existingUser = await CandidateUser.findOne({ email });
        let userType = 'CandidateUser';

        if (!existingUser) {
            existingUser = await RecruiterUser.findOne({ email });
            userType = 'RecruiterUser';
        }

        if (!existingUser) {
            return res.status(400).json({ message: 'Invalid Email.' });
        }

        console.log('Finding OTP...');
        const otpExist = await Otp.findOne({ user: existingUser._id, userType, otp, type });

        if (!otpExist) {
            return res.status(400).json({ message: 'Invalid OTP.' });
        }

        if (otpExist.expires_at < new Date()) {
            return res.status(400).json({ message: 'OTP has expired.' });
        }

        if (type === 'register') {
            existingUser.email_verified = true;
            await existingUser.save();

            const subject = 'Email Verified Successfully';
            const message = `Hello ${existingUser.name},<br>Your email has been successfully verified.`;
            const send_to = email;
            const sent_from = process.env.EMAIL_USER;
            const reply_to = process.env.EMAIL_USER;

            await sendEmail(subject, message, send_to, sent_from, reply_to);
        }

        await Otp.deleteMany({ user: existingUser._id, userType, type });

        return res.status(200).json({ message: 'OTP verified successfully.' });
    } catch (error) {
        console.error('Error during OTP verification:', error);
        return res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};

const resendOtp = async (req, res) => {
    try {
        const { email, type } = req.body;

        if (!email || !type) return res.status(400).json({ message: 'Missing required parameters.' });

        let existingUser = await CandidateUser.findOne({ email });
        let userType = 'CandidateUser';

        if (!existingUser) {
            existingUser = await RecruiterUser.findOne({ email });
            userType = 'RecruiterUser';
        }

        if (!existingUser) return res.status(400).json({ message: 'Invalid Email.' });

        const existingOtp = await Otp.findOne({ user: existingUser._id, userType, type });

        if (existingOtp && existingOtp.expires_at > new Date()) {
            return res.status(400).json({ message: 'An OTP has already been sent. Please wait for it to expire before requesting a new one.' });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 20 * 60 * 1000); // 20 minutes

        if (existingOtp) {
            existingOtp.otp = otp;
            existingOtp.expires_at = expiresAt;
            await existingOtp.save();
        } else {
            await Otp.create({ user: existingUser._id, userType, otp, type, expires_at: expiresAt });
        }

        const subject = 'Your OTP Code';
        const message = `Your OTP code is: <strong>${otp}</strong>. It will expire in 20 minutes.`;
        const send_to = email;
        const sent_from = process.env.EMAIL_USER;
        const reply_to = process.env.EMAIL_USER;

        await sendEmail(subject, message, send_to, sent_from, reply_to);

        console.log(`OTP for ${email}: ${otp}`);

        return res.status(200).json({ message: 'OTP resent successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

module.exports = { verifyOtp, resendOtp };
