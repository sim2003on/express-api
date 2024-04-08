export class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.message = message;
    }

    static BadRequestExeption(message) {
        return new ApiError(400, message);
    }

    static UnauthorizedExeption(message) {
        return new ApiError(401, message || 'Нет доступа.');
    }

    static ForbiddenExeption(message) {
        return new ApiError(403, message);
    }

    static NotFoundExeption(message) {
        return new ApiError(404, message);
    }

    static ConflictExeption(message) {
        return new ApiError(409, message);
    }
}
