import mongoose from 'mongoose';

const TokenSchema = new mongoose.Schema(
    {
        admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
        refreshToken: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

export default mongoose.model('Token', TokenSchema);
