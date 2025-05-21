import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { User } from '@app/models/user';
import { UserService } from '@app/services/user.service';
import {isExternalResource} from '@angular/compiler-cli/src/ngtsc/metadata';
import {NgClass, NgIf} from '@angular/common';
import {GlobalNavbarComponent} from '@components/global-navbar/global-navbar.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgClass,
    GlobalNavbarComponent,
    RouterLink
  ],
  standalone: true
})
export class UserDetailComponent implements OnInit {
  private fb: FormBuilder;
  private userService: UserService;

  userForm: FormGroup;
  user: User;
  submitMessage: string = '';
  showMessage: boolean = false;
  isEditing: boolean = false;

  constructor(fb: FormBuilder, userService: UserService) {
    this.fb = fb;
    this.userService = userService;
    this.createForm();
  }

  ngOnInit(): void {
    this.loadUser();
  }

  createForm(): void {
    this.userForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      logoUrl: ['']
    });
  }

  loadUser(): void {
    this.user = this.userService.getFakeUser();
    this.patchForm();
  }

  patchForm(): void {
    this.userForm.patchValue({
      id: this.user.id,
      name: this.user.name,
      email: this.user.email,
      logoUrl: this.user.logoUrl || ''
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;

    if (this.isEditing) {
      this.userForm.enable();
      this.userForm.get('id')?.disable();
    } else {
      this.userForm.disable();
      this.patchForm();
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formValues = this.userForm.getRawValue();

      const updatedUser = new User(
        this.user.id,
        formValues.name,
        formValues.email,
        formValues.logoUrl,
        formValues.password || this.user.password
      );

      console.log('Uživatel k uložení:', updatedUser);

      this.showSuccessMessage();
      this.isEditing = false;
      this.userForm.disable();
    } else {
      this.markFormGroupTouched(this.userForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if ((control as FormGroup).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  showSuccessMessage(): void {
    this.submitMessage = 'Uživatel byl úspěšně uložen!';
    this.showMessage = true;

    setTimeout(() => {
      this.showMessage = false;
    }, 3000);
  }

  get nameControl() { return this.userForm.get('name'); }
  get emailControl() { return this.userForm.get('email'); }
  get passwordControl() { return this.userForm.get('password'); }
  get logoUrlControl() { return this.userForm.get('logoUrl'); }
}
