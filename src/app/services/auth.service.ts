import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiBaseUrl;
  private userbaseUrl = environment.userbaseUrl;


  constructor(private http: HttpClient) { }

  // Sign Up API
  signUp(data: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, data);
  }
  verifyOtp(data: { email: string; otp: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/verifyOtp`, data);
  }
  resendOtp(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/resendOtp`, data); // Resend OTP endpoint
  }
  // Login API
  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  // Forgot Password API
  forgotPassword(data: { email: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, data);
  }

  // Reset Password API
  resetPassword(data: { token: string, newPassword: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, data);
  }

  getUserDetails(): Observable<any> {
    const token = localStorage.getItem('jwtToken'); // Fetch token from localStorage
    const headers = { Authorization: `Bearer ${token}` }; // Add token to Authorization header
    return this.http.get(`${this.baseUrl}/user`, { headers });
  }

  updateUserDetails(data: any): Observable<any> {
    const token = localStorage.getItem('jwtToken'); // Fetch token from localStorage
    const headers = { Authorization: `Bearer ${token}` }; // Add token to Authorization header
    return this.http.put(`${this.baseUrl}/user`, data, { headers });
  }


  //FeedbackForm
  submitFeedback(data: any): Observable<any> {
    const token = localStorage.getItem('jwtToken'); // Fetch token from localStorage
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(`${this.userbaseUrl}/feedback`, data, { headers });
  }

  // Get feedback
  getMyFeedback(): Observable<any> {
    const token = localStorage.getItem('jwtToken'); // Fetch token from localStorage
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(`${this.userbaseUrl}/feedback`, { headers });
  }
}
