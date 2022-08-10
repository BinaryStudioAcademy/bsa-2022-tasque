using Tasque.Core.Common.Models.Email;

namespace Tasque.Core.BLL.Services.Email
{
    public interface IEmailService
    {
        public Task<bool> SendEmailAsync(EmailMessage message);
        public Task<bool> SendEmailsAsync(IEnumerable<EmailMessage> messages);
        public Task<bool> SendEmailsAsync(EmailContact sender, IEnumerable<EmailContact> recievers, string subject, string content);
    }
}
