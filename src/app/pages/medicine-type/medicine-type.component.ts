import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/services/api-service.service';

@Component({
  selector: 'app-medicine-type',
  templateUrl: './medicine-type.component.html',
  styleUrls: ['./medicine-type.component.scss']
})
export class MedicineTypeComponent implements OnInit {

  lengthValidation: string = '';
  showFormCheck: boolean = false;
  validateCheck: boolean = false;
  formHeading: string;
  medicineTypeForm: FormGroup;
  listOfmedi: any = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchText: string = '';

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private toastr: ToastrService, private apiService: ApiServiceService) {
    this.medicineTypeForm = this.formBuilder.group({
      id: [''],
      medicineTypeName: ['', Validators.required],
      active: ['true']
    });
  }

  get errorCtr() {
    return this.medicineTypeForm.controls;
  }

  ngOnInit(): void {
    this.list();
  }

  showForm(text: string, userObject) {
    if (text == 'close') {
      this.showFormCheck = false;
      this.medicineTypeForm.reset();
      this.list();
      return;
    }
    this.formHeading = text;
    this.showFormCheck = true;
    this.validateCheck = false;
    if (text == 'Update') {
      if (userObject != null) {
        this.medicineTypeForm.patchValue({
          id: userObject.id,
          medicineTypeName: userObject.medicineTypeName,
          active: userObject.active
        })
      }

    }
  }

  submitForm(text: string) {
    this.validateCheck = true
    if (!this.medicineTypeForm.valid) {
      return false
    }
    this.spinner.show();
    this.apiService.medTypeRegister(this.medicineTypeForm.value, text).subscribe((result: any) => {
      if (result.status) {
        this.toastr.success('Operation Successful');
        this.showForm('close', null);
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
    this.apiService.deletemedTypeList(id).subscribe((result: any) => {
      if (result.status) {
        this.toastr.success('Operation Successful');
        this.list();
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

  list() {
    this.spinner.show();
    this.apiService.mediTypeList().subscribe((result: any) => {
      if (result.status) {
        this.listOfmedi = result.res
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

  changePage(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  filterMedicine() {
    return this.listOfmedi.filter(user => {
      return user.medicineTypeName.toLowerCase().startsWith(this.searchText.toLowerCase());
    });
  }

}
