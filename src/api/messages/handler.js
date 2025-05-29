class MessagesHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postMessageHandler = this.postMessageHandler.bind(this);
  }

  async postMessageHandler(request, h) {
    this._validator.validatePostMessagePayload(request.payload);
    const { name, email, message } = request.payload;

    await this._service.addMessage({ name, email, message });

    const response = h.response({
      status: 'success',
      message: 'Your message has been successfully added.',
    });
    response.code(201);
    return response;
  }
}

module.exports = MessagesHandler;
