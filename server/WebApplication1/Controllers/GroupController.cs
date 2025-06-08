using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.RegularExpressions;
using WebApplication1.Models;
using WebApplication1.RequestModels;
using WebApplication1.ResponseModels;
using WebApplication1.Services;

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

            var groups = this.context.groups.Where(g => userGroupIds.Contains(g.id)).ToList();


            List<GroupResponseModel> models = new List<GroupResponseModel>();
            foreach (var group in groups)
            {
                var model = new GroupResponseModel(group);

                model.members = new List<GroupMemberResponseModel>();

                foreach (var item in allGroupMembers.Where(gm => gm.group_id == group.id))
                {
                    var user = this.context.users.Find(item.user_id);
                    model.members.Add(new GroupMemberResponseModel(item, user));
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
            var allGroupMembers = this.context.group_members.ToList();
            var response = new GroupResponseModel(groupEntity);

            foreach (var item in allGroupMembers.Where(gm => gm.group_id == groupEntity.id))
            {
                var user = this.context.users.Find(item.user_id);
                response.members.Add(new GroupMemberResponseModel(item, user));
            }


            return Ok(response);
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
                role = "admin",
            };

            this.context.group_members.Add(member);

            this.context.SaveChanges();

            var response = new GroupResponseModel(newGroup);
            return CreatedAtAction(nameof(Create), response);
        }

        [HttpPut("{groupId}")]
        public IActionResult Edit(int groupId, [FromBody] EditGroupRequest request)
        {
            NotificationService service = new NotificationService();
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

            var currentMembers = this.context.group_members
                .Where(gm => gm.group_id == group.id)
                .ToList();

            var currentMemberIds = currentMembers.Select(m => m.user_id).ToHashSet();
            var newMemberIds = request.members.Select(m => m.user.id).ToHashSet();

            var addedMemberIds = newMemberIds.Except(currentMemberIds).ToList();
            var removedMemberIds = currentMemberIds.Except(newMemberIds).ToList();

            List<GroupMember> membersToAdd = new List<GroupMember>();
            foreach (var item in request.members.Where(m => addedMemberIds.Contains(m.user.id)))
            {
                GroupMember member = new GroupMember();
                member.group_id = group.id;
                member.user_id = item.user.id;
                member.role = item.role;
                membersToAdd.Add(member);
            }

            var membersToRemove = currentMembers.Where(m => removedMemberIds.Contains(m.user_id)).ToList();
            this.context.group_members.RemoveRange(membersToRemove);

            this.context.group_members.AddRange(membersToAdd);

            foreach (var requestMember in request.members.Where(m => currentMemberIds.Contains(m.user.id)))
            {
                var existingMember = currentMembers.FirstOrDefault(m => m.user_id == requestMember.user.id);
                if (existingMember != null)
                {
                    existingMember.role = requestMember.role;
                }
            }

            this.context.SaveChanges();

            var allCurrentMembers = this.context.group_members
                .Where(gm => gm.group_id == group.id)
                .Select(gm => gm.user_id)
                .ToList();

            var existingAddedUserIds = this.context.users
                .Where(u => addedMemberIds.Contains(u.id))
                .Select(u => u.id)
                .ToList();

            var existingRemovedUserIds = this.context.users
                .Where(u => removedMemberIds.Contains(u.id))
                .Select(u => u.id)
                .ToList();

            existingAddedUserIds.ForEach(userId => {
                var notif = service.CreateNotification(
                    "Group",
                    $"You were added to group: {group.name}",
                    "Added to group",
                    2
                );
                service.SendNotification(userId, notif.id);
            });

            existingRemovedUserIds.ForEach(userId => {
                var notif = service.CreateNotification(
                    "Group",
                    $"You were removed from group: {group.name}",
                    "Removed from group",
                    2
                );
                service.SendNotification(userId, notif.id);
            });

            return Ok();
        }

    }
}
