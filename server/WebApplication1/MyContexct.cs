using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

namespace WebApplication1
{
    public class MyContexct : DbContext
    {
        public DbSet<Group> groups { get; set; }
        public DbSet<Note> notes { get; set; }
        //public DbSet<EventParticipants> event_participants { get; set; }
        //public DbSet<GroupMembers> group_members { get; set; }
        public DbSet<Notification> notifications { get; set; }
        public DbSet<ScheduledEvent> scheduled_events { get; set; }
        public DbSet<TaskComment> task_comments { get; set; }
        public DbSet<Models.Task> tasks { get; set; }
        public DbSet<User> users { get; set; }
        public DbSet<UsersNotification> users_notifications { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySQL("server=mysqlstudenti.litv.sssvt.cz;database=3b1_honzicektomas_db2;user=honzicektomas;password=123456;SslMode=none");
        }
        
    }
}
