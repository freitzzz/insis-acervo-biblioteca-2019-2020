const utente = require('./utente.js');


test('if utente estatuto value is equal to 2, then estado returns "ativo" string', function () {

  // Arrange

  const utenteInstance = utente.create('Albale', 'Real');

  // Act

  utente.updateEstatuto(utenteInstance, 2);

  const estado = utente.estado(utenteInstance);

  // Assert

  expect(estado).toBe('ativo');

});

test('if utente estatuto value is greater than 2, then estado returns "ativo" string', function () {

  // Arrange

  const utenteInstance = utente.create('Albale', 'Real');

  // Act

  utente.updateEstatuto(utenteInstance, 2.2);

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

  utente.updateEstatuto(utenteInstance, 1.9);

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

  utente.updateEstatuto(utenteInstance, 1.9);

  utenteInstance.dataHoraFinalSuspensao = currentDateLessTwoMonths;

  const estado = utente.estado(utenteInstance);

  // Assert

  expect(estado).toBe('ativo');

});

test('if utente estatuto value is less than 1, then estado returns "inativo" string', function () {

  // Arrange

  const utenteInstance = utente.create('Albale', 'Real');

  // Act

  utente.updateEstatuto(utenteInstance, 0.5);

  const estado = utente.estado(utenteInstance);

  // Assert

  expect(estado).toBe('inativo');

});