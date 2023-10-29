import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiServiceService } from '../services/api-service.service';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private apiService: ApiServiceService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the token from your authentication service/storage
    const token = this.apiService.loginUserData?.token;

    // Clone the request and add the token to the Authorization header
    const modifiedRequest = request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });

    // Pass the modified request to the next handler
    return next.handle(modifiedRequest);
  }
}
