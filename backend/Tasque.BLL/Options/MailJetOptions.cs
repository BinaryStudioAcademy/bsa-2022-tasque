using Tasque.Core.Common.Models.Email;

namespace Tasque.Core.BLL.Options
{
    public class MailJetOptions
    {
        public string ApiKey { get; set; } = null!;
        public string ApiSecret { get; set; } = null!;
        public bool IsSandboxMode { get; set; }
    }
}
