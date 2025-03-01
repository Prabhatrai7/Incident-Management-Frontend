import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface LocationData {
  city: string;
  state: string;
  country: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = 'http://localhost:8080/api/location';

  constructor(private http: HttpClient) { }

  getLocationByPincode(pincode: string): Observable<LocationData | null> {
    return this.http.get<LocationData>(`${this.apiUrl}/pincode/${pincode}`)
      .pipe(
        catchError(() => of(null))
      );
  }
}