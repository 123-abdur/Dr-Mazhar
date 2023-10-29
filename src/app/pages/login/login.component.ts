import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/services/api-service.service';
//admin@gmail1.com   - 123456
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  validateCheck: boolean = false;
  loginForm: FormGroup;
  constructor(private formBuilder: FormBuilder,private spinner: NgxSpinnerService, private routes: Router,private toastr: ToastrService,private apiService: ApiServiceService) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  get errorCtr() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {
  }

  submitForm() {
    this.validateCheck = true
    if (!this.loginForm.valid) {
      return false
    }
    this.spinner.show();
    this.apiService.login(this.loginForm.value).subscribe((result: any) => {
      if (result.status) {

        localStorage.setItem("userdata", JSON.stringify(result.res));
        this.apiService.loginUserData = result.res
        setTimeout(() => {
          this.toastr.success('Operation Successful');
          if(result.res.role == 'Doctor'){
            this.routes.navigate(['/patient'], { replaceUrl: true });
          } else if(result.res.role == 'Despenser'){
            this.routes.navigate(['/patient'], { replaceUrl: true });
          }else if(result.res.role == 'Receptionist'){
            this.routes.navigate(['/patient-enroll'], { replaceUrl: true });
          }else if(result.res.role == 'Admin'){
            this.routes.navigate(['/user'], { replaceUrl: true });
          }
          this.spinner.hide();
        }, 3000);
       
        
      }
      else {
        this.toastr.error(JSON.stringify(result.message));
        this.spinner.hide()
      }
    }, (err) => {
      this.spinner.hide()
      this.toastr.error('Something went wrong');
    })
  }
    



}
