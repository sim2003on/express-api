export class AdminDto {
    id;
    login;
    email;
    role;

    constructor(model) {
        this.id = model._id;
        this.email = model.email;
        this.login = model.login;
        this.role = model.role;
    }
}
