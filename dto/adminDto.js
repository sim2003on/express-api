export class AdminDto {
    login;
    email;
    role;
    id;

    constructor(model) {
        this.email = model.email;
        this.phone = model.phone;
        this.id = model._id;
        this.login = model.login;
        this.role = model.role;
    }
}
