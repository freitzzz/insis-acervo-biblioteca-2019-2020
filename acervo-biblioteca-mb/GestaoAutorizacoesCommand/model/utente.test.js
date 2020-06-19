const utente = require('./utente.js');


// hasPermissionsToReporEstadoUtente function

test('if utente permissoesEspeciais value is set to "true", then hasPermissionsToReporEstadoUtente returns true', function () {

  // Arrange

  const utenteInstance = utente.create('Albale', 'Real');

  utenteInstance.permissoesEspeciais = true;

  // Act

  const hasPermissionsToReporEstadoUtente = utente.hasPermissionsToReporEstadoUtente(utenteInstance);

  // Assert

  expect(hasPermissionsToReporEstadoUtente).toBe(true);

});

test('if utente permissoesEspeciais value is set to "false", then hasPermissionsToReporEstadoUtente returns false', function () {

  // Arrange

  const utenteInstance = utente.create('Albale', 'Real');

  utenteInstance.permissoesEspeciais = false;

  // Act

  const hasPermissionsToReporEstadoUtente = utente.hasPermissionsToReporEstadoUtente(utenteInstance);

  // Assert

  expect(hasPermissionsToReporEstadoUtente).toBe(false);

});