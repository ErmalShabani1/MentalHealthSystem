using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MentalHealthSystemManagement.Application.DTOs.User;
using MentalHealthSystemManagement.Application.Services;
using MentalHealthSystemManagement.Infrastructure.Data;
using MentalHealthSystemManagement.Application.Interfaces;
using Microsoft.Extensions.Configuration;
namespace MentalHealthSystemManagement.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authservice;
        private readonly JwtService _jwtservice;

        public AuthController(AuthService authservice, JwtService jwtservice)
        {
            _authservice = authservice;
            _jwtservice = jwtservice;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto dto)
        {
            try
            {
                if (dto == null)
                    return BadRequest("Invalid request data");

                var result = await _authservice.RegisterAsync(dto);
                if (result == "User already exists") 
                    return BadRequest(result);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserDto dto)
        {
            try
            {
                if (dto == null)
                    return BadRequest("Invalid request data");

                var user = await _authservice.LoginAsync(dto);
                if (user == null) return Unauthorized("Emri ose passwordi jane dhene gabim");

                var token = _jwtservice.GenerateToken(user.Id.ToString(), user.Username, user.Role);

                var isDevelopment = HttpContext.RequestServices.GetRequiredService<IConfiguration>()["ASPNETCORE_ENVIRONMENT"] == "Development";
                Response.Cookies.Append("jwt", token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = !isDevelopment, // Allow insecure cookies in development
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.UtcNow.AddMinutes(60)
                });

                Response.Cookies.Append("refreshToken", user.RefreshToken!, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = !isDevelopment, // Allow insecure cookies in development
                    SameSite = SameSiteMode.None,
                    Expires = user.RefreshTokenExpiryTime
                });

                return Ok(new { message = "Login successful", user = new { user.Id, user.Username, user.Email, user.Role } });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
        [HttpPost("refresh-Token")]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken)) return Unauthorized("Refresh token not found");
            var user = await _authservice.GetUserByRefreshTokenAsync(refreshToken);
            if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow) return Unauthorized("Invalid or expired refresh token");

            var newJwtToken = _jwtservice.GenerateToken(user.Id.ToString(), user.Username, user.Role);
            var newRefreshToken = _jwtservice.GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _authservice.UpdateUserAsync(user);

            var isDevelopment = HttpContext.RequestServices.GetRequiredService<IConfiguration>()["ASPNETCORE_ENVIRONMENT"] == "Development";
            Response.Cookies.Append("jwt", newJwtToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = !isDevelopment, // Allow insecure cookies in development
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddMinutes(60)
            });
            Response.Cookies.Append("refreshToken", newRefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = !isDevelopment, // Allow insecure cookies in development
                SameSite = SameSiteMode.None,
                Expires = user.RefreshTokenExpiryTime
            });

            return Ok(new { message = "Token refreshed successfully" });
        
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt");
            return Ok(new { message = "Logged out successfullt" });
        }
    }
}
