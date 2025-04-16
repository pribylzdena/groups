using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

namespace WebApplication1
{
    public class MyContexct : DbContext
    {
        public DbSet<Group> groups { get; set; }
        public DbSet<Notes> notes { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySQL("server=mysqlstudenti.litv.sssvt.cz;database=3b1_honzicektomas_db2;user=honzicektomas;password=123456;SslMode=none");
        }
        
    }
}
