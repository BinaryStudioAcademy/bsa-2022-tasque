using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Options;
using Tasque.Core.BLL.Options;

namespace Tasque.Core.BLL.Services
{
    public class FileUploadService
    {
        private readonly string _bucketName;
        private readonly IAmazonS3 _awsS3Client;
        private readonly AmazonS3Options _options;
        public FileUploadService(IOptions<AmazonS3Options> options)
        {
            _options = options.Value;
            _bucketName = _options.BucketName;
            _awsS3Client = new AmazonS3Client(_options.AwsAccessKey, _options.AwsSecretAccessKey, RegionEndpoint.GetBySystemName(_options.Region));
        }

        public async Task<string?> UploadFileAsync(string fileData, string folder)
        {
            var contentType = GetContentType(fileData);
            byte[] bytes = Convert.FromBase64String(GetBase64String(fileData));
            return await UploadFileAsync(bytes, contentType, folder);
        }

        public async Task<string?> UploadFileAsync(byte[] bytes, string contentType, string folder)
        {
            var extension = GetExtention(contentType);
            var fileName = CreateFileName(extension);
            Stream stream = new MemoryStream(bytes);

            var request = new PutObjectRequest()
            {
                BucketName = _bucketName,
                Key = $"{folder}/{fileName}",
                InputStream = stream,
                ContentType = contentType,
                AutoCloseStream = true,
                CannedACL = "public-read",
            };

            var result = await _awsS3Client.PutObjectAsync(request);
            if (result != null)
            {
                return $"https://{_bucketName}.s3.{_options.Region}.amazonaws.com/{folder}/{fileName}";
            }
            return null;
        }

        private string GetContentType(string fileData)
        {
            return fileData.Split(';')[0].Split(':')[1];
        }

        private string GetExtention(string contentType)
        {
            return contentType.Split('/')[1];
        }

        private string CreateFileName(string extension)
        {
            return DateTime.UtcNow.Ticks.ToString() + '.' + extension;
        }

        private string GetBase64String(string fileData)
        {
            return fileData.Split(',')[1];
        }
    }
}
