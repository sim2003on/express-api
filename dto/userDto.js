export class UserDto {
    email;
    phone;
    id;
    isActivated;

    constructor(model) {
        this.email = model.email;
        this.phone = model.phone;
        this.id = model._id;
        this.isActivated = model.isActivated;
    }
}
