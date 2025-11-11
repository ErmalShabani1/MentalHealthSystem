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
    public class PsikologService
    {
        private readonly IPsikologRepository _psikologRepository;
        private readonly IUserRepository _userRepository;

        public PsikologService(IPsikologRepository psikologRepository, IUserRepository userRepository)
        {
            _psikologRepository = psikologRepository;
            _userRepository = userRepository;
        }
        public async Task AddPsikologAsync(string username, string email, string password, string name, string surname, string specialization, string experienceLevel)
        {
            var user = new User
            {
                Username = username,
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                Role = "Psikolog"
            };
            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            var psikologi = new Psikologi
            {
                UserId = user.Id,
                Name = name,
                Surname = surname,
                Specialization = specialization,
                ExperienceLevel = experienceLevel
            };
            await _psikologRepository.AddAsync(psikologi);
            await _psikologRepository.SaveChangesAsync();
        }
        public async Task<IEnumerable<Psikologi>> GetAllAsync() => await _psikologRepository.GetAllAsync();
        public async Task<Psikologi?> GetByIdAsync(int id) => await _psikologRepository.GetByIdAsync(id);
        public async Task UpdateAsync(int id, string name, string surname, string specialization, string experienceLevel)
        {
            var psikologi = await _psikologRepository.GetByIdAsync(id);
            if (psikologi == null) throw new Exception("Psikologi nuk u gjet");

            psikologi.Name = name;
            psikologi.Surname = surname;
            psikologi.Specialization = specialization;
            psikologi.ExperienceLevel = experienceLevel;

            await _psikologRepository.UpdateAsync(psikologi);
        }
        public async Task DeleteAsync(int id)
        {
            await _psikologRepository.DeleteAsync(id);
        }
    }
}