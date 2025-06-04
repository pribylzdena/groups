using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Asn1.Ocsp;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text.Json;
using WebApplication1.Models;
using WebApplication1.RequestModels;
using WebApplication1.ResponseModels;

namespace WebApplication1.Controllers
{
    [Secured]
    [Route("api")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private DB context = new DB();

        [HttpGet("notifications")]
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

        [HttpPost("notifications")]
        public IActionResult Create([FromBody] NotificationRequest request)
        {
            Console.WriteLine(JsonSerializer.Serialize(request, new JsonSerializerOptions { WriteIndented = true }));

            int userId = Convert.ToInt32(HttpContext.Items["CurrentUserId"]);

            var currentUser = this.context.users.FirstOrDefault(u => u.id == userId);
            if (currentUser == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var newNtf = new Notification
            {
                name = request.name,
                text = request.text,
                subject = request.subject,
                type = request.type,
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
                return CreatedAtAction(nameof(Create), response);
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

            return CreatedAtAction(nameof(Create), response);

        }

        [HttpGet("notifications/{id}")]
        public IActionResult GetNotificationById(int id)
        {
            int userId = Convert.ToInt32(HttpContext.Items["CurrentUserId"]);

            var currentUser = this.context.users.FirstOrDefault(u => u.id == userId);
            if (currentUser == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var notification = this.context.notifications.FirstOrDefault(n => n.id == id);
            if (notification == null)
            {
                return NotFound(new { message = "Notification not found" });
            }

            var user_nofitications = this.context.users_notifications.Where(u => u.notification_id == notification.id).ToList();
            if (user_nofitications.Count < 1)
            {
                return NotFound(new { message = "Relation not found" });
            }

            if (!user_nofitications.Any(u => u.user_id == currentUser.id))
            {
                return Unauthorized();
            }

            var user_ids = user_nofitications.Select(u => u.user_id);
            var ntf_users = this.context.users.Where(u => user_ids.Contains(u.id)).ToList();
            var response = new NotificationResponseModel(notification);

            foreach (var item in user_nofitications)
            {
                response.recipients.Add(new RecipientResponseModel(item, ntf_users.FirstOrDefault(u => u.id == item.user_id)));
            }

            return Ok(response);
        }

        [HttpPost("notifications/{id}/read")]
        public IActionResult ReadNotification(int id)
        {
            int userId = Convert.ToInt32(HttpContext.Items["CurrentUserId"]);

            var currentUser = this.context.users.FirstOrDefault(u => u.id == userId);
            if (currentUser == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var notification = this.context.notifications.FirstOrDefault(n => n.id == id);
            if (notification == null)
            {
                return NotFound(new { message = "Notification not found" });
            }

            var user_nofitication = this.context.users_notifications.FirstOrDefault(u => u.notification_id == notification.id && 
            u.user_id == currentUser.id);
            if (user_nofitication == null)
            {
                return NotFound(new { message = "Relation not found" });
            }

            user_nofitication.read_at = DateTime.Now;
            this.context.SaveChanges();

            return Ok(notification);
        }

        [HttpGet("notifications/count")]
        public IActionResult GetUnreadCount()
        {
            int userId = Convert.ToInt32(HttpContext.Items["CurrentUserId"]);

            var currentUser = this.context.users.FirstOrDefault(u => u.id == userId);
            if (currentUser == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var allNotis = this.context.notifications;
            var currUserRecipients = this.context.users_notifications.Where(x => x.user_id == userId && x.read_at == null).ToList();
            var currUserNotis = new List<Notification>();

            foreach (var item in currUserRecipients)
            {
                Notification? noti = new Notification();

                noti = allNotis.Find(item.notification_id);
                if (noti != null) currUserNotis.Add(noti);
            }

            Console.WriteLine(currUserNotis.Count());

            return Ok(currUserNotis.Count());
        }
    }
}
