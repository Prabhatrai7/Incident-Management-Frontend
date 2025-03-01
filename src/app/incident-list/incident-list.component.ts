import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Incident } from '../model/incident.model';
import { IncidentService } from '../services/incident.service';
import { AuthService } from '../services/auth.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-incident-list',
  templateUrl: './incident-list.component.html',
  styleUrls: ['./incident-list.component.css']
})
export class IncidentListComponent implements OnInit {
  incidents: Incident[] = [];
  searchForm: FormGroup;
  searchError = '';
  searchResult: Incident | null = null;

  constructor(
    private incidentService: IncidentService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      incidentId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadIncidents();
  }

  loadIncidents(): void {
    this.incidentService.getIncidents().subscribe({
      next: (data) => {
        this.incidents = data;
      },
      error: (error) => {
        console.error('Error loading incidents:', error);
      }
    });
  }

  searchIncident(): void {
    if (this.searchForm.valid) {
      const incidentId = this.searchForm.get('incidentId')?.value;
      this.incidentService.searchIncidentById(incidentId).subscribe({
        next: (incident) => {
          this.searchResult = incident;
          this.searchError = '';
        },
        error: (error) => {
          this.searchError = 'Incident not found';
          this.searchResult = null;
        }
      });
    }
  }

  clearSearch(): void {
    this.searchForm.reset();
    this.searchResult = null;
    this.searchError = '';
  }

  editIncident(incidentId: string) {
    this.router.navigate(['/incidents/edit', incidentId]);
  }

  isIncidentEditable(incident: Incident): boolean {
    return incident.status !== 'Closed';
  }
}