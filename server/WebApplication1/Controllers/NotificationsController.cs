using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.ResponseModels;

namespace WebApplication1.Controllers
{
    [Secured]
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private DB context = new DB();

        [HttpGet]
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
    }
}
