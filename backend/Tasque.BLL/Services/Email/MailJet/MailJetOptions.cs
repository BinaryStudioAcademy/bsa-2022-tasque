using Tasque.Core.Common.Models.Email;

namespace Tasque.Core.BLL.Services.Email.MailJet
{
    public class MailJetOptions
    {
        public string ApiKey { get; set; } = null!;
        public string ApiSecret { get; set; } = null!;
        public string SenderEmail { get; set; } = null!;
        public string SenderName { get; set; } = null!;
        public bool IsSandboxMode { get; set; }

        public EmailContact Sender => new(SenderEmail, SenderName);
    }
}
