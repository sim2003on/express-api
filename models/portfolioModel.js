import mongoose from 'mongoose';

const PortfolioSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        imgURL: {
            type: String,
            required: true,
        },
        portfolioFolder: {
            type: String,
            required: true,
        },
        imgName: {
            type: String,
            required: true,
        },
        details: {
            totalArea: {
                type: Number,
                required: true,
            },
            foundation: {
                type: String,
                required: true,
            },
            loadBearingWalls: {
                type: String,
                required: true,
            },
            partitions: {
                type: String,
                required: true,
            },
            roofCovering: {
                type: String,
                required: true,
            },
            facadeFinishing: {
                type: String,
                required: true,
            },
            style: {
                type: String,
                required: true,
            },
            numberOfBathrooms: {
                type: Number,
                required: true,
            },
            numberOfBedrooms: {
                type: Number,
                required: true,
            },
        },
        isIndividual: {
            type: Boolean,
            required: true,
        },
    },
    { timestamps: true },
);

export default mongoose.model('Portfolio', PortfolioSchema);
