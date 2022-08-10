using Mailjet.Client.TransactionalEmails;

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
    }
}
