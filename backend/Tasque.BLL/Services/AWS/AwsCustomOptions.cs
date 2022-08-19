using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Core.BLL.Services.AWS
{
    public class AwsOptions
    {
        public string? AccessKey { get; set; }

        public string? SecretKey { get; set; }

        public string? AWSProfile { get; set; }
    }
}
