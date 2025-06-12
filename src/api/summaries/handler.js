class SummariesHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSummaryHandler = this.postSummaryHandler.bind(this);
    this.getSummariesHandler = this.getSummariesHandler.bind(this);
    this.getSummaryByIdHandler = this.getSummaryByIdHandler.bind(this);
    this.putSummaryByIdHandler = this.putSummaryByIdHandler.bind(this);
    this.deleteSummaryByIdHandler = this.deleteSummaryByIdHandler.bind(this);
  }

  async postSummaryHandler(request, h) {
    this._validator.validatePostSummaryPayload(request.payload);
    const { language, originalContent } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const summary = await this._service.createSummary({
      language, originalContent, owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      message: 'The summary has been successfully created.',
      data: summary,
    });
    response.code(201);
    return response;
  }

  async getSummariesHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const summaries = await this._service.getSummaries(credentialId);
    return {
      status: 'success',
      data: {
        summaries,
      },
    };
  }

  async getSummaryByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifySummaryOwner(id, credentialId);
    const summary = await this._service.getSummaryById(id);

    return {
      status: 'success',
      data: {
        summary,
      },
    };
  }

  async putSummaryByIdHandler(request) {
    this._validator.validatePutSummaryPayload(request.payload);
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifySummaryOwner(id, credentialId);
    await this._service.editSummaryById(id, request.payload);

    return {
      status: 'success',
      message: 'The summary has been successfully updated.',
    };
  }

  async deleteSummaryByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifySummaryOwner(id, credentialId);
    await this._service.deleteSummaryById(id);
    return {
      status: 'success',
      message: 'The summary has been successfully deleted.',
    };
  }
}

module.exports = SummariesHandler;
