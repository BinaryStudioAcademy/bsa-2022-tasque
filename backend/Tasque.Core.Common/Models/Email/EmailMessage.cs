namespace Tasque.Core.Common.Models.Email
{
    public class EmailMessage
    {
        public EmailContact Sender { get; set; }
        public EmailContact Reciever { get; set; }
        public string Subject { get; set; } = "";
        public string Content { get; set; } = "";

        public EmailMessage(EmailContact sender, EmailContact reciever)
        {
            Sender = sender;
            Reciever = reciever;
        }
    }
}
