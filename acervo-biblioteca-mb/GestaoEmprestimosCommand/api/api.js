const axios = require('axios');

const Estado = require('../model/estado');

function onEmprestimoRecebido(eventstore, utente, obra, dataInicio, dataFim, publishCallback, response) {

  console.log(`onEmprestimoRecebido called with $utente: ${utente}, $obra: ${obra}, $dataInicio: ${dataInicio}, $dataFim: ${dataFim}`);

  eventstore.getNewId(function (idError, newId) {

    if (idError) {
      console.error(`Failed to get new stream id due to: ${idError}`);
    } else {
      console.log(`Got new stream id: ${newId}`);

      eventstore.getEventStream(newId, function (errorGetEventStream, stream) {

        if (errorGetEventStream) {

          console.log(`Failed to get new stream due to: ${errorGetEventStream}`);

        } else {

          console.log('Got event stream');

          stream.addEvent({ emprestimo_recebido: 'emprestimo_recebido' });

          stream.commit(function (errorStreamCommit, stream) {

            if (errorStreamCommit) {

              console.log(`Failed to commit`);

            } else {

              console.log(`Commit with success the following events: ${stream.eventsToDispatch}`);

              publishCallback('emprestimo_recebido', {
                utente: utente,
                dataInicio: dataInicio,
                dataFim: dataFim,
                obra: obra,
                streamId: newId
              });

              response.status(202).send({ url: `/commands/${newId}` });

            }

          });

        }

      });
    }

  });

}

// This obra contais all the information about it (titulo, polo and estado)
function onExisteReservaUtente(eventstore, utente, dataInicio, dataFim, obra, idStream, esbHost, geQueryHost, publishCallback) {

  console.log(`onExisteReservaUtente called with $utente: ${utente}, $dataInicio: ${dataInicio}, $dataFim: ${dataFim}, $obra: ${obra}, $idStream: ${idStream}`);

  eventstore.getEventStream(idStream, function (errorGetEventStream, stream) {

    if (errorGetEventStream) {

      console.log(`Failed to get stream due to: ${errorGetEventStream}`);

    } else {

      console.log('Got event stream');

      stream.addEvent({ existe_reserva_utente: obra });

      stream.commit(function (errorStreamCommit, _) {

        if (errorStreamCommit) {

          console.log(`Failed to commit`);

        } else {

          console.log('Successfully added event');

        }

      });

      const events = foldArrayToObject(stream.events.map((event => event.payload)));

      if (events.utente_autorizado) {
        var obrasAutorizadas = events.utente_autorizado;
        getObrasSemEmprestimo(esbHost, geQueryHost, obra, dataInicio, dataFim).then(function (obrasSemEmprestimo) {

          if (obrasAutorizadas != undefined && obrasAutorizadas.includes(obra)) {
            if (obrasSemEmprestimo != undefined && obrasSemEmprestimo.length != 0)
              if (obrasSemEmprestimo.includes(obra)) {
                // TODO - É preciso alterar o estado da reserva para em espera 
                publishCallback('emprestimo_aceite', {
                  utente: utente,
                  dataInicio: dataInicio,
                  dataFim: dataFim,
                  obra: obra,
                  id_stream: idStream
                });
              } else {
                // TODO - Tinha reserva mas já não está autorizado a levar aquele exemplar, por isso vamos emprestar outro
                // TODO - É preciso alterar o estado da reserva para cancelado 
                obrasAutorizadasSemEmprestimo = obrasAutorizadas.filter(obra => obrasSemEmprestimo.includes(obra))
                if (obrasAutorizadasSemEmprestimo != undefined && obrasAutorizadasSemEmprestimo.length != 0) {
                  publishCallback('emprestimo_aceite', {
                    utente: utente,
                    dataInicio: dataInicio,
                    dataFim: dataFim,
                    obra: obra,
                    id_stream: idStream
                  });
                }
              }
          }
        });
      }
    }
  });
}

function onExisteReserva(eventstore, utente, dataInicio, dataFim, obra, obrasReservadas, idStream, esbHost, geQueryHost, publishCallback) {

  console.log(`onExisteReserva called with $utente: ${utente}, $dataInicio: ${dataInicio}, $dataFim: ${dataFim}, $obra: ${obra}, $idStream: ${idStream}`);

  eventstore.getEventStream(idStream, function (errorGetEventStream, stream) {

    if (errorGetEventStream) {

      console.log(`Failed to get stream due to: ${errorGetEventStream}`);

    } else {

      console.log('Got event stream');

      stream.addEvent({ existe_reserva: obrasReservadas });

      stream.commit(function (errorStreamCommit, _) {

        if (errorStreamCommit) {

          console.log(`Failed to commit`);

        } else {

          console.log('Successfully added event');

        }

      });

      const events = foldArrayToObject(stream.events.map((event => event.payload)));
      if (events.utente_autorizado) {
        var obrasAutorizadas = events.utente_autorizado;
        getObrasSemEmprestimo(esbHost, geQueryHost, obra, dataInicio, dataFim).then(function (obrasSemEmprestimo) {

          var obrasAutorizadasSemReservas = [];
          if (obrasAutorizadas != undefined && obrasAutorizadas.length != 0) {
            obrasAutorizadasSemReservas = obrasAutorizadas.filter(element => !obrasReservadas.includes(element));
          }

          var obrasAutorizadasSemReservasSemEmprestimos = [];
          if (obrasAutorizadasSemReservas != undefined && obrasAutorizadasSemReservas.length != 0) {
            if (obrasSemEmprestimo != undefined && obrasSemEmprestimo.length != 0) {
              obrasAutorizadasSemReservasSemEmprestimos = obrasAutorizadasSemReservas.filter(element => obrasSemEmprestimo.includes(element));
            } else {
              obrasAutorizadasSemReservasSemEmprestimos = obrasAutorizadasSemReservas;
            }
          }
          if (obrasAutorizadasSemReservasSemEmprestimos != undefined && obrasAutorizadasSemReservasSemEmprestimos.length != 0) {
            publishCallback('emprestimo_aceite', {
              utente: utente,
              dataInicio: dataInicio,
              dataFim: dataFim,
              obra: obrasAutorizadasSemReservasSemEmprestimos[0],
              id_stream: idStream
            });
          }
        });
      }
    }
  });
}

function onNaoExisteReserva(eventstore, utente, dataInicio, dataFim, obra, idStream, esbHost, geQueryHost, publishCallback) {

  console.log(`onNaoExisteReserva called with $utente: ${utente}, $dataInicio: ${dataInicio}, $dataFim: ${dataFim}, $obra: ${obra}, $idStream: ${idStream}`);

  eventstore.getEventStream(idStream, function (errorGetEventStream, stream) {

    if (errorGetEventStream) {

      console.log(`Failed to get stream due to: ${errorGetEventStream}`);

    } else {

      console.log('Got event stream');

      stream.addEvent({ nao_existe_reserva: "nao_existe_reserva" });

      stream.commit(function (errorStreamCommit, _) {

        if (errorStreamCommit) {

          console.log(`Failed to commit`);

        } else {

          console.log('Successfully added event');

        }

      });

      const events = foldArrayToObject(stream.events.map((event => event.payload)));
      if (events.utente_autorizado) {
        var obrasAutorizadas = events.utente_autorizado;
        getObrasSemEmprestimo(esbHost, geQueryHost, obra, dataInicio, dataFim).then(function (obrasSemEmprestimo) {

          var obrasAutorizadasSemEmprestimos = [];
          if (obrasAutorizadas != undefined && obrasAutorizadas.length != 0) {
            if (obrasSemEmprestimo != undefined && obrasSemEmprestimo.length != 0) {
              obrasAutorizadasSemEmprestimos = obrasAutorizadas.filter(element => obrasSemEmprestimo.includes(element));
            } else {
              obrasAutorizadasSemEmprestimos = obrasAutorizadas;
            }

          }

          if (obrasAutorizadasSemEmprestimos != undefined && obrasAutorizadasSemEmprestimos.length != 0) {
            publishCallback('emprestimo_aceite', {
              utente: utente,
              dataInicio: dataInicio,
              dataFim: dataFim,
              obra: obrasAutorizadasSemEmprestimos[0],
              id_stream: idStream
            });
          }
        });
      }
    }
  });
}

function onUtenteNaoAutorizado(eventstore, utente, dataInicio, dataFim, obra, idStream) {

  console.log(`onUtenteNaoAutorizado called with $utente: ${utente}, $dataInicio: ${dataInicio}, $dataFim: ${dataFim}, $obra: ${obra}, $idStream: ${idStream}`);

  eventstore.getEventStream(idStream, function (errorGetEventStream, stream) {

    if (errorGetEventStream) {

      console.log(`Failed to get stream due to: ${errorGetEventStream}`);

    } else {

      console.log('Got event stream');

      stream.addEvent({ utente_nao_autorizado: 'utente_nao_autorizado' });

      stream.commit(function (errorStreamCommit, _) {

        if (errorStreamCommit) {

          console.log(`Failed to commit`);

        } else {

          console.log('Successfully added events');
        }

      });

    }

  });

}

function onUtenteAutorizado(eventstore, utente, dataInicio, dataFim, obra, obrasAutorizadas, idStream, esbHost, geQueryHost, publishCallback) {

  console.log(`onUtenteAutorizado called with $utente: ${utente}, $dataInicio: ${dataInicio}, $dataFim: ${dataFim}, $obra: ${obra}, $idStream: ${idStream}`);

  eventstore.getEventStream(idStream, function (errorGetEventStream, stream) {

    if (errorGetEventStream) {

      console.log(`Failed to get stream due to: ${errorGetEventStream}`);

    } else {

      console.log('Got event stream');

      stream.addEvent({ utente_autorizado: obrasAutorizadas });

      stream.commit(function (errorStreamCommit, _) {

        if (errorStreamCommit) {

          console.log(`Failed to commit`);

        } else {

          console.log('Successfully added event');

        }

      });

      const events = foldArrayToObject(stream.events.map((event => event.payload)));

      var obrasReservadas = [];
      if (events.existe_reserva) {
        var obrasReservadas = events.existe_reserva;
        console.log("Event existe_reserva already happened");
      }
      if (events.existe_reserva_utente) {
        obrasReservadas.push(events.existe_reserva_utente);
        console.log("Event existe_reserva_utente already happened");
      }
      if (events.nao_existe_reserva) {
        console.log("Event nao_existe_reserva already happened");
      }

      getObrasSemEmprestimo(esbHost, geQueryHost, obra, dataInicio, dataFim).then(function (obrasSemEmprestimo) {


        var obrasAutorizadasSemReservas = [];
        if (obrasAutorizadas != undefined && obrasAutorizadas.length != 0) {
          obrasAutorizadasSemReservas = obrasAutorizadas.filter(element => !obrasReservadas.includes(element));
        }

        var obrasAutorizadasSemReservasSemEmprestimos = [];
        if (obrasAutorizadasSemReservas != undefined && obrasAutorizadasSemReservas.length != 0) {
          if (obrasSemEmprestimo != undefined && obrasSemEmprestimo.length != 0) {
            obrasAutorizadasSemReservasSemEmprestimos = obrasAutorizadasSemReservas.filter(element => obrasSemEmprestimo.includes(element));
          } else {
            obrasAutorizadasSemReservasSemEmprestimos = obrasAutorizadasSemReservas;
          }

        }

        if (obrasAutorizadasSemReservasSemEmprestimos != undefined && obrasAutorizadasSemReservasSemEmprestimos.length != 0) {
          publishCallback('emprestimo_aceite', {
            utente: utente,
            dataInicio: dataInicio,
            dataFim: dataFim,
            obra: obrasAutorizadasSemReservasSemEmprestimos[0],
            id_stream: newId
          });
        }
      });
    }
  });
}

function onReservaRecebida(eventstore, utente, dataInicio, dataFim, obra, idStream, esbHost, geQueryHost, publishCallback) {

  console.log(`onReservaRecebida called with $utente: ${utente}, $dataInicio: ${dataInicio}, $dataFim: ${dataFim}, $obra: ${obra}, $idStream: ${idStream}`);

  eventstore.getEventStream(idStream, function (errorGetEventStream, stream) {

    if (errorGetEventStream) {

      console.log(`Failed to get stream due to: ${errorGetEventStream}`);

    } else {

      console.log('Got event stream');

      stream.addEvent({ reserva_recebida: 'reserva_recebida' });

      stream.commit(function (errorStreamCommit, _) {

        if (errorStreamCommit) {

          console.log(`Failed to commit`);

        } else {

          console.log('Successfully added event');

          getObrasSemEmprestimo(esbHost, geQueryHost, obra, dataInicio, dataFim).then(function (obrasSemEmprestimo) {

            if (obrasSemEmprestimo == undefined || obrasSemEmprestimo.length == 0) {

              console.log('Emprestimo sobreposto');

              publishCallback('reserva_emprestimo_sobreposto', {
                utente: utente,
                dataInicio: dataInicio,
                dataFim: dataFim,
                obra: obra,
                id_stream: idStream
              });

            } else {

              console.log('Emprestimo não sobreposto');

              publishCallback('reserva_emprestimo_nao_sobreposto', {
                utente: utente,
                dataInicio: dataInicio,
                dataFim: dataFim,
                obra: obra,
                obrasSemEmprestimo: obrasSemEmprestimo,
                id_stream: idStream
              });
            }
          })
        }
      });
    }
  });
}

// TODO - Utente pode reservar/encomendar uma obra que já tenha um exemplar nas suas mãos???
function getObrasSemEmprestimo(esbHost, geQueryHost, obra, dataInicio, dataFim) {
  return getObraInPolos(esbHost, obra).then(function (obrasExistentes) {

    if (obrasExistentes != undefined && obrasExistentes.length != 0) {
      return getObrasEncomendadas(geQueryHost, obra, dataInicio, dataFim).then(function (obrasEncomendadas) {

        if (obrasEncomendadas != undefined && obrasEncomendadas.length != 0) {
          return obrasExistentes.filter(obra => !obrasEncomendadas.includes(obra));
        }
        return obrasExistentes;
      })
    }
    return [];

  });
}

function getObraInPolos(esbHost, obra) {

  console.log(`getObraInPolos called with $obra: ${obra}`);

  var polos = getPolos(esbHost);

  const obrasPorPolo = polos.map((polo) => axios.default.get(`${esbHost}/acervobiblioteca/polos/${polo}/obras/${obra}`))

  console.log(obrasPorPolo)

  return Promise.all(obrasPorPolo).then(function (responses) {
    const obras = [];

    responses.forEach(function (getObraPolo, index) {

      getObraPolo = getObraPolo.data;

      if (getObraPolo.count != getObraPolo.states.length) {
        getObraPolo.states = [getObraPolo.states.reduceRight((p, c) => c + p)];
      }

      getObraPolo.states.forEach(state => {
        var obra = {
          titulo: getObraPolo.title,
          estado: Estado.getValue(state), //convert string to int
          polo: polos[index]
        }
        obras.push(obra);
      });
    });

    return obras;
  }).catch(function (erro) {
    console.log(erro);
    return [];
  });
}


function getPolos(esbHost) {

  console.log(`getPolos`);
  return ["polo2", "polo3"];
  /*axios
    .default
    .get(`${esbHost}/acervobiblioteca/polos`)
    .then(function (getPolos) {

      var polos = [];

      getPolos.forEach(element => {
        polos.push(element.name)
      });

      return polos;
    })
    .catch(function (errorGetPolos) {

      console.log(`getPolos error : ${errorGetPolos}`);

      return [];
    });*/
}

function getObrasEncomendadas(geQueryHost, obra, dataInicio, dataFim) {

  console.log(`getEncomendas called with $obra: ${obra}, $dataInicio: ${dataInicio}, $dataFim: ${dataFim}`);

  return axios
    .default
    .get(`${geQueryHost}/encomendas/obra/${obra}?dataInicio=${dataInicio}dataFim=${dataFim}`)
    .then(function (getEncomendas) {
      var obras = []
      getEncomendas.forEach(encomenda => {

        obras.push(encomenda.obra);

      });
      return obras;
    })
    .catch(function (errorGetEncomendas) {

      console.log(`getEncomendas error : ${errorGetEncomendas}`);

    });
}

exports.onEmprestimoRecebido = onEmprestimoRecebido;
exports.onUtenteNaoAutorizado = onUtenteNaoAutorizado;
exports.onExisteReserva = onExisteReserva;
exports.onNaoExisteReserva = onNaoExisteReserva;
exports.onReservaRecebida = onReservaRecebida;
exports.onUtenteAutorizado = onUtenteAutorizado;
exports.onExisteReservaUtente = onExisteReservaUtente;