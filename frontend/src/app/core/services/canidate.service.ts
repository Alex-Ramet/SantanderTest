import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { Candidate } from '../features/candidate/candidate';
import { ICandidateDetail } from '../features/candidate/models/ICandidateDetail.interface';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private apiUrl = environment.apiUrl + '/candidate';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ICandidateDetail[]> {
    return this.http.get<ICandidateDetail[]>(this.apiUrl);
  }

  getById(id: number): Observable<ICandidateDetail> {
    return this.http.get<ICandidateDetail>(`${this.apiUrl}/${id}`);
  }

  create(Candidate: Candidate): Observable<ICandidateDetail> {
    return this.http.post<ICandidateDetail>(this.apiUrl, Candidate);
  }

  update(id: number, Candidate: ICandidateDetail): Observable<ICandidateDetail> {
    return this.http.put<ICandidateDetail>(`${this.apiUrl}/${id}`, Candidate);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
