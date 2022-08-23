namespace Tasque.Core.Identity.Exeptions
{

    [Serializable]
    public class EmailNotConfirmedException : Exception
    {
        public EmailNotConfirmedException(string email) 
            : base($"Email {email} is not confirmed") { }
    }
}
