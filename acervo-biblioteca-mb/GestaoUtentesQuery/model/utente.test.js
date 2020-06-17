const utente = require('./utente.js');

// "estado" function

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

// "updateEstatuto" function

test('if the new utente estatuto is greater than 6, then utente estatuto is updated to 6 and dataHoraFinalSuspensao is set as undefined', function () {

  // Arrange

  const utenteInstance = utente.create('Albale', 'Real');

  const currentDate = new Date();

  // Act

  utenteInstance.dataHoraFinalSuspensao = currentDate;

  utente.updateEstatuto(utenteInstance, 6.1);

  const estatuto = utenteInstance.estatuto;

  const dataHoraFinalSuspensao = utenteInstance.dataHoraFinalSuspensao;

  // Assert

  expect(estatuto).toBe(6);

  expect(dataHoraFinalSuspensao).toBe(undefined);

});

test('if the new utente estatuto is 6, then utente estatuto is updated to 6 and dataHoraFinalSuspensao is set as undefined', function () {

  // Arrange

  const utenteInstance = utente.create('Albale', 'Real');

  const currentDate = new Date();

  // Act

  utenteInstance.dataHoraFinalSuspensao = currentDate;

  utente.updateEstatuto(utenteInstance, 6);

  const estatuto = utenteInstance.estatuto;

  const dataHoraFinalSuspensao = utenteInstance.dataHoraFinalSuspensao;

  // Assert

  expect(estatuto).toBe(6);

  expect(dataHoraFinalSuspensao).toBe(undefined);

});

test('if the new utente estatuto is less than 6 and greater than 2, then utente estatuto is updated to the given value and dataHoraFinalSuspensao is set as undefined', function () {

  // Arrange

  const utenteInstance = utente.create('Albale', 'Real');

  const currentDate = new Date();

  const newEstatuto = 2.1

  // Act

  utenteInstance.dataHoraFinalSuspensao = currentDate;

  utente.updateEstatuto(utenteInstance, newEstatuto);

  const estatuto = utenteInstance.estatuto;

  const dataHoraFinalSuspensao = utenteInstance.dataHoraFinalSuspensao;

  // Assert

  expect(estatuto).toBe(newEstatuto);

  expect(dataHoraFinalSuspensao).toBe(undefined);

});

test('if the new utente estatuto is equal to 2, then utente estatuto is updated to 2 and dataHoraFinalSuspensao is set as undefined', function () {

  // Arrange

  const utenteInstance = utente.create('Albale', 'Real');

  const currentDate = new Date();

  // Act

  utenteInstance.dataHoraFinalSuspensao = currentDate;

  utente.updateEstatuto(utenteInstance, 2);

  const estatuto = utenteInstance.estatuto;

  const dataHoraFinalSuspensao = utenteInstance.dataHoraFinalSuspensao;

  // Assert

  expect(estatuto).toBe(2);

  expect(dataHoraFinalSuspensao).toBe(undefined);

});

test('if the new utente estatuto is less than 2, then utente estatuto is updated to the given value and dataHoraFinalSuspensao is set as current date + two months', function () {

  // Arrange

  const utenteInstance = utente.create('Albale', 'Real');

  const currentDate = new Date();

  const currentDateInTwoMonths = new Date(currentDate.setMonth(currentDate.getMonth() + 2));

  const newEstatuto = 1.9;

  // Act

  utente.updateEstatuto(utenteInstance, newEstatuto);

  const estatuto = utenteInstance.estatuto;

  const dataHoraFinalSuspensao = utenteInstance.dataHoraFinalSuspensao;

  // Assert

  expect(estatuto).toBe(newEstatuto);

  expect(dataHoraFinalSuspensao.getFullYear()).toBe(currentDateInTwoMonths.getFullYear());

  expect(dataHoraFinalSuspensao.getMonth()).toBe(currentDateInTwoMonths.getMonth());

});

test('if the new utente estatuto is less than 1, then utente estatuto is updated to 0.99 and dataHoraFinalSuspensao is set as undefined', function () {

  // Arrange

  const utenteInstance = utente.create('Albale', 'Real');

  const currentDate = new Date();

  // Act

  utenteInstance.dataHoraFinalSuspensao = currentDate;

  utente.updateEstatuto(utenteInstance, 0.98);

  const estatuto = utenteInstance.estatuto;

  const dataHoraFinalSuspensao = utenteInstance.dataHoraFinalSuspensao;

  // Assert

  expect(estatuto).toBe(0.99);

  expect(dataHoraFinalSuspensao).toBe(undefined);

});