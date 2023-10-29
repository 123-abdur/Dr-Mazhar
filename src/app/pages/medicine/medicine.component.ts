import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/services/api-service.service';

@Component({
  selector: 'app-medicine',
  templateUrl: './medicine.component.html',
  styleUrls: ['./medicine.component.scss']
})
export class MedicineComponent implements OnInit {

  lengthValidation: string = '';
  showFormCheck: boolean = false;
  validateCheck: boolean = false;
  formHeading: string;
  medicineForm: FormGroup;
  listOfmedi: any = [];
  medTypeList: any;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchText: string = '';

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private toastr: ToastrService, private apiService: ApiServiceService) {
    this.medicineForm = this.formBuilder.group({
      id: [''],
      medicineTypeId: ['', Validators.required],
      medicineName: ['', Validators.required],
      type: ['indoor', Validators.required],
      unitofMeasure: ['', Validators.required],
      active: ['true']
    });
  }

  get errorCtr() {
    return this.medicineForm.controls;
  }

  ngOnInit(): void {
    this.list();
    this.mediTypelist();
  }

  showForm(text: string, userObject) {
    if (text == 'close') {
      this.showFormCheck = false;
      this.medicineForm.reset();
      this.setDefaultValues();
      this.list();
      return;
    }
    this.formHeading = text;
    this.showFormCheck = true;
    this.validateCheck = false;
    if (text == 'Update') {
      if (userObject != null) {
        this.medicineForm.patchValue({
          id: userObject.id,
          medicineTypeId: userObject.medicineTypeId,
          medicineName: userObject.medicineName,
          type: userObject.type,
          unitofMeasure: userObject.unitofMeasure,
          active: userObject.active
        })
      }

    }
  }

  submitForm(text: string) {
    this.validateCheck = true;
    if (!this.medicineForm.valid) {
      return false
    }
    this.spinner.show();
    this.apiService.medicineRegister(this.medicineForm.value, text).subscribe((result: any) => {
      if (result.status) {
        this.toastr.success('Operation Successful');
        this.spinner.hide();
        this.showForm('close', null);
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
    this.apiService.deletemedicineList(id).subscribe((result: any) => {
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
    this.apiService.medicineList().subscribe((result: any) => {
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

  mediTypelist() {
    this.spinner.show();
    this.apiService.mediTypeList().subscribe((result: any) => {
      if (result.status) {
        this.medTypeList = result.res
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
    this.medicineForm.patchValue({
      medicineTypeId: '',
      type: 'indoor'
    })
  }

  changePage(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  filterMedicine() {
    return this.listOfmedi.filter(user => {
      return user.medicineName.toLowerCase().startsWith(this.searchText.toLowerCase());
    });
  }

}
