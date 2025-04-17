using WebApplication1.Models;

namespace WebApplication1.ResponseModels
{
    public class NotificationResponseModel
    {
        public int id { get; set; }
        public string name { get; set; }
        public string text { get; set; }
        public string subject { get; set; }
        public int type { get; set; }

        public NotificationResponseModel(Notification notifications)
        {
            this.id = notifications.id;
            this.name = notifications.name;
            this.text = notifications.text;
            this.subject = notifications.subject;
            this.type = notifications.type;
        }
    }
}
