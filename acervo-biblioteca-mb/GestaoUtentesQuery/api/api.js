
const utente = require('../model/utente.js');

const mongoose = require('mongoose');

const UtentesCollection = mongoose.model('utente', new mongoose.Schema(utente.schema));

/** PRIVATE USE ONLY */
function createUtente(request, response) {

  const body = request.body;

  const utenteInstance = utente.create(body.primeiroNome, body.ultimoNome);

  UtentesCollection.create(utenteInstance, function (error, document) {
    if (error) {
      response.status(500).send();
    } else {
      const utenteView = utenteDocumentToView(document);

      response.status(201).send(utenteView);
    }
  });
}

function getUtente(request, response) {

  const id = request.params.id;

  UtentesCollection.findById(id).exec(function (error, document) {
    if (error) {
      response.status(404).send();
    } else {

      const utenteView = utenteDocumentToView(document);

      response.status(200).send(utenteView);
    }
  });
}

function updateUtente(request, response) {

  const id = request.params.id;

  UtentesCollection.findById(id).exec(function (error, document) {
    if (error) {
      response.status(404).send();
    } else {

      const body = request.body;

      const utenteInstance = document.toObject();

      const newEstatuto = body.estatuto;

      if (typeof newEstatuto === 'number') {

        utente.updateEstatuto(utenteInstance, newEstatuto);

      }

      UtentesCollection.updateOne({ _id: id }, utenteInstance).exec(function (error, _) {
        if (error) {
          response.status(500).send();
        } else {

          utenteInstance.toObject = () => utenteInstance;

          const utenteView = utenteDocumentToView(utenteInstance);

          response.status(200).send(utenteView);

        }
      });
    }
  });
}

function utenteDocumentToView(utenteDocument) {

  const utenteView = Object.assign({}, utenteDocument.toObject());

  utenteView.id = utenteDocument._id;

  utenteView.estado = utente.estado(utenteView);

  delete utenteView._id;

  delete utenteView.__v;

  return utenteView;

}

exports.createUtente = createUtente;

exports.getUtente = getUtente;

exports.updateUtente = updateUtente;