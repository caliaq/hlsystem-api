export class AppError extends Error {
  constructor(path, value, statusCode) {
    // call the parent constructor (parsed error message)
    super(`${path.toUpperCase()}:${value} is invalid`);

    // the entity that caused an error
    this.path = path;

    // the value of the entity that caused an error
    this.value = value;

    // the status code that will be sent to the client
    this.statusCode = statusCode;
  }
}
