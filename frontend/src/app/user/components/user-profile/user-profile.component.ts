import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { UserModel } from 'src/core/models/user/user-model';
import { NotificationService } from 'src/core/services/notification.service';
import { ValidationConstants } from 'src/entity-models/const-resources/validation-constraints';
import { LocalStorageKeys } from 'src/entity-models/local-storage-keys';
import { PasswordChangesDTO } from '../../dto/password-changes-dto';
import { ProfileChangesDTO } from '../../dto/profile-changes-dto';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.sass']
})
export class UserProfileComponent implements OnInit {

  public imageFile: File;
  private defaultUserAvatarUrl: string = '../../assets/default_avatar.svg';
  public allowedFileTypes = ['image/png', 'image/jpeg', 'image/gif'];
  public profileChanges: ProfileChangesDTO;
  public passwordChanches: PasswordChangesDTO;
  public hidePass = true;
  public profileForm: FormGroup =  new FormGroup({});
  public changePassForm: FormGroup =  new FormGroup({});
  public userNameControl: FormControl;
  public emailControl: FormControl;
  public prevPasswordControl: FormControl;
  public newPasswordControl: FormControl;
  public unsubscribe$ = new Subject<void>(); 
  public localStorage = window.localStorage;
  public localStorageKeys = LocalStorageKeys;
  private validationConstants = ValidationConstants;

  constructor(private notificationService: NotificationService) {
    
   }

  ngOnInit(): void {
    this.profileChanges = this.getUser();
    if (this.profileChanges.avatar == undefined) {
      this.profileChanges.avatar = this.defaultUserAvatarUrl;
    }
    this.passwordChanches = {} as PasswordChangesDTO;
    this.passwordChanches.newPassword = "";
    this.passwordChanches.previousPassword = "";
    this.emailControl = new FormControl( this.profileChanges.email, [
      Validators.email,
      Validators.required,
      Validators.pattern(this.validationConstants.emailRegex)
    ]);
    this.userNameControl = new FormControl( this.profileChanges.email, [
      Validators.required,
      Validators.minLength(this.validationConstants.minLengthName)
    ]);
    this.prevPasswordControl = new FormControl(this.passwordChanches.previousPassword, [
      Validators.required,
      Validators.minLength(this.validationConstants.minLengthPassword)
    ]);
    this.newPasswordControl = new FormControl(this.passwordChanches.previousPassword, [
      Validators.required,
      Validators.minLength(this.validationConstants.minLengthPassword)
    ]);
    this.profileForm = new FormGroup({
      userNameControl: this.userNameControl,
      emailControl: this.emailControl
    });
    this.changePassForm = new FormGroup({
      prevPasswordControl: this.prevPasswordControl,
      newPasswordControl: this.newPasswordControl
    });
  }

  public handleFileInput(target: any) {
    this.imageFile = target.files[0];

    if (!this.imageFile) {
        target.value = '';
        return;
    }

    if (!this.allowedFileTypes.includes(this.imageFile.type)) {
        this.notificationService.warning(`File type ${this.imageFile.type} not allowed`);
        target.value = '';
        return;
    }

    if (this.imageFile.size / 1000000 > 5) {
        this.notificationService.warning(`Image can't be heavier than ~5MB`);
        target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => (this.profileChanges.avatar = reader.result as string));
    reader.readAsDataURL(this.imageFile);
  }

  private getUser(): ProfileChangesDTO {
    let user = {} as ProfileChangesDTO;
    user.id = 1;
    user.name = 'User1';
    user.email = 'user@domain.com';
    return user;
  }

  public saveNewInfo(): void {

  }

  public saveNewPassword(): void {
    
  }

}
