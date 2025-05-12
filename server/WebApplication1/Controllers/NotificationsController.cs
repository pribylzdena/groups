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

            var allNotis = this.context.notifications;
            var allRecipients = this.context.users_notifications.ToList();
            var currUserRecipients = this.context.users_notifications.Where(x => x.user_id == userId).ToList();
            var currUserNotis = new List<Notification>();

            foreach (var item in currUserRecipients)
            {
                Notification? noti = new Notification();

                noti = allNotis.Find(item.notification_id);
                if (noti != null) currUserNotis.Add(noti);
            }

            var response = new List<NotificationResponseModel>();

            foreach (var item in currUserNotis)
            {
                response.Add(new NotificationResponseModel(item));
            }

            foreach (var noti in response)
            {
                foreach (var recip in allRecipients)
                {
                    if (recip.notification_id == noti.id)
                    {
                        var user = this.context.users.Find(recip.user_id);

                        noti.recipients.Add(new RecipientResponseModel(recip, user));
                    }
                }
            }

            return Ok(response);

        }

        [HttpPost("groups/{groupId}/notifications")]
        public IActionResult Create(int groupId, [FromBody] NotificationRequest request)
        {
            Console.WriteLine(JsonSerializer.Serialize(request, new JsonSerializerOptions { WriteIndented = true }));

            int userId = Convert.ToInt32(HttpContext.Items["CurrentUserId"]);

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
                created_by = userId,
                updated_by = userId,
                created_at = DateTime.UtcNow,
                updated_at = DateTime.UtcNow,
                deleted_at = null,
            };
            this.context.notifications.Add(newNtf);
            this.context.SaveChanges();


            var UserNtf = new UsersNotification();

            UserNtf.user_id = userId;
            UserNtf.notification_id = newNtf.id;

            var response = new NotificationResponseModel(newNtf);

            if (request.recipients == null || request.recipients.Count == 0)
            {
                response.recipients.Add(new RecipientResponseModel(UserNtf, this.context.users.Find(UserNtf.user_id)));
                this.context.users_notifications.Add(UserNtf);
                this.context.SaveChanges();
                return Ok(response);
            }

            foreach (var item in request.recipients!)
            {
                var newUserNtf = new UsersNotification();
                newUserNtf.user_id = item.user.id;
                newUserNtf.notification_id = newNtf.id;

                var newUser = new User();
                newUser = this.context.users.Find(item.user.id);
                if (newUser == null) continue;

                response.recipients.Add(new RecipientResponseModel(newUserNtf, newUser));
                this.context.users_notifications.Add(newUserNtf);
                this.context.SaveChanges();
            }

            return Ok(response);

        }
    }

    
}
