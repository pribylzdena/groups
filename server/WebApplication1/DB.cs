using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

namespace WebApplication1
{
    public class DB : DbContext
    {
        public DbSet<Group> Groups { get; set; }
        public DbSet<Note> Notes { get; set; }
        public DbSet<EventParticipant> EventParticipants { get; set; }
        public DbSet<GroupMember> GroupMembers { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<ScheduledEvent> ScheduledEvents { get; set; }
        public DbSet<TaskComment> TaskComments { get; set; }
        public DbSet<Models.Task> Tasks { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UsersNotification> UsersNotifications { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySQL("server=mysqlstudenti.litv.sssvt.cz;database=3b1_honzicektomas_db2;user=honzicektomas;password=123456;SslMode=none");
        }
        
    }
}
