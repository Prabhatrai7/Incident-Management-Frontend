import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Incident } from '../model/incident.model';
import { IncidentService } from '../services/incident.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-incident-form',
  templateUrl: './incident-form.component.html',
  styleUrls: ['./incident-form.component.css']
})
export class IncidentFormComponent implements OnInit {
  incidentForm: FormGroup;
  isEditMode = false;
  incidentId: string | null = null;
  currentIncident: Incident | null = null;
  errorMessage = '';
  priorities = ['High', 'Medium', 'Low'];
  statuses = ['Open', 'In progress', 'Closed'];
  userTypes = ['Individual', 'Enterprise', 'Government'];

  constructor(
    private fb: FormBuilder,
    private incidentService: IncidentService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.incidentForm = this.fb.group({
      userType: ['Individual', Validators.required],
      details: ['', Validators.required],
      priority: ['Medium', Validators.required],
      status: [{value: 'Open', disabled: false}, Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.incidentId = params.get('id');
      if (this.incidentId) {
        this.isEditMode = true;
        this.loadIncident(this.incidentId);
      } else {
        // Set default values for new incident
        const currentUser = this.authService.currentUserValue;
        if (currentUser) {
          this.incidentForm.patchValue({
            userType: currentUser.userType
          });
        }
      }
    });
  }

  loadIncident(id: string): void {
    this.incidentService.getIncidentById(id).subscribe({
      next: (incident) => {
        this.currentIncident = incident;
        this.incidentForm.patchValue({
          userType: incident.userType,
          details: incident.details,
          priority: incident.priority,
          status: incident.status
        });
        
        // Disable form if incident is closed
        if (incident.status === 'Closed') {
          this.incidentForm.disable();
        }
      },
      error: (error) => {
        this.errorMessage = 'Failed to load incident details.';
        console.error('Error loading incident:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.incidentForm.valid) {
      const currentUser = this.authService.currentUserValue;
      if (!currentUser) {
        this.router.navigate(['/login']);
        return;
      }

      const incidentData: Partial<Incident> = {
        ...this.incidentForm.value,
        reporterName: `${currentUser.firstName} ${currentUser.lastName}`,
        reporterUserId: currentUser.id
      };

      if (this.isEditMode && this.incidentId && this.currentIncident) {
        // Update existing incident
        this.incidentService.updateIncident(this.incidentId, {
          ...this.currentIncident,
          ...incidentData
        }).subscribe({
          next: () => {
            this.router.navigate(['/incidents']);
          },
          error: (error) => {
            this.errorMessage = error.error.message || 'Failed to update incident.';
          }
        });
      } else {
        // Create new incident
        this.incidentService.createIncident(incidentData as Incident).subscribe({
          next: () => {
            this.router.navigate(['/incidents']);
          },
          error: (error) => {
            this.errorMessage = error.error.message || 'Failed to create incident.';
          }
        });
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/incidents']);
  }
}