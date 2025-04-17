using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : Controller
    {
        private DB _db = new();

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest req)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var exists = _db.Users.FirstOrDefault(u => u.Email == req.Email) != null;
            if (exists)
                return Conflict(new { message = "Email už je registrován." });

            var user = new User
            {
                Email = req.Email,
                Name = req.Name,
                Password = req.Password
            };

            _db.Users.Add(user);
            _db.SaveChanges();

            return CreatedAtAction(null, new { id = user.Id });
        }
    }
}
