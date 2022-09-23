namespace Tasque.Core.Common.Models.Email
{
    public class EmailContact
    {
        public string Email { get; }
        public string Name { get; }

        public EmailContact(string email, string name)
        {
            Email = email;
            Name = name;
        }
    }
}