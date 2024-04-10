export class PortfolioDto {
    id;
    name;
    description;
    imgURL;
    details;
    isIndividual;
    createdAt;
    updatedAt;
    constructor(model) {
        this.id = model._id;
        this.name = model.name;
        this.description = model.description;
        this.imgURL = model.imgURL;
        this.details = model.details;
        this.isIndividual = model.isIndividual;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }
}
