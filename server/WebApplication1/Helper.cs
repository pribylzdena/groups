namespace WebApplication1
{
    public static class Helper
    {
        public static string GetNameAlt(string name)
        {
            //TODO nevim nejak to proste formatovat asi

            string res = name;
            res = res.ToLower();
            return res;
        }
    }
}
