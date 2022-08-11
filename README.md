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
      Project ||--o{ User : authorId_id
      Project ||--|| Board : id_projectId
      Project ||--o{ Project_User : id_projectId
      Project }o--|| Organization : organizationId_id
      Project ||--o{ Sprint : id_projectId
      Project {
        id int PK
        name string
        author_id int FK
        organization_id int FK
        created_at datetime
        updated_at datetime
    }
      User ||--o{ User_Task : id_userId
      User ||--o{ Project_User : id_userId
      User ||--|| Calendar : id_userId
      User ||--o{ Meeting_User : id_userId
      User ||--o{ Notification : id_userId
      User {
        id int PK
        name string
        email string
        password string
        salt string
        created_at datetime 
        updated_at datetime
				isEmailConfirmed boolean
    }
      Task }o--|| User : authorId_id
      Task }o--|| Project : projectId_id
      Task }o--|| BoardColumn : boardColumnId_id
      Task ||--o{ User_Task : id_taskId
      Task ||--o{ Sprint : sprintId_id
      Task ||--o{ Task_Attachment : id_taskId
      Task ||--o{ User : lastUpdatedBy_id
      Task {
        id int PK
        name string
        description string
        summary string
        state TaskState
        type TaskType
        priority TaskPriority
        created_at datetime
        updated_at datetime
        deadline datetime
        finished_at datetime
        author_id int FK
        project_id int FK
        board_column_id int FK
        sprint_id int FK
        last_updated_by int FK
        parent_task_id int FK
    }

      Comment }o--|| User : authorId_id
      Comment }o--|| Task : taskId_id
      Comment {
        id int PK
        author_id int FK
        task_id int  FK
        message string
        created_at datetime
        updated_at datetime
    }

      Sprint {
        id int PK
        name string
        description string
        created_at datetime
        updated_at datetime
        deadline datetime
        project_id int FK
    }

      Organization {
        id int PK
        name string
        author_id int FK
        created_at datetime
        updated_at datetime
    }

      Label }o--|| Project : projectId_id
      Label {
        id int PK
        name string
        project_id int FK
    } 

      Attachment ||--o{ Task_Attachment : id_attachmentId
      Attachment{
	      id int PK
	      url string
    }

      Board {
        id int PK
        name string
        project_id int FK
    }
      BoardColumn }o--|| Board : boardId_id
      BoardColumn {
        id int PK
        name string
        board_id int FK
    }

      Project_User {
        project_id int FK
        user_id int FK
        role_id int FK
    }

      User_Task {
        task_id int FK
        user_id int FK
    }

      Calendar ||--o{ Meeting : id_calendarId
      Calendar {
	      id int PK
	      user_id int FK
    }

      Meeting_User {
	      meeting_id int FK
	      user_id int FK
    }

      Notification {
	      id int PK
	      message string
	      user_id int FK
    }

      Task_Attachment {
	      task_id int FK
	      attachment_id int FK
    }

      Role }o--|| Project_User : id_roleId
      Role {
        id int PK
        name string
    }

      Task_Label }o--|| Task : taskId_id
      Task_Label }o--|| Label : labelId_id
      Task_Label {
        task_id int FK
        label_id int FK
    }

      Meeting ||--o{ Meeting_User : id_meetingId
      Meeting {
	      id int PK
	      starting_time datetime
	      ending_time datetime
	      created_at datetime
	      updated_at datetime
	      calendar_id int
    }

		EmailConfirmationToken ||--o{ User : token_userId
		EmailConfirmationToken {
			token uuid PK
			user_id int FK
			expiring_at datetime
		}
```
