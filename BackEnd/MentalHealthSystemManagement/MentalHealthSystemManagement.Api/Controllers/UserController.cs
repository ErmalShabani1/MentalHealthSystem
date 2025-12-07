using MentalHealthSystemManagement.Application.DTOs.User;
using MentalHealthSystemManagement.Application.Services;
using MentalHealthSystemManagement.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;

namespace MentalHealthSystemManagement.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AuthService _authservice;
        private readonly JwtService _jwtservice;
        private readonly ApplicationDbContext _context;

        public UserController(AuthService authservice, JwtService jwtservice, ApplicationDbContext context)
        {
            _authservice = authservice;
            _jwtservice = jwtservice;
            _context = context;
        }

        [HttpGet("users/{id}")]
            public async Task<IActionResult> GetUserById(int id)
            {
                var user = await _authservice.GetUserByIdAsync(id);
                if (user == null) return NotFound("User not found");
                return Ok(user);
            }
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _authservice.GetAllUsersAsync(); // ose userService
            if (users == null || !users.Any())
                return Ok(new List<object>()); // kthen listë bosh pa error

            return Ok(users);
        }
        [HttpPut("users/{id}")]
            public async Task<IActionResult> UpdateUser(int id, [FromBody] RegisterUserDto dto)
            {
                var user = await _authservice.GetUserByIdAsync(id);
                if (user == null) return NotFound("User not found");

                user.Username = dto.Username;
                user.Email = dto.Email;
                user.Role = dto.Role;

                if (!string.IsNullOrEmpty(dto.Password))
                {
                    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
                }

                await _authservice.UpdateUserAsync(user);
                return Ok(new { message = "User updated successfully" });
            }

            [HttpDelete("users/{id}")]
            public async Task<IActionResult> DeleteUser(int id)
            {
                var user = await _authservice.GetUserByIdAsync(id);
                if (user == null) return NotFound("User not found");

                await _authservice.DeleteUserAsync(id);
                return Ok(new { message = "User deleted successfully" });
            }
        }
    }

