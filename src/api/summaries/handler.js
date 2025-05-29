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

    const summary = await this._service.createSummary({ language, originalContent });

    const response = h.response({
      status: 'success',
      message: 'Ringkasan berhasil dibuat',
      data: summary,
    });
    response.code(201);
    return response;
  }

  getSummariesHandler() {
    const summaries = this._service.getSummaries();
    return {
      status: 'success',
      data: summaries,
    };
  }

  getSummaryByIdHandler(request) {
    const { id } = request.params;
    const summary = this._service.getSummaryById(id);
    return {
      status: 'success',
      data: summary,
    };
  }

  putSummaryByIdHandler(request) {
    this._validator.validatePutSummaryPayload(request.payload);
    const { id } = request.params;

    this._service.editSummaryById(id, request.payload);

    return {
      status: 'success',
      message: 'Ringkasan berhasil diperbarui',
    };
  }

  deleteSummaryByIdHandler(request) {
    const { id } = request.params;
    this._service.deleteSummaryById(id);
    return {
      status: 'success',
      message: 'Ringkasan berhasil dihapus',
    };
  }
}

module.exports = SummariesHandler;
