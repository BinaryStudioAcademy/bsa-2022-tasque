using Mailjet.Client;
using Microsoft.Extensions.Options;
using Tasque.Core.BLL.Options;
using Tasque.Core.Common.Models.Email;

namespace Tasque.Core.BLL.Services.Email.MailJet
{
    public class MailJetService : IEmailService
    {
        private readonly IMailjetClient _client;
        private readonly MailJetOptions _options;
        public MailJetService(IMailjetClient client, IOptions<MailJetOptions> options)
        {
            _client = client;
            _options = options.Value;
        }

        public Task<bool> SendEmailAsync(EmailMessage message)
        {
            var email = new[] { message };
            return SendEmailsAsync(email);
        }

        public Task<bool> SendEmailsAsync(EmailContact sender, IEnumerable<EmailContact> recievers, string subject, string content)
        {
            var emails = recievers.Select(x =>
                new EmailMessage(x)
                {
                    Subject = subject,
                    Content = content
                });
            return SendEmailsAsync(emails);
        }

        public async Task<bool> SendEmailsAsync(IEnumerable<EmailMessage> messages)
        {
            var emails = messages.Select(x =>
                {
                    x.Sender = _options.Sender;
                    return x.ConvertForMailJet();
                }
            );

            var response = await _client.SendTransactionalEmailsAsync(emails, isSandboxMode: _options.IsSandboxMode);
            var errors = response.Messages.Where(x => x.Errors != null);
            if (errors.Any())
            {
                var errorMessages = errors.SelectMany(x => x.Errors).Select(x => x.ErrorMessage);
                var errorsStr = string.Join('\n', errorMessages);
                // Custom exception here?
                throw new Exception(errorsStr);
            }
            return true;
        }
    }
}
