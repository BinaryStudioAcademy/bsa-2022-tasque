import { Routes } from '@angular/router';
import { UserPermissionGuard } from './guards/user-permission.guard';
import { IssueTemplateComponent } from './issue-template/issue-template.component';

export const ProjectSettingsRoutes: Routes = [
    {
        path: 'settings/issue-template',
        component: IssueTemplateComponent,
        canActivate: [UserPermissionGuard],
    },
];
