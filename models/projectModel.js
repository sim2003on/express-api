import mognoose from 'mongoose';

const ProjectSchema = new mognoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        region: {
            type: String,
            required: true,
        },
        mainImgURL: {
            type: String,
            required: true,
        },
        planImgURL: {
            type: String,
            required: true,
        },
        projectFolder: {
            type: String,
            required: true,
        },
        mainImgFileName: {
            type: String,
            required: true,
        },
        planImgFileName: {
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
    },
    { timestamps: true },
);

export default mognoose.model('Project', ProjectSchema);
