export default class ApiError extends Error {
    status:number;
    errors:Array<any>;
    errorType: string;

    constructor(status:number, errorType:string, message:string, errors:Array<any> = []) {
        super(message);
        this.status = status;
        this.errors = errors;
        this.errorType = errorType;
    }

    static BadRequest(status:number, errorType:string, message:string, errors:Array<any> = []) {
        return new ApiError(status, errorType, message, errors);
    }
}