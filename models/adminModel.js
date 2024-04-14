import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema(
    {
        login: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['admin', 'superadmin'],
            default: 'admin',
        },
        region: {
            type: String,
            required: true,
        },
        activationLink: {
            type: String,
        },
        isActivated: {
            type: Boolean,
            default: false,
        },
        resetPasswordToken: {
            type: String,
        },
        resetPasswordExpires: {
            type: Date,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Admin', AdminSchema);
