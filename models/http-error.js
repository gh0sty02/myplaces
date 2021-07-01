class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); // adds a message to the error
    this.code = errorCode;
  }
}

module.exports = HttpError;
