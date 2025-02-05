const CandidateUser = require('../models/Candidate');
const RecruiterUser = require('../models/Recruiter');
const Otp = require('../models/Otp');
const multer = require("multer");
const crypto = require('crypto');
const cloudinary = require("../config/cloudinary");
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcryptjs')

const registerCandidate = async (req, res) => {
    try {
        const { name, username, email, password, jobTitle, experience, skills, roles, resume, qualifications, jobLocation, workType, salary, availability, currentJob, professionalExperience, professionalSkill, preferredRole } = req.body;

        console.log("Request Body:", req.body);

        if (!name || !username || !email || !password || !currentJob || !professionalExperience || !professionalSkill || !preferredRole) {
            return res.status(400).json({ message: "Missing required field" });
        }

        const existingUser = await CandidateUser.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        let avatarUrl = "";
        if (req.file) {
            try {
                const cloudImage = await cloudinary.uploader.upload(req.file.path, {
                    folder: "avatar"
                });
                avatarUrl = cloudImage.secure_url;
            } catch (error) {
                return res.status(500).json({ message: "Error uploading image to Cloudinary.", error: error.message });
            }
        }

        const user = new CandidateUser({
            name,
            username,
            email,
            password,
            avatar: avatarUrl,
            jobTitle,
            experience,
            skills,
            roles,
            resume,
            qualifications,
            jobLocation,
            workType,
            salary,
            availability,
            currentJob,
            professionalExperience,
            professionalSkill,
            preferredRole
        });

        await user.save();

        const otp = crypto.randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await Otp.create({
            user: user._id,
            userType: 'CandidateUser',
            otp,
            type: 'register',
            expires_at: expiresAt
        });

        const subject = 'Your OTP Code';
        const message = `Your OTP code is: <strong>${otp}</strong>. It will expire in 10 minutes.`;
        const send_to = email;
        const sent_from = process.env.EMAIL_USER;
        const reply_to = process.env.EMAIL_USER;

        await sendEmail(subject, message, send_to, sent_from, reply_to);

        console.log(`OTP for ${email}: ${otp}`);

        return res.status(201).json({ message: "User registered successfully, check your email for OTP", user });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const registerRecruiter = async (req, res) => {
    try {
        const { name, username, email, password, companyName, companySize, industry, roles, jobTitle, qualification, briefIntroduction } = req.body;

        console.log("Request Body:", req.body);

        if (!name || !username || !email || !password || !companyName || !companySize || !industry || !roles || !jobTitle || !qualification || !briefIntroduction) {
            console.log("Missing fields:", {name, username, email, password, currentJob, professionalExperience, professionalSkill, preferredRole});
            return res.status(400).json({ message: "Missing required fields." });
        }

        const existingUser = await RecruiterUser.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists." });
        }

        let avatarUrl = "";
        if (req.file) {
            try {
                const cloudImage = await cloudinary.uploader.upload(req.file.path, {
                    folder: "avatar"
                });
                avatarUrl = cloudImage.secure_url;
            } catch (error) {
                return res.status(500).json({ message: "Error uploading image to Cloudinary.", error: error.message });
            }
        }

        const user = new RecruiterUser({
            name,
            username,
            email,
            password,
            avatar: avatarUrl,
            companyName,
            companySize,
            industry,
            roles,
            jobTitle,
            qualification,
            briefIntroduction
        });

        user.password = await bcrypt.hash(password, 10);

        await user.save();

        const otp = crypto.randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expiry time (10 minutes)

        await Otp.create({
            user: user._id,
            userType: 'RecruiterUser',
            otp,
            type: 'register',
            expires_at: expiresAt
        });

        const subject = 'Your OTP Code';
        const message = `Your OTP code is: <strong>${otp}</strong>. It will expire in 10 minutes.`;
        const send_to = email;
        const sent_from = process.env.EMAIL_USER;
        const reply_to = process.env.EMAIL_USER;

        await sendEmail(subject, message, send_to, sent_from, reply_to);

        console.log(`OTP for ${email}: ${otp}`);

        return res.status(201).json({ message: "Recruiter user registered successfully, OTP sent to email.", user });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const login = async (req,res)=>{
    try {
        const {email, password} = req.body

        if(!email || !password){
            return res.status(400).json({message: "invalid email or password"})
        }

        
    } catch (error) {
        
    }
}

module.exports = {
    registerCandidate,
    registerRecruiter,
};
