
const emprestimo = require('../model/emprestimo.js');

const mongoose = require('mongoose');

const EmprestimosCollection = mongoose.model('emprestimo', new mongoose.Schema(emprestimo.schema));

/** PRIVATE USE ONLY */
function createEmprestimo(request, response) {

  const body = request.body;

  const emprestimoInstance = emprestimo.create(body.utente, body.dataInicio, body.dataFim, body.obra);

  EmprestimosCollection.create(emprestimoInstance, function (error, document) {
    if (error) {
      response.status(500).send();
    } else {
      const utenteView = emprestimoDocumentToView(document);

      response.status(201).send(utenteView);
    }
  });
}

function getEmprestimo(request, response) {

  const id = request.params.id;

  EmprestimosCollection.findById(id).exec(function (error, document) {
    if (error || document == null) {
      response.status(404).send();
    } else {

      const emprestimoView = emprestimoDocumentToView(document);

      response.status(200).send(emprestimoView);
    }
  });
}

// TODO - Se isto for o devolver então falta a parte de alterar o estatuto do utente 
function updateEmprestimo(request, response) {

  const id = request.params.id;

  EmprestimosCollection.findById(id).exec(function (error, document) {
    if (error || document == null) {
      response.status(404).send();
    } else {

      const emprestimoInstance = document.toObject();

      emprestimo.updateEstado(emprestimoInstance);

      EmprestimosCollection.updateOne({ _id: id }, emprestimoInstance).exec(function (error, _) {
        if (error) {
          response.status(500).send();
        } else {

          emprestimoInstance.toObject = () => emprestimoInstance;

          const emprestimoView = emprestimoDocumentToView(emprestimoInstance);

          response.status(200).send(emprestimoView);

        }
      });
    }
  });
}


function onEmprestimoAceite(utente, dataInicio, dataFim, obra, idStream, publishCallback) {

  console.log(`onEmprestimoAceite called with $utente: ${utente}, $dataInicio: ${dataInicio}, $dataFim: ${dataFim}, $obra: ${obra}, $idStream: ${idStream}`);

  const emprestimoInstance = emprestimo.create(body.utente, body.dataInicio, body.dataFim, body.obra);

  EmprestimosCollection.create(emprestimoInstance, function (error, document) {
    if (error) {
      console.log(`Failed to add the record of emprestimo due to: ${error}`);

      publishCallback('emprestimo_nao_realizado', {
        razao: `An error has occurred adding to the database the record of emprestimo`,
        idStream: idStream
      });
    } else {

      publishCallback('emprestimo_realizado', {
        id_emprestimo: document._id,
        id_stream: idStream
      });

    }
  });

}

function emprestimoDocumentToView(emprestimoDocument) {

  const emprestimoView = Object.assign({}, emprestimoDocument.toObject());

  emprestimoView.id = emprestimoDocument._id;

  delete emprestimoView._id;

  delete emprestimoView.__v;

  return emprestimoView;

}

exports.createEmprestimo = createEmprestimo;

exports.getUtente = getEmprestimo;

exports.updateUtente = updateEmprestimo;

exports.onEmprestimoAceite = onEmprestimoAceite;