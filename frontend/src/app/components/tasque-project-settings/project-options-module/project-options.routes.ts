import { Routes } from '@angular/router';
import { BasicIssueTemplateComponent } from './basic-issue-template/basic-issue-template.component';
import { UserPermissionGuard } from './guards/user-permission.guard';
import { IssueTemplateComponent } from './issue-template/issue-template.component';

export const ProjectSettingsRoutes: Routes = [
    {
        path: ':id/settings/issue-template',
        component: IssueTemplateComponent,
        canActivate: [UserPermissionGuard],
    },
    {
        path: ':id/settings/basic-issue-template',
        component: BasicIssueTemplateComponent,
        canActivate: [UserPermissionGuard],
    },
];
