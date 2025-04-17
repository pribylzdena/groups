import { Component, OnInit } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorizationService, RegisterRequest} from '@app/services/authorization.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgOptimizedImage],
  templateUrl: './register.component.html',
  styleUrl: 'register.component.scss'
})
export class RegisterComponent implements OnInit {
  private formBuilder: FormBuilder;
  private router: Router;
  private authService: AuthorizationService;

  registrationForm!: FormGroup;
  submitted = false;
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  error = '';
  successMessage = '';

  constructor(formBuilder: FormBuilder, router: Router, authService: AuthorizationService) {
    this.formBuilder = formBuilder;
    this.router = router;
    this.authService = authService;
  }

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator.bind(this)
    });
  }

  get f() {
    return this.registrationForm.controls;
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ matching: true });
      return { matching: true };
    } else {
      return null;
    }
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.registrationForm.invalid) {
      return;
    }

    this.isLoading = true;

    console.log('Form submitted successfully', this.registrationForm.value.email);

    const req: RegisterRequest = {
      email: this.registrationForm.value.email,
      name: this.registrationForm.value.email,
      password: this.registrationForm.value.password
    };

    this.authService.register(req).subscribe({
      next: (response) => {
        console.log('Registration successful, server response:', response);
        this.isLoading = false;
        this.successMessage = 'Registrace byla úspěšná';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      },
      error: (err) => {
        console.error('Registration failed:', err);
        console.error('Error details:', err.error);
        console.error('Status code:', err.status);
        this.isLoading = false;
        this.error = err.error?.message || 'Registrace se nezdařila';
      }
    });
  }
}
