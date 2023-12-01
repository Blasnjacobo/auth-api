exports.jsonResponse = function (statusCode, body) { // Es lo que voy a incluir como respuesta en cada solicitud HTTP
  return {
    statusCode,
    body
  }
}
