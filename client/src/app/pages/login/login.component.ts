import { Component, OnInit } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import {AuthorizationService, LoginRequest} from '@app/services/authorization.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgOptimizedImage],
  templateUrl: './login.component.html',
  styleUrl: 'login.component.scss'
})
export class LoginComponent implements OnInit {
  private formBuilder: FormBuilder;
  private router: Router;
  private authService: AuthorizationService;

  loginForm!: FormGroup;
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
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirm') {
      this.showPassword = !this.showPassword;
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;

    console.log('Form submitted successfully', this.loginForm.value);

    const req: LoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(req).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Přihlášení bylo úspěšné';

        setTimeout(() => {
            this.router.navigate(['/group-manage']);
          }, 1000);
      },
      error: (err) => {
        console.error('Registration failed:', err);
        console.error('Error details:', err.error);
        console.error('Status code:', err.status);
        this.isLoading = false;
        this.error = err.error?.message || 'Přihlášení se nezdařilo';
      }
    });
  }
}
