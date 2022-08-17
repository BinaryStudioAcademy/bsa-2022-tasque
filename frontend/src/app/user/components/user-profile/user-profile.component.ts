import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { UserModel } from 'src/core/models/user/user-model';
import { NotificationService } from 'src/core/services/notification.service';
import { ValidationConstants } from 'src/entity-models/const-resources/validation-constraints';
import { LocalStorageKeys } from 'src/entity-models/local-storage-keys';
import { PasswordChangesDTO } from '../../dto/password-changes-dto';
import { ProfileChangesDTO } from '../../dto/profile-changes-dto';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.sass']
})
export class UserProfileComponent implements OnInit {

  public imageFile: File;
  public defaultUserAvatarUrl: string = '../../assets/default_avatar.svg';
  public allowedFileTypes = ['image/png', 'image/jpeg', 'image/gif'];
  public originalUser: ProfileChangesDTO = {} as ProfileChangesDTO;
  public profileChanges: ProfileChangesDTO = {} as ProfileChangesDTO;
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
  public isProfileChanged: boolean = false;

  constructor(private notificationService: NotificationService, private userService: UserService) {
    
   }  

  ngOnInit(): void {
    this.getUser();
    
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
    reader.addEventListener('load', () => (this.profileChanges.avatarURL = reader.result as string));
    reader.readAsDataURL(this.imageFile);
    //adding file to cloud will be here
    this.checkProfileChanged(target);
  }

  private getUser(): void {
    this.userService.getCurrentUser().subscribe(
      (resp) => {
        if (resp.ok && resp.body != null) {
          this.profileChanges = resp.body;
          this.originalUser = Object.assign({}, resp.body);
        } else {
          this.notificationService.error("Something went wrong");
        }
      },
      (error) => {
        this.notificationService.error(error);
      },
    );
  }

  public saveNewInfo(): void {
    if (!this.isProfileChanged) {
      this.notificationService.error("Profile was not changed");
      return;
    }
    this.userService.editUserProfile(this.profileChanges).subscribe(
      (resp) => {
        if (resp.ok && resp.body != null) {
          this.profileChanges = resp.body;
          this.originalUser = Object.assign({}, resp.body);
          this.isProfileChanged = false;
          this.notificationService.success("Profile was successfully changed");
        } else {
          this.notificationService.error("Something went wrong");
        }
      },
      (error) => {
        this.notificationService.error(error);
      },
    );
  }

  public saveNewPassword(): void {
    
  }

  public checkProfileChanged(event: any): void {
    this.isProfileChanged = JSON.stringify(this.profileChanges) != JSON.stringify(this.originalUser);
  }

}
