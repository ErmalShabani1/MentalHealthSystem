using MentalHealthSystemManagement.Application.DTOs.TherapySessions;
using MentalHealthSystemManagement.Application.Interfaces;
using MentalHealthSystemManagement.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentalHealthSystemManagement.Application.Services
{
    public class TherapySessionService
    {
        private readonly ITherapySessionRepository _repository;

        public TherapySessionService(ITherapySessionRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<TherapySessionDto>> GetAllSessionsAsync()
        {
            var sessions = await _repository.GetAllAsync();
            return sessions.Select(MapToDto);
        }

        public async Task<TherapySessionDto?> GetSessionByIdAsync(int id)
        {
            var session = await _repository.GetByIdAsync(id);
            return session != null ? MapToDto(session) : null;
        }

        public async Task<IEnumerable<TherapySessionDto>> GetSessionsByPatientIdAsync(int patientId)
        {
            var sessions = await _repository.GetByPatientIdAsync(patientId);
            return sessions.Select(MapToDto);
        }

        public async Task<IEnumerable<TherapySessionDto>> GetSessionsByPsikologIdAsync(int psikologId)
        {
            var sessions = await _repository.GetByPsikologIdAsync(psikologId);
            return sessions.Select(MapToDto);
        }

        public async Task<TherapySessionDto> CreateSessionAsync(int psikologId, CreateTherapySessionDto dto)
        {
            if (dto.SessionDate < DateTime.Now)
                throw new Exception("Seanca nuk mund te jete ne te kaluaren");

            // Llogarit numrin e seancës për këtë pacient
            var patientSessions = await _repository.GetByPatientIdAsync(dto.PatientId);
            int sessionNumber = patientSessions.Count() + 1;

            var session = new TherapySession
            {
                PatientId = dto.PatientId,
                PsikologId = psikologId,
                SessionDate = dto.SessionDate,
                DurationMinutes = dto.DurationMinutes,
                SessionType = "Individual",
                Notes = dto.Notes,
                Progress = dto.MoodAfter,
                Goals = dto.Goals,
                Exercises = dto.Exercises,
                MoodBefore = dto.MoodBefore,
                MoodAfter = dto.MoodAfter,
                SessionNumber = sessionNumber,
                Status = dto.Status,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _repository.AddAsync(session);
            return MapToDto(created);
        }

        public async Task<TherapySessionDto> UpdateSessionAsync(UpdateTherapySessionDto dto)
        {
            var existing = await _repository.GetByIdAsync(dto.Id);
            if (existing == null)
                throw new Exception("Seanca nuk u gjet");

            existing.SessionDate = dto.SessionDate;
            existing.DurationMinutes = dto.DurationMinutes;
            existing.SessionType = "Individual";
            existing.Notes = dto.Notes;
            existing.Progress = dto.MoodAfter;
            existing.Goals = dto.Goals;
            existing.Exercises = dto.Exercises;
            existing.MoodBefore = dto.MoodBefore;
            existing.MoodAfter = dto.MoodAfter;
            existing.Status = dto.Status;

            var updated = await _repository.UpdateAsync(existing);
            return MapToDto(updated);
        }

        public async Task<bool> DeleteSessionAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }

        private TherapySessionDto MapToDto(TherapySession session)
        {
            return new TherapySessionDto
            {
                Id = session.Id,
                PatientId = session.PatientId,
                PatientName = $"{session.Patient?.Emri} {session.Patient?.Mbiemri}",
                PsikologId = session.PsikologId,
                PsikologName = $"{session.Psikologi?.Name} {session.Psikologi?.Surname}",
                SessionDate = session.SessionDate,
                DurationMinutes = session.DurationMinutes,
                SessionType = session.SessionType,
                Notes = session.Notes,
                Progress = session.Progress,
                Goals = session.Goals,
                Exercises = session.Exercises,
                MoodBefore = session.MoodBefore,
                MoodAfter = session.MoodAfter,
                SessionNumber = session.SessionNumber,
                Status = session.Status,
                CreatedAt = session.CreatedAt,
                UpdatedAt = session.UpdatedAt
            };
        }
    }
}
