import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/services/api-service.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  cnciLengthValidation: boolean = false;
  phoneLengthValidation: boolean = false;
  showFormCheck: boolean = false;
  validateCheck: boolean = false;
  formHeading: string;
  userForm: FormGroup;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchText: string = '';
  listOfUser: any = [];

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private toastr: ToastrService, private apiService: ApiServiceService) {
    this.userForm = this.formBuilder.group({
      id: [''],
      userName: ['', Validators.required],
      email: ['', [Validators.required]],
      password: [''],
      gender: ['', Validators.required],
      address: [''],
      role: ['', Validators.required],
      cnic: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
      contactPhone: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
    });
  }

  get errorCtr() {
    return this.userForm.controls;
  }

  ngOnInit(): void {
    this.userList();
  }

  showForm(text: string, userObject) {
    if (text == 'close') {
      this.showFormCheck = false;
      this.userForm.reset();
      this.userList();
      return;
    }
    this.formHeading = text;
    this.showFormCheck = true;
    this.validateCheck = false;
    if (text == 'Add') {
      this.userForm.get('password').setValidators([Validators.required]);
      this.setDefaultValues();
    }
    if (text == 'Update') {
      this.userForm.get('password').setValidators([]);
      if (userObject != null) {
        this.userForm.patchValue({
          id: userObject.id,
          userName: userObject.userName,
          email: userObject.email,
          password: userObject.password,
          gender: userObject.gender,
          address: userObject.address,
          role: userObject.role,
          cnic: userObject.cnic,
          contactPhone: userObject.contactPhone
        })
      }
    }
  }

  submitForm(text: string) {
    this.validateCheck = true
    if (!this.userForm.valid) {
      return false
    }
    this.spinner.show();
    this.apiService.userRegister(this.userForm.value, text).subscribe((result: any) => {
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

  userList() {
    this.spinner.show();
    this.apiService.userList().subscribe((result: any) => {
      if (result.status) {
        this.listOfUser = result.res
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

  delete(id) {
    this.spinner.show();
    this.apiService.deleteUser(id).subscribe((result: any) => {
      if (result.status) {
        this.toastr.success('Operation Successful');
        this.userList();
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

  setDefaultValues() {
    this.userForm.patchValue({
      gender: '',
      role: ''
    })
  }

  changePage(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  filterUser() {
    return this.listOfUser.filter(user => {
      return user.userName.toLowerCase().startsWith(this.searchText.toLowerCase());
    });
  }

}
