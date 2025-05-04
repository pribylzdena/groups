using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
using WebApplication1.Models;
using WebApplication1.RequestModels;
using WebApplication1.ResponseModels;

namespace WebApplication1.Controllers
{
    [Secured]
    [Route("api/[controller]")]
    [ApiController]
    public class GroupsController : ControllerBase
    {
        private DB context = new DB();


        [HttpGet]
        public IActionResult FindAll()
        {
            int id = Convert.ToInt32(HttpContext.Items["CurrentUserId"]);

            User currentUser = this.context.users.FirstOrDefault(u => u.id == id);
            if (currentUser == null)
            {
                return NotFound(new { message = "User not found" });
            }

            List<GroupResponseModel> models = new List<GroupResponseModel>();
            foreach (var item in this.context.groups.Where(g => g.created_by == currentUser.id))
            {
                models.Add(new GroupResponseModel(item, new List<GroupMember>()));
            }


            return Ok(models);
        }

        [HttpGet("{id}")]
        public ObjectResult FindById(int id)
        {
            int userId = Convert.ToInt32(HttpContext.Items["CurrentUserId"]);
            User currentUser = this.context.users.FirstOrDefault(u => u.id == userId);
            if (currentUser == null)
            {
                return NotFound(new { message = "User not found" });
            }


            Models.Group groupEntity = this.context.groups.Find(id);
            if (groupEntity == null)
            {
                return NotFound(new { message = "Group not found" });
            }

            var group = new GroupResponseModel(groupEntity, new List<GroupMember>());

            return Ok(group);
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreateGroupRequest request)
        {
            int userId = Convert.ToInt32(HttpContext.Items["CurrentUserId"]);

            var currentUser = this.context.users.FirstOrDefault(u => u.id == userId);
            if (currentUser == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var newGroup = new Models.Group
            {
                name = request.Name,
                created_by = currentUser.id,
                updated_by = currentUser.id,
                created_at = DateTime.UtcNow,
                updated_at = DateTime.UtcNow,
                deleted_at = null
            };

            this.context.groups.Add(newGroup);
            this.context.SaveChanges();

            var response = new GroupResponseModel(newGroup, new List<GroupMember>());
            return CreatedAtAction(nameof(Create), response);
        }
    }
}
