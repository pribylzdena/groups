using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
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
            User? currentUser = this.context.users.FirstOrDefault(u => u.id == id);
            if (currentUser == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var allGroupMembers = this.context.group_members.ToList();


            var userGroupIds = allGroupMembers
                .Where(gm => gm.user_id == currentUser.id)
                .Select(gm => gm.group_id)
                .Distinct()
                .ToList();

            var groups = this.context.groups
                .Where(g => userGroupIds.Contains(g.id))
                .ToList();


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
            int userId = Convert.ToInt32(HttpContext.Items["CurrentUserId"]);

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
            Console.WriteLine("Edit group action started");
            Console.WriteLine(JsonSerializer.Serialize(request, new JsonSerializerOptions { WriteIndented = true }));

            int userId = Convert.ToInt32(HttpContext.Items["CurrentUserId"]);

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

            var actualMembers = request.members;

            List<GroupMember> membersToAdd = new List<GroupMember>();
            List<int> newMemberIds = new List<int>();
            foreach (var item in request.members)
            {
                newMemberIds.Add(item.user.id);

                GroupMember member = new GroupMember();
                member.group_id = group.id;
                member.user_id = item.user.id;
                member.role = item.role;
                membersToAdd.Add(member);
            }

            List<GroupMember> membersForDelete = this.context.group_members
                .Where(u => u.group_id == group.id && !newMemberIds.Contains(u.user_id))
                .ToList();

            foreach (var member in membersForDelete)
            {
                this.context.group_members.Remove(member);
            }

            foreach (var member in membersToAdd)
            {
                this.context.group_members.Add(member);
            }

            this.context.SaveChanges();

            return Ok();
        }
    }
}
