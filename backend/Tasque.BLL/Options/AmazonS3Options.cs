
namespace Tasque.Core.BLL.Options
{
    public class AmazonS3Options
    {
        public string AwsAccessKey { get; set; } = null!;
        public string AwsSecretAccessKey { get; set; } = null!;
        public string BucketName { get; set; } = null!;
        public string Region { get; set; } = null!;
    }
}
