import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from 'src/core/core.module';
import { SharedModule } from 'src/shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonComponent } from '../shared/components/button/button.component';
import { CreateOrganizationComponent } from 'src/shared/components/create-organization/create-organization.component';
import { CreateOrganizationDialogComponent } from '../shared/components/create-organization/create-organization-dialog/create-organization-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent,  
    CreateOrganizationComponent, 
    CreateOrganizationDialogComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    CoreModule,
    MatDialogModule,
    BrowserAnimationsModule,
  ],
  providers: [
    ButtonComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
