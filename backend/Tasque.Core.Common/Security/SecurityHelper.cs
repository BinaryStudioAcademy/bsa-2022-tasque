using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System;
using System.Security.Cryptography;

namespace Tasque.Core.Common.Security
{
    public static class SecurityHelper
    {
        public static string HashPassword(string password, byte[] salt)
        => Convert.ToBase64String(
                    KeyDerivation.Pbkdf2(
                        password: password,
                        salt: salt,
                        prf: KeyDerivationPrf.HMACSHA256,
                        iterationCount: 10000,
                        numBytesRequested: 256 / 8
                    )
                );

        public static string HashPassword(string password, string salt)
            => HashPassword(password, Convert.FromBase64String(salt));

        public static byte[] GetRandomBytes(int length = 32)
        {
            var salt = RandomNumberGenerator.GetBytes(length);
            return salt;
        }

        public static bool ValidatePassword(string password, string hash, string salt)
        {
            return HashPassword(password, Convert.FromBase64String(salt)) == hash;
        }
    }
}
