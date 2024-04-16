import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema(
    {
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
        },
        details: {
            firstName: {
                type: String,
                required: true,
            },
            lastName: {
                type: String,
                required: true,
            },
            middleName: {
                type: String,
                required: true,
            },
            managerLastName: {
                type: String,
                required: true,
            },
            bankName: {
                type: String,
                required: true,
            },
            leadSource: {
                type: String,
                required: true,
            },
            stages: {
                type: String,
                required: true,
            },
            area_sqm: {
                type: String,
                required: true,
            },
            price_per_sqm: {
                type: String,
                required: true,
            },
            netProfit_rub: {
                type: String,
                required: true,
            },
        },
    },
    { timestamps: true },
);

export default mongoose.model('Report', ReportSchema);
