
const utente = require('../model/utente.js');

const mongoose = require('mongoose');

const UtentesCollection = mongoose.model('utente', new mongoose.Schema(utente.schema));

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

exports.updateUtente = updateUtente;