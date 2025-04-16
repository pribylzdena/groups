using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupsController : ControllerBase
    {
        private MyContexct context = new MyContexct();

        [HttpGet]
        public IActionResult FindAll()
        {
            return Ok(this.context.groups);
        }
    }
}
