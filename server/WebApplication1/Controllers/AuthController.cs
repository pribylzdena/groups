using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private DB _db = new();

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest req)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var exists = _db.users.FirstOrDefault(u => u.email == req.Email) != null;
            if (exists)
                return Conflict(new { message = "Email už je registrován." });

            var user = new User
            {
                email = req.Email,
                name = req.Name,
                password = req.Password
            };

            _db.users.Add(user);
            _db.SaveChanges();

            return CreatedAtAction(null, new { id = user.id });
        }
    }
}
