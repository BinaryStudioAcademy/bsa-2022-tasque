using System.Reflection;

namespace Tasque.Core.BLL.Services
{
    public static class AssemblyResourceService
    {
        private static readonly Dictionary<string, string> _resources = new();
        public static async Task<string> GetResource(AssemblyResource res)
        {
            var name = res.FileName;
            if (_resources.TryGetValue(name, out string? val))
                return val;
            var str = await Read(name);
            _resources.Add(name, str);
            return str;
        }

        private static async Task<string> Read(string name)
        {
            // Determine path
            var assembly = Assembly.GetExecutingAssembly();
            try
            {
                string resourcePath = name;
                resourcePath = assembly
                    .GetManifestResourceNames()
                    .Single(str => str.EndsWith(name));

                using (Stream stream = assembly.GetManifestResourceStream(resourcePath)!)
                using (StreamReader reader = new(stream))
                {
                    return await reader.ReadToEndAsync();
                }
            }
            catch (Exception)
            { return string.Empty; }
        }
    }

    public sealed class AssemblyResource
    {
        internal string FileName { get; }
        private AssemblyResource(string file) => FileName = file;
        public static AssemblyResource ResetPasswordMessage => new("ResetPasswordMessage.html");
        public static AssemblyResource ConfirmEmailMessage => new("ConfirmEmailMessage.html");
        public static AssemblyResource ReferralInvitationMessage => new("ReferralInvitationMessage.html");
    }
}
