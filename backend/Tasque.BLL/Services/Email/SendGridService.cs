using SendGrid;
using Tasque.Core.Common.Models.Email;

namespace Tasque.Core.BLL.Services.Email
{
    public class SendGridService : IEmailService
    {
        private readonly ISendGridClient _client;

        public SendGridService(ISendGridClient client)
        {
            _client = client;
        }

        public async Task<bool> SendEmailAsync(EmailMessage message)
        {
            var response = await _client.SendEmailAsync(message.ConvertForSendGrid());
            if (!response.IsSuccessStatusCode)
            {
                var body = await response.DeserializeResponseBodyAsync();
                var errmsg = body.Select(x => $"{x.Key}: {x.Value}");
                throw new Exception(string.Join('\n', errmsg));
            }
            return true;
        }

        public async Task<bool> SendEmailsAsync(IEnumerable<EmailMessage> messages)
        {
            foreach (var message in messages)
                await SendEmailAsync(message);
            return true;
        }

        public Task<bool> SendEmailsAsync(EmailContact sender, IEnumerable<EmailContact> recievers, string subject, string content)
        {
            var emails = recievers.Select(x =>
                new EmailMessage(x)
                {
                    Sender = sender,
                    Subject = subject,
                    Content = content
                });
            return SendEmailsAsync(emails);
        }
    }
}
