using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
using WebApplication1.Models;
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
            Models.Group groupEntity = this.context.groups.Find(id);

            if (groupEntity == null)
            {
                return NotFound(new { message = "Group not found" });
            }

            var group = new GroupResponseModel(groupEntity, new List<GroupMember>());

            return Ok(group);
        }
        

    }
}
