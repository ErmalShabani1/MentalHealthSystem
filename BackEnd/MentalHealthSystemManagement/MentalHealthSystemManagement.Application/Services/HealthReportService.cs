using MentalHealthSystemManagement.Application.DTOs.HealthReports;
using MentalHealthSystemManagement.Application.Interfaces;
using MentalHealthSystemManagement.Domain.Entities;

namespace MentalHealthSystemManagement.Application.Services
{
    public class HealthReportService
    {
        private readonly IHealthReportRepository _repository;

        public HealthReportService(IHealthReportRepository repository)
        {
            _repository = repository;
        }
        public async Task AddReportAsync(CreateHealthReportDto dto)
        {
            var report = new HealthReports
            {
                PsikologId = dto.PsikologId,
                PatientId = dto.PatientId,
                Title = dto.Title,
                Description = dto.Description,
                Diagnoza = dto.Diagnoza,
                AppointmentId = dto.AppointmentId,
                CreatedAt = DateTime.UtcNow

            };
            await _repository.AddAsync(report);
        }
        public async Task<IEnumerable<HealthReportDto>> GetAllAsync()
        {
            var list = await _repository.GetAllAsync();
            return list.Select(r => new HealthReportDto
            {
             Id = r.Id,
             PsikologName = $"{r.Psikologi.Name} {r.Psikologi.Surname}",
             PatientName = $"{r.Patient.Emri} {r.Patient.Mbiemri}",
             Title = r.Title,
             Description = r.Description,
             Diagnoza = r.Diagnoza,
             CreatedAt = r.CreatedAt,
             UpdatedAt = r.UpdatedAt

            });

        }
        public async Task<HealthReportDto?>  GetByIdAsync(int id)
        {
            var r = await _repository.GetByIdAsync(id);
            if(r == null) return null;

            return new HealthReportDto
            {
                Id = r.Id,
                PsikologName = $"{r.Psikologi.Name} {r.Psikologi.Surname}",
                PatientName = $"{r.Patient.Emri} {r.Patient.Mbiemri}",
                Title = r.Title,
                Description = r.Description,
                Diagnoza = r.Diagnoza,
                CreatedAt = r.CreatedAt,
                UpdatedAt = r.UpdatedAt
            };
            
        }
        public async Task UpdateReportAsync(int id,UpdateHealthReportDto dto)
        {
            var report = await _repository.GetByIdAsync( id);
            if (report == null) throw new Exception("Report not found");

            report.Title = dto.Title;
            report.Description = dto.Description;
            report.Diagnoza = dto.Diagnoza;
            report.UpdatedAt = DateTime.UtcNow;

            await _repository.UpdateAsync(report);
        }
        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}
