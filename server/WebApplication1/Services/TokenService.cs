using JWT.Algorithms;
using JWT.Builder;
using WebApplication1.Models;

namespace WebApplication1.Services
{
    public class TokenService
    {
        //A TOHLE JE CELE CORKA?

        const string PASSWORD = "foobarbaz";

        public string Create(User model)
        {
            return JwtBuilder.Create()
                      .WithAlgorithm(new HMACSHA256Algorithm())
                      .WithSecret(PASSWORD)
                      .AddClaim("exp", DateTimeOffset.UtcNow.AddHours(1).ToUnixTimeSeconds())
                      .AddClaim("id", model.id)
                      .AddClaim("email", model.email)
                      .Encode();
        }

        public bool Verify(string header)
        {
            try
            {
                if (header == null)
                {
                    return false;
                }

                string[] parts = header.Split(' ');

                if (parts.Length != 2)
                {
                    return false;
                }

                var payload = JwtBuilder.Create()
                            .WithAlgorithm(new HMACSHA256Algorithm())
                            .WithSecret(PASSWORD)
                            .MustVerifySignature()
                            .Decode<IDictionary<string, object>>(parts[1]);

                return true;
            }
            catch
            {
                return false;
            }
        }

        public string GetEmailFromToken(string header)
        {
            try
            {
                if (header == null)
                {
                    return null;
                }
                string[] parts = header.Split(' ');
                if (parts.Length != 2)
                {
                    return null;
                }
                var payload = JwtBuilder.Create()
                            .WithAlgorithm(new HMACSHA256Algorithm())
                            .WithSecret(PASSWORD)
                            .MustVerifySignature()
                            .Decode<IDictionary<string, object>>(parts[1]);

                if (payload.ContainsKey("email"))
                {
                    Console.WriteLine(payload["email"].ToString());
                    return payload["email"].ToString();
                }
                return null;
            }
            catch
            {
                return null;
            }
        }
        public string GetIdFromToken(string header)
        {
            try
            {
                if (header == null)
                {
                    return null;
                }
                string[] parts = header.Split(' ');
                if (parts.Length != 2)
                {
                    return null;
                }
                var payload = JwtBuilder.Create()
                            .WithAlgorithm(new HMACSHA256Algorithm())
                            .WithSecret(PASSWORD)
                            .MustVerifySignature()
                            .Decode<IDictionary<string, object>>(parts[1]);

                if (payload.ContainsKey("id"))
                {
                    return payload["id"].ToString();
                }
                return null;
            }
            catch
            {
                return null;
            }
        }
    }
}
