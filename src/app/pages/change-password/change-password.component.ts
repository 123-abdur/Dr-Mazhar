import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/services/api-service.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  
  validateCheck: boolean = false;
  formHeading: string;
  passwordForm: FormGroup;
  doctorList: any;
  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private toastr: ToastrService, private apiService: ApiServiceService) {
    this.passwordForm = this.formBuilder.group({
      id:[0],
      currentPassword: ['', Validators.required],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  get errorCtr() {
    return this.passwordForm.controls;
  }

  ngOnInit(): void {
  }
  submitForm() {
    this.validateCheck = true
    if (!this.passwordForm.valid) {
      return false
    }
    this.spinner.show();
    this.passwordForm.patchValue({
      id:this.apiService.loginUserData?.id
    })
    this.apiService.passwordChange(this.passwordForm.value).subscribe((result: any) => {
      if (result.status) {
        this.toastr.success('Operation Successful');
        this.spinner.hide();
      }
      else {
        this.toastr.error(JSON.stringify(result.message));
        this.spinner.hide();
      }
    }, (err) => {
      this.spinner.hide();
      this.toastr.error('Something went wrong');
    })
  }
  passCheck:boolean = false;
  validate:boolean = true;
  checkPass(){
    if(this.passwordForm.value.password == this.passwordForm.value.confirmPassword){
      this.passCheck = true
      this.validate = true
    } else {
      this.passCheck = false
      this.validate = false
    }

  }

}
