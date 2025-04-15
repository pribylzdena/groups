using Microsoft.EntityFrameworkCore;

namespace WebApplication1
{
    public class MyContexct : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySQL("server=mysqlstudenti.litv.sssvt.cz;database=3b1_honzicektomas_db2;user=honzicektomz;password=123456;SslMode=none");
        }
    }
}
