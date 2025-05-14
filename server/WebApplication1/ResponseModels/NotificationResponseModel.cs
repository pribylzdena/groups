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
        
        public List<RecipientResponseModel> recipients { get; set; }

        public NotificationResponseModel(Notification notification)
        {
            this.id = notification.id;
            this.name = notification.name;
            this.text = notification.text;
            this.subject = notification.subject;
            this.type = notification.type;
            this.recipients = [];
        }
    }
}
