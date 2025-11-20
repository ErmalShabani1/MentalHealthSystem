using MentalHealthSystemManagement.Application.DTOs.TreatmentPlan;
using MentalHealthSystemManagement.Application.Interfaces;
using MentalHealthSystemManagement.Domain.Entities;

namespace MentalHealthSystemManagement.Application.Services
{
    public class TreatmentPlanService
    {
        private readonly ITreatmentPlanRepository _repository;

        public TreatmentPlanService(ITreatmentPlanRepository repository)
        {
            _repository = repository;
        }
        public async Task<TreatmentPlanReadDto> CreateAsync(int psikologId, TreatmentPlanCreateDto dto)
        {
            var plan = new TreatmentPlan
            {
                PatientId = dto.PatientId,
                PsikologId = psikologId,
                Title = dto.Title,
                Description = dto.Description,
                Goals = dto.Goals,
                StartDate = dto.StartDate,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
            };
            await _repository.CreateAsync(plan);

            return new TreatmentPlanReadDto
            {
                TreatmentPlanId = plan.TreatmentPlanId,
                PatientId = plan.PatientId,
                PsikologId = plan.PsikologId,
                Title = plan.Title,
                Description = plan.Description,
                StartDate = plan.StartDate,
                Goals = plan.Goals,
                Status = plan.Status
            };
        }
        public async Task<TreatmentPlanReadDto> GetByIdAsync(int id)
        {
            var plan = await _repository.GetByIdAsync(id);
            if (plan == null) throw new Exception("TreatmentPlan nuk ekziston");

          

            return new TreatmentPlanReadDto
            {
                TreatmentPlanId = plan.TreatmentPlanId,
                PatientId = plan.PatientId,
                PsikologId = plan.PsikologId,
                Title = plan.Title,
                Description = plan.Description,
                StartDate = plan.StartDate,
                EndDate = plan.EndDate,
                Status = plan.Status,
                Goals = plan.Goals
            };
        }
        public async Task<IEnumerable<TreatmentPlanReadDto>> GetAllForPsikologAsync(int psikologId)
        {
            var list = await _repository.GetAllForPsikologAsync(psikologId);

            return list.Select(x => new TreatmentPlanReadDto
            {
                TreatmentPlanId = x.TreatmentPlanId,
                PatientId= x.PatientId,
                PsikologId= x.PsikologId,
                Title = x.Title,
                Status = x.Status
            });
        }
        public async Task<IEnumerable<TreatmentPlanReadDto>> GetAllForPatientAsync(int patientId)
        {
            var list = await _repository.GetAllForPsikologAsync(patientId);

            return list.Select(x => new TreatmentPlanReadDto
            {

                TreatmentPlanId = x.TreatmentPlanId,
                PatientId = x.PatientId,
                PsikologId = x.PsikologId,
                Title = x.Title,
                Status = x.Status
            });
        }
        public async Task UpdateAsync(int id, int psikologId, TreatmentPlanUpdateDto update)
        {
            var plan = await _repository.GetByIdAsync(id);
            if (plan == null) throw new Exception("Nuk u gjet!");

            if (plan.PsikologId != psikologId) throw new Exception("Nuk keni te drejte, ju lutem qasuni si Psikolog");

            plan.Title = update.Title;
            plan.Description = update.Description;
            plan.Status = update.Status;
            plan.EndDate = update.EndDate;
            plan.Goals = update.Goals;
            plan.UpdatedAt = DateTime.UtcNow;

            await _repository.UpdateAsync(plan);
        }
        public async Task DeleteAsync(int id, int psikologId)
        {
            var plan = _repository.GetByIdAsync(id);
            if (plan == null) throw new Exception("Nuk u gjet");

            await _repository.DeleteAsync(id);
        }
    }
}
