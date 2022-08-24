# Startup guide

## To run **backend**

Go to [Backend path](./frontend)

- Setup environment variables in [appsettings.json](./backend/Tasque.Core.WebAPI/appsettings.json) or using _user secrets_

```c#
  "JwtIssuerOptions": {
    "Issuer": "tasque",
    "Audience": "tasque",
    "ValidFor": "1",
    "Key": "BSA-2022-Tasque.Core"
  },
  "ConnectionStrings": {
    "TasqueDb": "" // enter here our db connection string
  },
  "SendGridOptions": {
    "ApiKey": "" // enter here SendGrid api key
  },
  "EmailConfirmationOptions": {
    "Host": "", // enter here host ip. Default is: http://localhost:4200
    "ConfirmationEndpoint": "/auth/confirm",
    "PasswordResetEndpoint": "/auth/restore",
    "SenderEmail": "", // enter here our email
    "SenderName": "", // enter here our name
    "TokenLifetime": 600
  }
```

- Update database if it is not updated or invalid

```bash
dotnet ef database update --startup-project Tasque.Core.WebAPI --project Tasque.DAL
```

- Run project using _vs studio_ or _console_

```bash
dotnet run --project Tasque.Core.WebAPI/Tasque.Core.WebAPI.csproj
```

## To run **frontend**

Go to [Frontend path](./frontend)

- Install or update all node modules

```bash
npm install
```

- Run project using this command in console

```bash
ng serve
```

## Finally

- After all these steps you can access our site by following http://localhost:4200/ path

- Or to access _Swagger_ follow http://localhost:4200/api/swagger/index.html
