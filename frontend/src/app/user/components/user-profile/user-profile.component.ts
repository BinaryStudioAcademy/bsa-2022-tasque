import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fromEvent, Subject } from 'rxjs';
import { NotificationService } from 'src/core/services/notification.service';
import { ValidationConstants } from 'src/entity-models/const-resources/validation-constraints';
import { LocalStorageKeys } from 'src/entity-models/local-storage-keys';
import { PasswordChangesDTO } from '../../dto/password-changes-dto';
import { ProfileChangesDTO } from '../../dto/profile-changes-dto';
import { UserService } from '../../services/user.service';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { filter, mergeMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.sass'],
})
export class UserProfileComponent implements OnInit {
  public imageFile: File;
  public defaultUserAvatarUrl = '../../assets/default_avatar.svg';
  public allowedFileTypes = ['image/png', 'image/jpeg', 'image/gif'];
  public originalUser: ProfileChangesDTO = {} as ProfileChangesDTO;
  public profileChanges: ProfileChangesDTO = {} as ProfileChangesDTO;
  public passwordChanches: PasswordChangesDTO;
  public hidePass = true;
  public hideNewPass = true;
  public profileForm: FormGroup = new FormGroup({});
  public changePassForm: FormGroup = new FormGroup({});
  public userNameControl: FormControl;
  public emailControl: FormControl;
  public prevPasswordControl: FormControl;
  public newPasswordControl: FormControl;
  public unsubscribe$ = new Subject<void>();
  public localStorage = window.localStorage;
  public localStorageKeys = LocalStorageKeys;
  private validationConstants = ValidationConstants;
  public isProfileChanged = false;
  public pencilIcon = faPencil;
  public loading = false;

  constructor(
    private notificationService: NotificationService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.getUser();

    this.passwordChanches = {} as PasswordChangesDTO;
    this.passwordChanches.newPassword = '';
    this.passwordChanches.previousPassword = '';
    this.emailControl = new FormControl(this.profileChanges.email, [
      Validators.email,
      Validators.required,
      Validators.pattern(this.validationConstants.emailRegex),
    ]);
    this.userNameControl = new FormControl(this.profileChanges.email, [
      Validators.required,
      Validators.minLength(this.validationConstants.minLengthName),
    ]);
    this.prevPasswordControl = new FormControl(
      this.passwordChanches.previousPassword,
      [
        Validators.required,
        Validators.minLength(this.validationConstants.minLengthPassword),
      ],
    );
    this.newPasswordControl = new FormControl(
      this.passwordChanches.previousPassword,
      [
        Validators.required,
        Validators.minLength(this.validationConstants.minLengthPassword),
      ],
    );
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
          this.passwordChanches.id = this.originalUser.id;
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
      });
  }

  public saveNewPassword(): void {
    if (this.prevPasswordControl.invalid || this.newPasswordControl.invalid) {
      this.notificationService.error('Password can not be changed');
      return;
    }

    this.userService.editPassword(this.passwordChanches).subscribe(
      (resp) => {
        if (resp.ok && resp.body != null) {
          this.changePassForm.reset();
          this.notificationService.success('Password was successfully changed');
        } else {
          this.notificationService.error('Something went wrong');
        }
      },
      (error) => {
        this.notificationService.error(error);
      },
    );
  }

  public checkChanged(): void {
    this.isProfileChanged =
      this.profileChanges.avatarURL != this.originalUser.avatarURL ||
      this.profileChanges.name != this.originalUser.name;
  }
}
