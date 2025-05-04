using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using WebApplication1.Models;
using WebApplication1.RequestModels;
using WebApplication1.ResponseModels;

namespace WebApplication1.Controllers
{
    //[Secured]
    [Route("api/[controller]")]
    [ApiController]
    public class GroupsController : ControllerBase
    {
        private DB context = new DB();


        [HttpGet]
        public IActionResult FindAll()
        {
            int id = /*Convert.ToInt32(HttpContext.Items["CurrentUserId"])*/1;
            User? currentUser = this.context.users.FirstOrDefault(u => u.id == id);
            if (currentUser == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var groups = this.context.groups.Where(g => g.created_by == currentUser.id).ToList();

            var allGroupMembers = this.context.group_members.ToList();

            List<GroupResponseModel> models = new List<GroupResponseModel>();
            foreach (var group in groups)
            {
                var model = new GroupResponseModel(group);

                model.groupMembers = new List<GroupMemberResponseModel>();

                foreach (var item in allGroupMembers.Where(gm => gm.group_id == group.id))
                {
                    var user = this.context.users.Find(item.user_id);
                    model.groupMembers.Add(new GroupMemberResponseModel(item, user));
                }

                models.Add(model);
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

            var group = new GroupResponseModel(groupEntity);

            return Ok(group);
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreateGroupRequest request)
        {
            int userId = /*Convert.ToInt32(HttpContext.Items["CurrentUserId"])*/1;

            var currentUser = this.context.users.FirstOrDefault(u => u.id == userId);
            if (currentUser == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var newGroup = new Models.Group
            {
                name = request.name,
                created_by = currentUser.id,
                updated_by = currentUser.id,
                created_at = DateTime.UtcNow,
                updated_at = DateTime.UtcNow,
                deleted_at = null
            };
            this.context.groups.Add(newGroup);
            this.context.SaveChanges();

            GroupMember member = new GroupMember()
            {
                user_id = userId,
                group_id = newGroup.id,
                role = "Admin",
            };

            this.context.group_members.Add(member);

            this.context.SaveChanges();

            var response = new GroupResponseModel(newGroup);
            return CreatedAtAction(nameof(Create), response);
        }

        [HttpPut("{groupId}")]
        public IActionResult Edit(int groupId, [FromBody] EditGroupRequest request)
        {
            int userId = /*Convert.ToInt32(HttpContext.Items["CurrentUserId"])*/1;

            var currentUser = this.context.users.FirstOrDefault(u => u.id == userId);
            if (currentUser == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var group = this.context.groups.Find(groupId);
            if (group == null)
            {
                return NotFound(new { message = "Group not found" });
            }

            group.name = request.name;
            this.context.group_members.RemoveRange(this.context.group_members.Where(gm => gm.group_id == groupId));

            this.context.SaveChanges();

            var response = new GroupResponseModel(group);


            foreach (var item in request.groupMembers)
            {
                Console.WriteLine(item.user_id);
                User? user = this.context.users.Find(item.user_id);
                if (user != null)
                {
                    response.groupMembers.Add(new GroupMemberResponseModel(item, user));
                    this.context.group_members.Add(item);
                }
            }

            this.context.SaveChanges();
            return Ok(response);
        }
    }
}
