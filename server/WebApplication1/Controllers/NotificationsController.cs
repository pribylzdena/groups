using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text.Json;
using WebApplication1.Models;
using WebApplication1.RequestModels;
using WebApplication1.ResponseModels;

namespace WebApplication1.Controllers
{
    //[Secured]
    [Route("api")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private DB context = new DB();

        [HttpGet("groups/{groupId}/notifications")]
        public IActionResult FindAll()
        {
            int userId = Convert.ToInt32(HttpContext.Items["CurrentUserId"]);

            var currentUser = this.context.users.FirstOrDefault(u => u.id == userId);
            if (currentUser == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var userNotifications = this.context.users_notifications.Where(n => n.user_id == currentUser.id).ToList();
            if (userNotifications.Count == 0) return NotFound(new { message = $"No notifications found for user: {currentUser.id}" });

            List<int> notificationIds = new List<int>();
            foreach (var item in userNotifications)
            {
                notificationIds.Add(item.notification_id);
            }

            var notifications = this.context.notifications.Where(n => notificationIds.Contains(n.id)).ToList();
            if (notifications.Count == 0) return NotFound(new { message = $"Error finding notification for user: {currentUser.id}" });

            List<NotificationResponseModel> responseNotifications = new List<NotificationResponseModel>();
            foreach(var item in notifications)
            {
                var ntf = new NotificationResponseModel(item);
                ntf.recipients.Add(new RecipientResponseModel(userNotifications.FirstOrDefault(u => u.notification_id == item.id), currentUser));
                responseNotifications.Add(ntf);
            }

            return Ok(responseNotifications);
        }


        [HttpPost("groups/{groupId}/notifications")]
        public IActionResult Create(int groupId, [FromBody] NotificationRequest request)
        {
            //Console.WriteLine(JsonSerializer.Serialize(request, new JsonSerializerOptions { WriteIndented = true }));


            int userId = /*Convert.ToInt32(HttpContext.Items["CurrentUserId"])*/1;

            var currentUser = this.context.users.FirstOrDefault(u => u.id == userId);
            if (currentUser == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var group = this.context.groups.FirstOrDefault(g => g.id == groupId);
            if (group == null)
            {
                return NotFound(new { message = "Group not found" });
            }

            var newNtf = new Notification
            {
                name = request.name,
                text = request.text,
                subject = request.subject,
                type = request.type,
                group_id = groupId,
                created_by = currentUser.id,
                updated_by = currentUser.id,
                created_at = DateTime.UtcNow,
                updated_at = DateTime.UtcNow,
                deleted_at = null,
            };
            this.context.notifications.Add(newNtf);
            this.context.SaveChanges();


            var UserNtf = new UsersNotification();

            UserNtf.user_id = userId;
            UserNtf.notification_id = newNtf.id;
            this.context.users_notifications.Add(UserNtf);
            this.context.SaveChanges();

            var response = new NotificationResponseModel(newNtf);
            return Ok(response);

        }
    }

    
}
