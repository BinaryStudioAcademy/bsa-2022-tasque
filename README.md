# BSA-2022 | Tasque

Tasque is a task tracking system that unites all the good parts of the common task tracking systems and adds something of it's own on a top

## Applications

- [Backend](./backend) — Tasque backend. [.NET 6](https://www.c-sharpcorner.com/article/what-is-new-in-net-6-0/), [PostgreSQL](https://www.postgresql.org), [Amazon DynamoDB](https://aws.amazon.com/dynamodb/).

- [Frontend](./frontend) — Tasque frontend. [Angular 14](https://angular.io/), [rxjs](https://rxjs.dev)

## Requirements

- [NodeJS](https://nodejs.org/en/) (16.10.x);
- [TypeScript](https://www.typescriptlang.org/) (4.8.x);
- [RxJS](https://rxjs.dev/) (7.4.x);
- [NPM](https://www.npmjs.com/) (8.x.x);
- [PostgreSQL](https://www.postgresql.org/) (14.2)
      
## Tools

- [pgAdmin](https://www.pgadmin.org/)/[DBeaver](https://dbeaver.io/)
- [NoSQL Workbench](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/workbench.settingup.html)/[Dynobase](https://dynobase.dev/)
- [VSCode](https://code.visualstudio.com/)
- [Visual Studio](https://visualstudio.microsoft.com/vs/)/[Rider](https://www.jetbrains.com/rider/)

### DB Schema

```mermaid
erDiagram
  project {
      int id
      string Name
      string Description
      int authorId
      dateTime created_at
      dateTime updated_at
  }
```
