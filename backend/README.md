## Make migration

Use the dotnet cli to make migration.

```bash
dotnet ef migrations add MigrationName --startup-project ./ --project ..\Tasque.DAL\
```