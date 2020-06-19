const utente = require('./utente.js');

// "estado" function

test('if utente estatuto value is equal to 2, then estado returns "ativo" string', function () {

  // Arrange

  const utenteInstance = utente.create('Albale', 'Real');

  // Act

  utenteInstance.estatuto = 2;

  const estado = utente.estado(utenteInstance);

  // Assert

  expect(estado).toBe('ativo');

});

test('if utente estatuto value is greater than 2, then estado returns "ativo" string', function () {

  // Arrange

  const utenteInstance = utente.create('Albale', 'Real');

  // Act

  utenteInstance.estatuto = 2.2;

  const estado = utente.estado(utenteInstance);

  // Assert

  expect(estado).toBe('ativo');

});

test('if utente estatuto value is less than 2 and dataHoraFinalSuspensao is greater than current date then, estado returns "suspenso" string', function () {

  // Arrange

  const utenteInstance = utente.create('Albale', 'Real');

  const currentDate = new Date();

  const currentDateInTwoMonths = currentDate.setMonth(currentDate.getMonth() + 2);

  // Act

  utenteInstance.estatuto = 1.9;

  utenteInstance.dataHoraFinalSuspensao = currentDateInTwoMonths;

  const estado = utente.estado(utenteInstance);

  // Assert

  expect(estado).toBe('suspenso');

});

test('if utente estatuto value is less than 2 but dataHoraFinalSuspensao is less than current date, then estado returns "ativo" string', function () {

  // Arrange

  const utenteInstance = utente.create('Albale', 'Real');

  const currentDate = new Date();

  const currentDateLessTwoMonths = currentDate.setMonth(currentDate.getMonth() - 2);

  // Act

  utenteInstance.estatuto = 1.9;

  utenteInstance.dataHoraFinalSuspensao = currentDateLessTwoMonths;

  const estado = utente.estado(utenteInstance);

  // Assert

  expect(estado).toBe('ativo');

});

test('if utente estatuto value is less than 1, then estado returns "inativo" string', function () {

  // Arrange

  const utenteInstance = utente.create('Albale', 'Real');

  // Act

  utenteInstance.estatuto = 0.5;

  const estado = utente.estado(utenteInstance);

  // Assert

  expect(estado).toBe('inativo');

});

// isUtenteInativo function

test('if utente estado returns "ativo", then isUtenteInativo returns false', function () {

  // Arrange

  const utenteInstance = utente.create('Albale', 'Real');

  // Act

  utenteInstance.estatuto = 2;

  const isUtenteInativo = utente.isUtenteInativo(utenteInstance);

  // Assert

  expect(isUtenteInativo).toBe(false);

});

test('if utente estado returns "suspenso", then isUtenteInativo returns false', function () {

  // Arrange

  const utenteInstance = utente.create('Albale', 'Real');

  // Act

  utenteInstance.estatuto = 1.9;

  const isUtenteInativo = utente.isUtenteInativo(utenteInstance);

  // Assert

  expect(isUtenteInativo).toBe(false);

});

test('if utente estado returns "inativo", then isUtenteInativo returns true', function () {

  // Arrange

  const utenteInstance = utente.create('Albale', 'Real');

  // Act

  utenteInstance.estatuto = 0.99;

  const isUtenteInativo = utente.isUtenteInativo(utenteInstance);

  // Assert

  expect(isUtenteInativo).toBe(true);

});

// isEstatutoValueEnoughToReporEstado function

test('if utente estatuo is greater than 2, then isEstatutoValueEnoughToReporEstado returns true', function () {

  // Arrange

  const estatuto = 2.1;

  // Act

  const isUtenteInativo = utente.isEstatutoValueEnoughToReporEstado(estatuto);

  // Assert

  expect(isUtenteInativo).toBe(true);

});

test('if utente estatuo is equal to 2, then isEstatutoValueEnoughToReporEstado returns true', function () {

  // Arrange

  const estatuto = 2;

  // Act

  const isUtenteInativo = utente.isEstatutoValueEnoughToReporEstado(estatuto);

  // Assert

  expect(isUtenteInativo).toBe(true);

});

test('if utente estatuo is less than 2, then isEstatutoValueEnoughToReporEstado returns false', function () {

  // Arrange

  const estatuto = 1.9;

  // Act

  const isUtenteInativo = utente.isEstatutoValueEnoughToReporEstado(estatuto);

  // Assert

  expect(isUtenteInativo).toBe(false);

});