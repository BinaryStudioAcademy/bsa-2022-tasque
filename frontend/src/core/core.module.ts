import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { BaseComponent } from './base/base.component';
import { GlobalErrorHandler } from './interceptors/global-error-handler';

@NgModule({
  imports: [HttpClientModule, SharedModule],
  providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }],
  declarations: [BaseComponent],
})
export class CoreModule {}
