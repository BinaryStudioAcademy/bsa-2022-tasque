import { Routes } from '@angular/router';
import { BasicSettingsComponent } from './basic-settings/basic-settings.component';
import { UserPermissionGuard } from './guards/user-permission.guard';
import { IssueTemplateComponent } from './issue-template/issue-template.component';

export const ProjectSettingsRoutes: Routes = [
    {
        path: 'settings/issue-template',
        component: IssueTemplateComponent,
        canActivate: [UserPermissionGuard],
    },
    {
        path: 'settings/basic-settings',
        component: BasicSettingsComponent,
        canActivate: [UserPermissionGuard],
    },
];
