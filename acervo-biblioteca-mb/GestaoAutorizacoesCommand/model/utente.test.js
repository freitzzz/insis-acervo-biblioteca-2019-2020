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

// hasPermissionsToRequire function

test('if utente estatuto == 3, and obra estado == 3 then hasPermissionsToReporEstadoUtente returns false', function () {

  // Arrange

  const utenteInstance = utente.create('Albale', 'Real');
  utenteInstance.estatuto = 3;

  // Act

  const hasPermissionsToRequire = utente.hasPermissionsToRequire(utenteInstance, 3);

  // Assert

  expect(hasPermissionsToRequire).toBe(false);

});

test('if utente estatuto == 3, and obra estado == 4 then hasPermissionsToReporEstadoUtente returns false', function () {

  // Arrange

  const utenteInstance = utente.create('Albale', 'Real');
  utenteInstance.estatuto = 3;

  // Act

  const hasPermissionsToRequire = utente.hasPermissionsToRequire(utenteInstance, 4);

  // Assert

  expect(hasPermissionsToRequire).toBe(false);

});

test('if utente estatuto == 3, and obra estado == 2 then hasPermissionsToReporEstadoUtente returns false', function () {

  // Arrange

  const utenteInstance = utente.create('Albale', 'Real');
  utenteInstance.estatuto = 3;

  // Act

  const hasPermissionsToRequire = utente.hasPermissionsToRequire(utenteInstance, 2);

  // Assert

  expect(hasPermissionsToRequire).toBe(false);

});

test('if utente estatuto == 4, and obra estado == 3 then hasPermissionsToReporEstadoUtente returns true', function () {

  // Arrange

  const utenteInstance = utente.create('Albale', 'Real');
  utenteInstance.estatuto = 4;

  // Act

  const hasPermissionsToRequire = utente.hasPermissionsToRequire(utenteInstance, 3);

  // Assert

  expect(hasPermissionsToRequire).toBe(true);

});

test('if utente estatuto == 4, and obra estado == 2 then hasPermissionsToReporEstadoUtente returns false', function () {

  // Arrange

  const utenteInstance = utente.create('Albale', 'Real');
  utenteInstance.estatuto = 4;

  // Act

  const hasPermissionsToRequire = utente.hasPermissionsToRequire(utenteInstance, 2);

  // Assert

  expect(hasPermissionsToRequire).toBe(false);

});

test('if utente estatuto == 4, and obra estado == 4 then hasPermissionsToReporEstadoUtente returns false', function () {

  // Arrange

  const utenteInstance = utente.create('Albale', 'Real');
  utenteInstance.estatuto = 4;

  // Act

  const hasPermissionsToRequire = utente.hasPermissionsToRequire(utenteInstance, 4);

  // Assert

  expect(hasPermissionsToRequire).toBe(false);

});

test('if utente estatuto == 5, and obra estado == 3 then hasPermissionsToReporEstadoUtente returns true', function () {

  // Arrange

  const utenteInstance = utente.create('Albale', 'Real');
  utenteInstance.estatuto = 5;

  // Act

  const hasPermissionsToRequire = utente.hasPermissionsToRequire(utenteInstance, 3);

  // Assert

  expect(hasPermissionsToRequire).toBe(true);

});

test('if utente estatuto == 5, and obra estado == 2 then hasPermissionsToReporEstadoUtente returns true', function () {

  // Arrange

  const utenteInstance = utente.create('Albale', 'Real');
  utenteInstance.estatuto = 5;

  // Act

  const hasPermissionsToRequire = utente.hasPermissionsToRequire(utenteInstance, 2);

  // Assert

  expect(hasPermissionsToRequire).toBe(true);

});

test('if utente estatuto == 5, and obra estado == 4 then hasPermissionsToReporEstadoUtente returns false', function () {

  // Arrange

  const utenteInstance = utente.create('Albale', 'Real');
  utenteInstance.estatuto = 5;

  // Act

  const hasPermissionsToRequire = utente.hasPermissionsToRequire(utenteInstance, 4);

  // Assert

  expect(hasPermissionsToRequire).toBe(false);

});

test('if utente estatuto == 6, and obra estado == 6 then hasPermissionsToReporEstadoUtente returns false', function () {

  // Arrange

  const utenteInstance = utente.create('Albale', 'Real');
  utenteInstance.estatuto = 6;

  // Act

  const hasPermissionsToRequire = utente.hasPermissionsToRequire(utenteInstance, 6);

  // Assert

  expect(hasPermissionsToRequire).toBe(false);

});