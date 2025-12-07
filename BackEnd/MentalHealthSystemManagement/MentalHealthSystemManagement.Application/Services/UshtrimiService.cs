using MentalHealthSystemManagement.Application.DTOs.Ushtrimet;
using MentalHealthSystemManagement.Application.Interfaces;
using MentalHealthSystemManagement.Domain.Entities;

namespace MentalHealthSystemManagement.Application.Services
{
    public class UshtrimiService
    {
        private readonly IUshtrimiRepository _repository;

        public UshtrimiService(IUshtrimiRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Ushtrimi>> GetAllAsync()
            => await _repository.GetAllAsync();

        public async Task<IEnumerable<UshtrimiReadDto>> GetByPsikologIdAsync(int id)
            => await _repository.GetByPsikologIdAsync(id);

        public async Task<Ushtrimi?> GetByIdAsync(int id)
            => await _repository.GetByIdAsync(id);

        public async Task CreateAsync(UshtrimiDto dto)
        {
            var ushtrimi = new Ushtrimi
            {
                Titulli = dto.Titulli,
                Pershkrimi = dto.Pershkrimi,
                PsikologId = dto.PsikologId,
              
                DataKrijimit = DateTime.Now
            };

            await _repository.AddAsync(ushtrimi);
        }

        public async Task UpdateAsync(int id, UshtrimiDto dto)
        {
            var ushtrimi = await _repository.GetByIdAsync(id);
            if (ushtrimi == null) throw new Exception("Ushtrimi nuk u gjet");

            ushtrimi.Titulli = dto.Titulli;
            ushtrimi.Pershkrimi = dto.Pershkrimi;
           

            await _repository.UpdateAsync(ushtrimi);
        }

        public async Task DeleteAsync(int id)
            => await _repository.DeleteAsync(id);
    }
}
