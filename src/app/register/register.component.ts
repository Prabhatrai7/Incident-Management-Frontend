import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  showPassword = false;
  activeTab = 'individual';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private locationService: LocationService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', Validators.required],
      pincode: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      fax: [''],
      phone: [''],
      userType: [this.activeTab]
    });
  }

  ngOnInit(): void {
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.registerForm.patchValue({
      userType: tab
    });
  }

  lookupPincode(): void {
    const pincode = this.registerForm.get('pincode')?.value;
    if (pincode && pincode.length >= 6) {
      this.locationService.getLocationByPincode(pincode).subscribe(
        location => {
          if (location) {
            this.registerForm.patchValue({
              city: location.city,
              state: location.state,
              country: location.country
            });
          }
        },
        error => {
          console.error('Error fetching location data', error);
        }
      );
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.authService.register(this.registerForm.value).subscribe(
      response => {
        this.isSubmitting = false;
        this.router.navigate(['/login'], { 
          queryParams: { registered: 'true' } 
        });
      },
      error => {
        this.isSubmitting = false;
        this.errorMessage = error.error.message || 'Registration failed. Please try again.';
      }
    );
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}