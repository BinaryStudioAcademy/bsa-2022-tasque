import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fromEvent, Subject } from 'rxjs';
import { NotificationService } from 'src/core/services/notification.service';
import { ValidationConstants } from 'src/core/models/const-resources/validation-constraints';
import { LocalStorageKeys } from 'src/core/models/local-storage-keys';
import { PasswordChangesDTO } from '../../dto/password-changes-dto';
import { ProfileChangesDTO } from '../../dto/profile-changes-dto';
import { UserService } from '../../services/user.service';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { filter, mergeMap, takeUntil } from 'rxjs/operators';
import { GetCurrentUserService } from 'src/core/services/get-current-user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.sass'],
})
export class UserProfileComponent implements OnInit {

  public emptyProfileDTO = {} as ProfileChangesDTO;

  public imageFile: File;
  public defaultUserAvatarUrl = '../../assets/default_avatar.svg';
  public allowedFileTypes = ['image/png', 'image/jpeg', 'image/gif'];
  public originalUser: ProfileChangesDTO = this.emptyProfileDTO;
  public profileChanges: ProfileChangesDTO = this.emptyProfileDTO;
  public passwordChanges: PasswordChangesDTO;

  public profileForm: FormGroup = new FormGroup({});
  public changePassForm: FormGroup = new FormGroup({});
  public userNameControl: FormControl;
  public emailControl: FormControl;
  public prevPasswordControl: FormControl;
  public newPasswordControl: FormControl;
  private validationConstants = ValidationConstants;

  public unsubscribe$ = new Subject<void>();

  public localStorage = window.localStorage;
  public localStorageKeys = LocalStorageKeys;
  public pencilIcon = faPencil;
  public isProfileChanged = false;
  public loading = false;
  public hidePass = true;
  public hideNewPass = true;

  constructor(
    private notificationService: NotificationService,
    private userService: UserService,
    private currentUserService: GetCurrentUserService
  ) { }

  ngOnInit(): void {
    this.getUser();

    this.passwordChanges = {} as PasswordChangesDTO;
    this.passwordChanges.newPassword = '';
    this.passwordChanges.previousPassword = '';

    this.emailControl = new FormControl(this.profileChanges.email, [
      Validators.required,
      Validators.pattern(this.validationConstants.emailRegex),
    ]);
    this.userNameControl = new FormControl(this.profileChanges.name, [
      Validators.required,
      Validators.pattern(/^([a-zA-Z0-9]+\s)*[a-zA-Z0-9]+$/),
      Validators.minLength(this.validationConstants.minLengthName),
      Validators.maxLength(this.validationConstants.maxLengthName),
    ]);
    this.prevPasswordControl = new FormControl(this.passwordChanges.previousPassword, [
        Validators.required,
        Validators.minLength(this.validationConstants.minLengthPassword),
        Validators.maxLength(this.validationConstants.maxLengthPassword),
    ]);
    this.newPasswordControl = new FormControl(this.passwordChanges.newPassword, [
        Validators.required,
        Validators.minLength(this.validationConstants.minLengthPassword),
        Validators.maxLength(this.validationConstants.maxLengthPassword),
    ]);

    this.profileForm = new FormGroup({
      userNameControl: this.userNameControl,
      emailControl: this.emailControl,
    });
    this.changePassForm = new FormGroup({
      prevPasswordControl: this.prevPasswordControl,
      newPasswordControl: this.newPasswordControl,
    });
  }

  public handleFileInput(target: EventTarget | null): void {
    if (target == null) {
      return;
    }

    const input = target as HTMLInputElement;
    if (input == null) {
      return;
    }

    const fileList: FileList | null = input.files;
    if (fileList == null) {
      return;
    }

    this.imageFile = fileList[0];

    if (!this.imageFile) {
      input.value = '';
      return;
    }

    if (!this.allowedFileTypes.includes(this.imageFile.type)) {
      this.notificationService.warning(
        `File type ${this.imageFile.type} not allowed`,
      );
      input.value = '';
      return;
    }

    if (this.imageFile.size / 1000000 > 5) {
      this.notificationService.warning('Image cannot be heavier than ~5MB');
      input.value = '';
      return;
    }

    const reader = new FileReader();
    fromEvent(reader, 'load')
      .pipe(
        takeUntil(this.unsubscribe$),
        mergeMap(() => this.userService.editAvatar(reader.result as string)),
      )
      .subscribe(
        (resp) => {
          this.notificationService.success('Uploaded successfully');
          this.originalUser.avatarURL = resp.body?.avatarURL;
          this.currentUserService.updateUserAvatar(this.originalUser.avatarURL);
          this.loading = false;
        },
        () => {
          this.loading = false;
        },
      );
    fromEvent(reader, 'loadstart').subscribe(() => (this.loading = true));
    reader.readAsDataURL(this.imageFile);
  }

  private getUser(): void {
    this.userService.getCurrentUser().subscribe(
      (resp) => {
        if (resp.ok && resp.body != null) {
          this.profileChanges = resp.body;
          this.originalUser = Object.assign({}, resp.body);
          this.passwordChanges.id = this.originalUser.id;
        } else {
          this.notificationService.error('Something went wrong');
        }
      },
      (error) => {
        this.notificationService.error(error);
      },
    );
  }

  public saveNewInfo(): void {
    if (this.profileForm.invalid || !this.isProfileChanged) return;
    this.userService
      .editUserProfile(this.profileChanges)
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((resp) => resp.body != null),
      )
      .subscribe((resp) => {
        this.originalUser = resp.body as ProfileChangesDTO;
        this.profileChanges = Object.assign({}, this.originalUser);
        this.notificationService.success('Profile was successfully updated');
        this.isProfileChanged = false;
      });
  }

  public saveNewPassword(): void {
    if (this.changePassForm.invalid || !this.changePassForm.dirty) {
      return;
    }

    this.userService
      .editPassword(this.passwordChanges)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.changePassForm.reset();
        this.notificationService.success('Password was successfully changed');
      });
  }

  public checkChanged(): void {
    this.isProfileChanged =
      this.profileChanges.avatarURL != this.originalUser.avatarURL ||
      this.profileChanges.name != this.originalUser.name;
  }
}
