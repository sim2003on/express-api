export class AdminDto {
    id;
    login;
    email;
    role;
    region;
    isActivated;

    constructor(model) {
        this.id = model._id;
        this.email = model.email;
        this.login = model.login;
        this.role = model.role;
        this.region = model.region;
        this.isActivated = model.isActivated;
    }
}
