using Tasque.Core.Common.Models.Email;

namespace Tasque.Core.BLL.Services.Email
{
    public class SendGridService : IEmailService
    {
        public Task<bool> SendEmailAsync(EmailMessage message)
        {
            throw new NotImplementedException();
        }

        public Task<bool> SendEmailsAsync(IEnumerable<EmailMessage> messages)
        {
            throw new NotImplementedException();
        }

        public Task<bool> SendEmailsAsync(EmailContact sender, IEnumerable<EmailContact> recievers, string subject, string content)
        {
            throw new NotImplementedException();
        }
    }
}
