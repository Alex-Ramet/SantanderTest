import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environments';
import { ICandidate } from '../features/candidate/models/ICandidate.interface';
import { ICandidateDetail } from '../features/candidate/models/ICandidateDetail.interface';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private apiUrl = environment.apiUrl + '/candidate';

  constructor(private http: HttpClient) {}
  getAll(): Observable<ICandidateDetail[]> {
    console.log('API URL:', this.apiUrl);
    console.log('Page URL + API URL:', window.location.origin + this.apiUrl);

    const timestamp = new Date().getTime();
    const params: HttpParams = new HttpParams();
    params.append('t', timestamp);

    return this.http.get<ICandidateDetail[]>(this.apiUrl, { params }).pipe(
      tap((data) => console.log('Result data:', data)),
      catchError((error) => {
        console.error('Request Error:', error);
        return throwError(() => error);
      }),
    );
  }

  getById(id: number): Observable<ICandidateDetail> {
    return this.http.get<ICandidateDetail>(`${this.apiUrl}/${id}`);
  }

  create(candidate: ICandidate, excel: File): Observable<ICandidateDetail> {
    const formData = new FormData();
    formData.append('name', candidate.name);
    formData.append('surname', candidate.surname);
    formData.append('file', excel);

    return this.http.post<ICandidateDetail>(this.apiUrl, formData);
  }

  update(id: number, candidate: ICandidateDetail): Observable<ICandidateDetail> {
    return this.http.patch<ICandidateDetail>(`${this.apiUrl}/${id}`, candidate);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
