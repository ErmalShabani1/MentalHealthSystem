using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MentalHealthSystemManagement.Domain.Entities;
using MentalHealthSystemManagement.Application.Interfaces;
using System.Security.Cryptography;
using BCrypt.Net;

namespace MentalHealthSystemManagement.Application.Services
{
    public class PatientService
    {
        private readonly IPatientRepository _patientRepository;
        private readonly IUserRepository _userRepository;

        public PatientService(IPatientRepository patientRepository, IUserRepository userRepository)
        {
            _patientRepository = patientRepository;
            _userRepository = userRepository;
        }
        public async Task AddPatientAsync(string username,string email,string password,string emri, string mbiemri, int mosha, string gjinia, string diagnoza, bool IsDeleted)
        {
            var user = new User
            {
                Username = username,
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                Role = "Pacient"
            };
            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            var patient = new Patient
            {
                UserId = user.Id,
                Emri = emri,
                Mbiemri = mbiemri,
                Mosha = mosha,
                Gjinia = gjinia,
                Diagnoza = diagnoza,
                IsDeleted = false
            };
            await _patientRepository.AddAsync(patient);
            await _patientRepository.SaveChangesAsync();
        }
        public async Task<IEnumerable<Patient>> GetAllAsync() => await _patientRepository.GetAllAsync();
        public async Task<Patient?> GetByIdAsync(int id) => await _patientRepository.GetByIdAsync(id);
        public async Task UpdateAsync(int id, string emri, string mbiemri, int mosha, string gjinia, string diagnoza)
        {
            var patient = await _patientRepository.GetByIdAsync(id);
            if (patient == null) throw new Exception("Pacienti nuk u gjet");

            patient.Emri = emri;
            patient.Mbiemri = mbiemri;
            patient.Mosha = mosha;
            patient.Gjinia = gjinia;
            patient.Diagnoza = diagnoza;
          

            await _patientRepository.UpdateAsync(patient);
        }
        public async Task DeleteAsync(int id)
        {
            // Merr pacientin nga repository
            var patient = await _patientRepository.GetByIdAsync(id);
            if (patient == null) throw new Exception("Pacienti nuk u gjet");

            // Soft delete
            patient.IsDeleted = true;

            // Përditëso pacientin në databazë
            await _patientRepository.UpdateAsync(patient);
        }
        public async Task SaveChanges()
        {
            await _patientRepository.SaveChangesAsync();
        }
    }
}
