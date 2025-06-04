using Org.BouncyCastle.Asn1.Ocsp;
using System.Xml.Linq;
using WebApplication1.Models;
using static System.Net.Mime.MediaTypeNames;

namespace WebApplication1.Services
{
    public class NotificationService
    {
        private DB context = new DB();

        public Notification CreateNotification(string name, string text, string subject, int type)
        {
            var notification = new Notification();

            notification.name = name;
            notification.text = text;
            notification.subject = subject;
            notification.type = type;
            notification.created_at = DateTime.UtcNow;
            notification.updated_at = DateTime.UtcNow;
            notification.deleted_at = null;

            this.context.notifications.Add(notification);
            this.context.SaveChanges();
            return notification;
        }
    }
}
