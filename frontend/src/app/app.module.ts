import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from 'src/core/core.module';
import { SharedModule } from 'src/shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonComponent } from '../shared/components/button/button.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { SideBarComponent } from '../shared/components/sidebar/sidebar.component';
import { SideBarService } from 'src/core/services/sideBar.service';

@NgModule({
  declarations: [AppComponent, ButtonComponent, SideBarComponent],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    CoreModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
  ],
  providers: [SideBarService],
  bootstrap: [AppComponent],
})
export class AppModule {}
