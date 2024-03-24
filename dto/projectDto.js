export class ProjectDto {
    id;
    name;
    description;
    region;
    mainImgURL;
    planImgURL;
    details;
    createdAt;
    updatedAt;

    constructor(model) {
        this.id = model._id;
        this.name = model.name;
        this.description = model.description;
        this.region = model.region;
        this.mainImgURL = model.mainImgURL;
        this.planImgURL = model.planImgURL;
        this.details = model.details;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }
}
