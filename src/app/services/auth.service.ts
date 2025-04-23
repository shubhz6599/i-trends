import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

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

  //cart
  getCart(): Observable<any> {
    const token = localStorage.getItem('jwtToken'); // Fetch token from localStorage
    const headers = { Authorization: `Bearer ${token}` }; // Add Authorization header
    return this.http.get(`${this.userbaseUrl}/cart`, { headers });
  }

  // Add product to cart
  addToCart(product: any): Observable<any> {
    const token = localStorage.getItem('jwtToken'); // Fetch token from localStorage
    const headers = { Authorization: `Bearer ${token}` }; // Add Authorization header
    return this.http.post(`${this.userbaseUrl}/cart`, product, { headers });
  }

  // Remove an item from the cart
  removeFromCart(productId: string): Observable<any> {
    const token = localStorage.getItem('jwtToken'); // Fetch token from localStorage
    const headers = { Authorization: `Bearer ${token}` }; // Add Authorization header
    return this.http.delete(`${this.userbaseUrl}/cart`, { headers, body: { productId } });
  }


  // orders
  placeOrder(orderData: { razorpay_order_id: string; paymentId: string }): Observable<any> {
    const token = localStorage.getItem('jwtToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(`${this.userbaseUrl}/order`, orderData, { headers });
  }
  confirmOrder(payload:any): Observable<any> {
    const token = localStorage.getItem('jwtToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(`${this.userbaseUrl}/confirm-order`, payload, { headers });
  }

  // Get all orders for the logged-in user
  getOrdersByUser(): Observable<any> {
    const token = localStorage.getItem('jwtToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(`${this.userbaseUrl}/user-orders`, { headers });
  }

  // Get order details by order ID
  getOrderDetailsById(orderId: string): Observable<any> {
    const token = localStorage.getItem('jwtToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(`${this.userbaseUrl}/${orderId}`, { headers });
  }
  getOrders(): Observable<any> {
    const token = localStorage.getItem('jwtToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(`${this.userbaseUrl}/orders`, { headers });
  }

  trackOrder(orderId: string): Observable<any> {
    const token = localStorage.getItem('jwtToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(`${this.userbaseUrl}/track/${orderId}`, { headers });
  }

  //admin
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // (Optional) Use this to save user after login
  setCurrentUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    localStorage.removeItem('user');
  }

  updateStatus(orderId: string, status: string): Observable<any> {
    const token = localStorage.getItem('jwtToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put(`${this.userbaseUrl}/order-status/${orderId}`, { status }, { headers });
  }

  exportOrders(): void {
    window.open(`${this.userbaseUrl}/export`, '_blank');
  }

  createOrder(orderData: { items: any[]; amount: number }): Observable<any> {
    const token = localStorage.getItem('jwtToken'); // Fetch token from localStorage
    const headers = { Authorization: `Bearer ${token}` }; // Add Authorization header
    return this.http.post(`${this.baseUrl}/create-order`, orderData, { headers });
  }

  // Payment: Verify Payment
  verifyPayment(paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Observable<any> {
    const token = localStorage.getItem('jwtToken'); // Fetch token from localStorage
    const headers = { Authorization: `Bearer ${token}` }; // Add Authorization header
    return this.http.post(`${this.baseUrl}/verify-payment`, paymentData, { headers });
  }
}
