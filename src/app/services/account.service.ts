import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = 'https://your-backend-api.com/account';  // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  getAccountDetails(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  updateAccountDetails(data: any): Observable<any> {
    return this.http.put(this.apiUrl, data);
  }
}
