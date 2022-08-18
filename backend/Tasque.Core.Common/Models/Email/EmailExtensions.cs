using Mailjet.Client.TransactionalEmails;
using SendGrid.Helpers.Mail;

namespace Tasque.Core.Common.Models.Email
{
    public static class EmailExtensions
    {
        public static TransactionalEmail ConvertForMailJet(this EmailMessage message)
        {
            return new TransactionalEmailBuilder()
                .WithFrom(new SendContact(message.Sender?.Email, message.Sender?.Name))
                .WithTo(new SendContact(message.Reciever.Email, message.Reciever.Name))
                .WithSubject(message.Subject)
                .WithHtmlPart(message.Content)
                .Build();
        }

        public static SendGridMessage ConvertForSendGrid(this EmailMessage message)
        {
            var msg = new SendGridMessage()
            {
                From = new EmailAddress(message.Sender?.Email, message.Sender?.Name),
                Subject = message.Subject,
                HtmlContent = message.Content,
            };
            msg.AddTo(message.Reciever.Email, message.Reciever.Name);
            return msg;
        }
    }
}
