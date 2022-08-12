﻿using Tasque.Core.Common.Entities;

namespace Tasque.Core.BLL.Options
{
    public class EmailConfirmationOptions
    {
        public string Host { get; set; } = "";
        public string ConfirmationEndpoint { get; set; } = "";
        public string PasswordResetEndpoint { get; set; } = "";
        public int TokenLifetime { get; set; }
    }
}
