using System;
using System.Collections.Generic;
using GestaoReservasQuery.DTO;
using GestaoReservasQuery.Model;
using GestaoReservasQuery.Repositories;
using Microsoft.Extensions.Logging;
using AutoMapper;

namespace GestaoReservasQuery.Services
{
    public class ReservaService : IReservaService
    {
        private readonly ILogger<ReservaService> _logger;
        private readonly IMapper _mapper;
        private readonly IReservaRepository _reservaRepository;
        private readonly IReservaSpecification _reservaSpecification;

        public ReservaService(ILogger<ReservaService> logger, IMapper mapper, IReservaRepository reservaRepository, IReservaSpecification reservaSpecification)
        {
            _logger = logger;
            _mapper = mapper;
            _reservaRepository = reservaRepository;
            _reservaSpecification = reservaSpecification;
        }

        public bool AddReserva(ReservaDTO dto)
        {
            dto.estado = ReservaEstado.NaoCumprida.ToString();
            Reserva reserva = _mapper.Map<Reserva>(dto);
            if (GetReserva(dto.dataInicio.ToString(), dto.dataFim.ToString(), dto.obra.titulo, dto.utente) == null)
            {
                _reservaRepository.Add(reserva);
                return true;
            }
            return false;
        }

        public List<ReservaDTO> GetReservasInPeriodo(String dataInicio, String dataFim, String obra)
        {
            List<ReservaDTO> lista = new List<ReservaDTO>();
            _reservaRepository.List(_reservaSpecification.ReservaInPeriodoOfObra(DateTime.Parse(dataInicio), DateTime.Parse(dataFim), obra)).ForEach(reserva =>
            {
                Console.WriteLine(reserva);
                lista.Add(_mapper.Map<ReservaDTO>(reserva));
            })
           ;
            return lista;
        }

        public ReservaDTO GetReserva(String dataInicio, String dataFim, String obra, String utente)
        {
            List<Reserva> lista = _reservaRepository.List(_reservaSpecification.ReservaInPeriodoOfObraOfUtente(DateTime.Parse(dataInicio), DateTime.Parse(dataFim), obra, utente));
            if (lista != null && lista.Count != 0)
            {
                Console.WriteLine("Count " + lista.Count);
                ReservaDTO reserva = _mapper.Map<ReservaDTO>(lista[0]);
                return reserva;
            }
            return null;
        }

        public ReservaDTO GetReservaById(long id)
        {
            var reserva = _reservaRepository.GetById(id);
            return _mapper.Map<ReservaDTO>(reserva);
        }

        public ReservaDTO RemoveReservaById(long id)
        {
            var reserva = _reservaRepository.GetById(id);
            if (reserva != null)
            {
                reserva.estado = ReservaEstado.Cancelada.ToString();
                _reservaRepository.Update(reserva);
                return _mapper.Map<ReservaDTO>(reserva);
            }
            return null;
        }
    }
}
