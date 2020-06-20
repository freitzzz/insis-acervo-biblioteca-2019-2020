const axios = require('axios').default;

const guCommandHost = process.env.GU_COMMAND_HOST;

const guQueryHost = process.env.GU_QUERY_HOST;

const dummyUtentes = {
  utente: {},
  bibliotecarioMor: {},
  utenteInativo: {}
};

beforeAll(function () {
  return axios.all([
    axios.post(`${guQueryHost}/utentes`, {
      primeiroNome: 'Utente',
      ultimoNome: 'Dummy'
    }),
    axios.post(`${guQueryHost}/utentes`, {
      primeiroNome: 'Bibliotecario-Mor',
      ultimoNome: 'Dummy',
      permissoesEspeciais: true
    }),
    axios.post(`${guQueryHost}/utentes`, {
      primeiroNome: 'Inativo',
      ultimoNome: 'Dummy',
    })
  ]).then(function (responses) {

    let utente = responses[0].data;

    let bibliotecarioMor = responses[1].data;

    let utenteInativo = responses[2].data;

    if (utente.primeiroNome != 'Utente') {

      const temp = utente;

      utente = bibliotecarioMor;

      bibliotecarioMor = temp;

    }

    dummyUtentes.utente = utente;

    dummyUtentes.bibliotecarioMor = bibliotecarioMor;

    dummyUtentes.utenteInativo = utenteInativo;

    return axios.put(`${guQueryHost}/utentes/${utenteInativo.id}`, {
      estatuto: 0.99
    });

  }, function (rejections) {

    throw `Could not initialize dummy utentes data due to: ${rejections}`;
  });

});

test('if no utente id is set on repor estado utente request, the first response will be a 202; Accepted with the resource locator of the executed command and when requesting this resource, the response should be 404; Not Found with a message identifying that the utente was not found', function () {

  // Arrange

  const utenteId = undefined;

  const bibliotecarioMorId = dummyUtentes.bibliotecarioMor.id;

  // Act

  return axios.put(`${guCommandHost}/utentes/${utenteId}`, {
    estatuto: 2.5
  }, {
    headers: {
      id_bibliotecario_mor: bibliotecarioMorId
    }
  }).then(function (acceptedResponse) {

    const commandStateResourceEndpoint = acceptedResponse.data.url;

    return new Promise(function (resolve) {
      return setTimeout(resolve, 1500);
    }).then(function (_) {

      return axios.get(`${guCommandHost}${commandStateResourceEndpoint}`).then(function (responseSecondRequest) {

        throw `GET ${commandStateResourceEndpoint} should have returned 404; Not Found but got ${responseSecondRequest.status}. Full error: ${responseSecondRequest}`;

      }).catch(function (secondRequestError) {

        if (secondRequestError) {

          const firstRequestStatusCode = acceptedResponse.status;

          const secondRequestStatusCode = secondRequestError.response.status;

          const secondRequestErrorMessage = secondRequestError.response.data.message;

          // Assert

          expect(firstRequestStatusCode).toBe(202);

          expect(secondRequestStatusCode).toBe(404);

          expect(secondRequestErrorMessage).toBe(`Utente with id: ${utenteId} not found`);
        } else {
          throw secondRequestError;
        }
      });
    });
  }).catch(function (firstRequestError) {

    if (firstRequestError.response) {
      throw `PUT /utentes/${utenteId} should have returned 202; Accepted but got ${firstRequestError.response.status} instead. Full error: ${firstRequestError}`;
    } else {
      throw firstRequestError;
    }
  });

});

test('if no bibliotecario mor id is set on repor estado utente request, the first response will be a 202; Accepted with the resource locator of the executed command and when requesting this resource, the response should be 404; Not Found with a message identifying that the bibliotecario mor was not found', function () {

  // Arrange

  const utenteId = dummyUtentes.utente.id;

  const bibliotecarioMorId = undefined;

  // Act

  return axios.put(`${guCommandHost}/utentes/${utenteId}`, {
    estatuto: 2.5
  }, {
    headers: {
      id_bibliotecario_mor: bibliotecarioMorId
    }
  }).then(function (acceptedResponse) {

    const commandStateResourceEndpoint = acceptedResponse.data.url;

    return new Promise(function (resolve) {
      return setTimeout(resolve, 1500);
    }).then(function (_) {

      return axios.get(`${guCommandHost}${commandStateResourceEndpoint}`).then(function (responseSecondRequest) {

        throw `GET ${commandStateResourceEndpoint} should have returned 404; Not Found but got ${responseSecondRequest.status}. Full error: ${responseSecondRequest}`;

      }).catch(function (secondRequestError) {

        if (secondRequestError) {
          const firstRequestStatusCode = acceptedResponse.status;

          const secondRequestStatusCode = secondRequestError.response.status;

          const secondRequestErrorMessage = secondRequestError.response.data.message;

          // Assert

          expect(firstRequestStatusCode).toBe(202);

          expect(secondRequestStatusCode).toBe(404);

          expect(secondRequestErrorMessage).toBe(`Bibliotecário-Mor with id: ${bibliotecarioMorId} not found`);
        } else {
          throw secondRequestError;
        }
      });
    });
  }).catch(function (firstRequestError) {

    if (firstRequestError.response) {
      throw `PUT /utentes/${utenteId} should have returned 202; Accepted but got ${firstRequestError.response.status} instead. Full error: ${firstRequestError}`;
    } else {
      throw firstRequestError;
    }
  });

});

test('if the defined bibliotecario mor set on repor estado utente request does not exist, the first response will be a 202; Accepted with the resource locator of the executed command and when requesting this resource, the response should be 404; Not Found with a message identifying that the bibliotecario mor was not found', function () {

  // Arrange

  const utenteId = dummyUtentes.utente.id;

  const bibliotecarioMorId = 'not found';

  // Act

  return axios.put(`${guCommandHost}/utentes/${utenteId}`, {
    estatuto: 2.5
  }, {
    headers: {
      id_bibliotecario_mor: bibliotecarioMorId
    }
  }).then(function (acceptedResponse) {

    const commandStateResourceEndpoint = acceptedResponse.data.url;

    return new Promise(function (resolve) {
      return setTimeout(resolve, 1500);
    }).then(function (_) {

      return axios.get(`${guCommandHost}${commandStateResourceEndpoint}`).then(function (responseSecondRequest) {

        throw `GET ${commandStateResourceEndpoint} should have returned 404; Not Found but got ${responseSecondRequest.status}. Full error: ${responseSecondRequest}`;

      }).catch(function (secondRequestError) {

        if (secondRequestError) {

          const firstRequestStatusCode = acceptedResponse.status;

          const secondRequestStatusCode = secondRequestError.response.status;

          const secondRequestErrorMessage = secondRequestError.response.data.message;

          // Assert

          expect(firstRequestStatusCode).toBe(202);

          expect(secondRequestStatusCode).toBe(404);

          expect(secondRequestErrorMessage).toBe(`Bibliotecário-Mor with id: ${bibliotecarioMorId} not found`);
        } else {
          throw secondRequestError;
        }
      });
    });
  }).catch(function (firstRequestError) {

    if (firstRequestError.response) {
      throw `PUT /utentes/${utenteId} should have returned 202; Accepted but got ${firstRequestError.response.status} instead. Full error: ${firstRequestError}`;
    } else {
      throw firstRequestError;
    }
  });

});

test('if the defined utente set on repor estado utente request does not exist, the first response will be a 202; Accepted with the resource locator of the executed command and when requesting this resource, the response should be 404; Not Found with a message identifying that the utente was not found', function () {

  // Arrange

  const utenteId = 'not found';

  const bibliotecarioMorId = dummyUtentes.bibliotecarioMor.id;

  // Act

  return axios.put(`${guCommandHost}/utentes/${utenteId}`, {
    estatuto: 2.5
  }, {
    headers: {
      id_bibliotecario_mor: bibliotecarioMorId
    }
  }).then(function (acceptedResponse) {

    const commandStateResourceEndpoint = acceptedResponse.data.url;

    return new Promise(function (resolve) {
      return setTimeout(resolve, 1500);
    }).then(function (_) {

      return axios.get(`${guCommandHost}${commandStateResourceEndpoint}`).then(function (responseSecondRequest) {

        throw `GET ${commandStateResourceEndpoint} should have returned 404; Not Found but got ${responseSecondRequest.status}. Full error: ${responseSecondRequest}`;

      }).catch(function (secondRequestError) {

        if (secondRequestError) {

          const firstRequestStatusCode = acceptedResponse.status;

          const secondRequestStatusCode = secondRequestError.response.status;

          const secondRequestErrorMessage = secondRequestError.response.data.message;

          // Assert

          expect(firstRequestStatusCode).toBe(202);

          expect(secondRequestStatusCode).toBe(404);

          expect(secondRequestErrorMessage).toBe(`Utente with id: ${utenteId} not found`);

        } else {
          throw secondRequestError;
        }
      });
    });
  }).catch(function (firstRequestError) {

    if (firstRequestError.response) {
      throw `PUT /utentes/${utenteId} should have returned 202; Accepted but got ${firstRequestError.response.status} instead. Full error: ${firstRequestError}`;
    } else {
      throw firstRequestError;
    }
  });

});

test('if the defined bibliotecario mor set on repor estado utente request does not have special permissions, the first response will be a 202; Accepted with the resource locator of the executed command and when requesting this resource, the response should be 401; Unauthorized with a message identifying that the bibliotecario mor does not have permissions to perform repor utente estado operation', function () {

  // Arrange

  const utenteId = dummyUtentes.utente.id;

  const bibliotecarioMorId = dummyUtentes.utente.id;

  // Act

  return axios.put(`${guCommandHost}/utentes/${utenteId}`, {
    estatuto: 2.5
  }, {
    headers: {
      id_bibliotecario_mor: bibliotecarioMorId
    }
  }).then(function (acceptedResponse) {

    const commandStateResourceEndpoint = acceptedResponse.data.url;

    return new Promise(function (resolve) {
      return setTimeout(resolve, 1500);
    }).then(function (_) {

      return axios.get(`${guCommandHost}${commandStateResourceEndpoint}`).then(function (responseSecondRequest) {

        throw `GET ${commandStateResourceEndpoint} should have returned 401; Unauthorized but got ${responseSecondRequest.status}. Full error: ${responseSecondRequest}`;

      }).catch(function (secondRequestError) {

        if (secondRequestError) {

          const firstRequestStatusCode = acceptedResponse.status;

          const secondRequestStatusCode = secondRequestError.response.status;

          const secondRequestErrorMessage = secondRequestError.response.data.message;

          // Assert

          expect(firstRequestStatusCode).toBe(202);

          expect(secondRequestStatusCode).toBe(401);

          expect(secondRequestErrorMessage).toBe(`Bibliotecário-Mor with id: ${utenteId} is not allowed to perform repor utente estado operation`);
        } else {
          throw secondRequestError;
        }
      });
    });
  }).catch(function (firstRequestError) {

    if (firstRequestError.response) {
      throw `PUT /utentes/${utenteId} should have returned 202; Accepted but got ${firstRequestError.response.status} instead. Full error: ${firstRequestError}`;
    } else {
      throw firstRequestError;
    }
  });

});

test('if the defined utente set on repor estado utente request is not "inativo", the first response will be a 202; Accepted with the resource locator of the executed command and when requesting this resource, the response should be 400; Bad Request with a message identifying that the utente is not inativo', function () {

  // Arrange

  const utenteId = dummyUtentes.utente.id;

  const bibliotecarioMorId = dummyUtentes.bibliotecarioMor.id;

  // Act

  return axios.put(`${guCommandHost}/utentes/${utenteId}`, {
    estatuto: 2.5
  }, {
    headers: {
      id_bibliotecario_mor: bibliotecarioMorId
    }
  }).then(function (acceptedResponse) {

    const commandStateResourceEndpoint = acceptedResponse.data.url;

    return new Promise(function (resolve) {
      return setTimeout(resolve, 1500);
    }).then(function (_) {

      return axios.get(`${guCommandHost}${commandStateResourceEndpoint}`).then(function (responseSecondRequest) {

        throw `GET ${commandStateResourceEndpoint} should have returned 400; Bad Request but got ${responseSecondRequest.status}. Full error: ${responseSecondRequest}`;

      }).catch(function (secondRequestError) {

        if (secondRequestError.response) {

          const firstRequestStatusCode = acceptedResponse.status;

          const secondRequestStatusCode = secondRequestError.response.status;

          const secondRequestErrorMessage = secondRequestError.response.data.message;

          // Assert

          expect(firstRequestStatusCode).toBe(202);

          expect(secondRequestStatusCode).toBe(400);

          expect(secondRequestErrorMessage).toBe(`Utente with id: ${utenteId} is not inativo`);
        } else {
          throw secondRequestError;
        }
      });
    });
  }).catch(function (firstRequestError) {

    if (firstRequestError.response) {
      throw `PUT /utentes/${utenteId} should have returned 202; Accepted but got ${firstRequestError.response.status} instead. Full error: ${firstRequestError}`;
    } else {
      throw firstRequestError;
    }
  });

});

test('if the utente is inativo and the defined estatuto value set on repor estado utente request is not higher or equal than 2, the first response will be a 202; Accepted with the resource locator of the executed command and when requesting this resource, the response should be 400; Bad Request with a message identifying that the estatuto value is not enough to repor utente estado', function () {

  // Arrange

  const utenteId = dummyUtentes.utenteInativo.id;

  const bibliotecarioMorId = dummyUtentes.bibliotecarioMor.id;

  // Act

  const valorEstatuto = 1.9;

  return axios.put(`${guCommandHost}/utentes/${utenteId}`, {
    estatuto: valorEstatuto
  }, {
    headers: {
      id_bibliotecario_mor: bibliotecarioMorId
    }
  }).then(function (acceptedResponse) {

    const commandStateResourceEndpoint = acceptedResponse.data.url;

    return new Promise(function (resolve) {
      return setTimeout(resolve, 1500);
    }).then(function (_) {

      return axios.get(`${guCommandHost}${commandStateResourceEndpoint}`).then(function (responseSecondRequest) {

        throw `GET ${commandStateResourceEndpoint} should have returned 400; Bad Request but got ${responseSecondRequest.status}. Full error: ${responseSecondRequest}`;

      }).catch(function (secondRequestError) {

        if (secondRequestError.response) {

          const firstRequestStatusCode = acceptedResponse.status;

          const secondRequestStatusCode = secondRequestError.response.status;

          const secondRequestErrorMessage = secondRequestError.response.data.message;

          // Assert

          expect(firstRequestStatusCode).toBe(202);

          expect(secondRequestStatusCode).toBe(400);

          expect(secondRequestErrorMessage).toBe(`Estatuto with value: ${valorEstatuto} is not enough to perform repor utente estado operation`);
        } else {
          throw secondRequestError;
        }
      });
    });
  }).catch(function (firstRequestError) {

    if (firstRequestError.response) {
      throw `PUT /utentes/${utenteId} should have returned 202; Accepted but got ${firstRequestError.response.status} instead. Full error: ${firstRequestError}`;
    } else {
      throw firstRequestError;
    }
  });

});

test('if the utente is inativo and the defined estatuto value set on repor estado utente request is not equal to 2, the first response will be a 202; Accepted with the resource locator of the executed command and when requesting this resource, the response should be 200; OK with a message identifying the resource locator of the updated utente', function () {

  // Arrange

  const utenteId = dummyUtentes.utenteInativo.id;

  const bibliotecarioMorId = dummyUtentes.bibliotecarioMor.id;

  // Act

  const valorEstatuto = 2;

  return axios.put(`${guCommandHost}/utentes/${utenteId}`, {
    estatuto: valorEstatuto
  }, {
    headers: {
      id_bibliotecario_mor: bibliotecarioMorId
    }
  }).then(function (acceptedResponse) {

    const commandStateResourceEndpoint = acceptedResponse.data.url;

    return new Promise(function (resolve) {
      return setTimeout(resolve, 1500);
    }).then(function (_) {

      return axios.get(`${guCommandHost}${commandStateResourceEndpoint}`).then(function (responseSecondRequest) {

        const firstRequestStatusCode = acceptedResponse.status;

        const secondRequestStatusCode = responseSecondRequest.status;

        const secondRequestErrorMessage = responseSecondRequest.data.url;

        // Assert

        expect(firstRequestStatusCode).toBe(202);

        expect(secondRequestStatusCode).toBe(200);

        expect(secondRequestErrorMessage).toBe(`/utentes/${utenteId}`);

      }).catch(function (secondRequestError) {

        if (secondRequestError.response) {
          throw `GET ${commandStateResourceEndpoint} should have returned 200; OK but got ${secondRequestError.response.status}. Full error: ${secondRequestError}`;
        } else {
          throw secondRequestError;
        }
      });
    });
  }).catch(function (firstRequestError) {

    if (firstRequestError.response) {
      throw `PUT /utentes/${utenteId} should have returned 202; Accepted but got ${firstRequestError.response.status} instead. Full error: ${firstRequestError}`;
    } else {
      throw firstRequestError;
    }
  });

});