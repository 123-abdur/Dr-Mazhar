import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/services/api-service.service';

@Component({
  selector: 'app-medicine-dosage',
  templateUrl: './medicine-dosage.component.html',
  styleUrls: ['./medicine-dosage.component.scss']
})
export class MedicineDosageComponent implements OnInit {

  lengthValidation: string = '';
  showFormCheck: boolean = false;
  validateCheck: boolean = false;
  formHeading: string;
  medicineDosageForm: FormGroup;
  medTypeList: any;
  mediList: any;
  listOfDosagemedi: any = [];
  unitForMedi: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchText: string = '';

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private toastr: ToastrService, private apiService: ApiServiceService) {
    this.medicineDosageForm = this.formBuilder.group({
      id: [''],
      medicineTypeId: ['', Validators.required],
      medicineId: ['', Validators.required],
      DosageMedicine: this.formBuilder.array([])
    });
  }

  get DosageMedicine(): FormArray {
    return this.medicineDosageForm.get('DosageMedicine') as FormArray;
  }

  addDosage() {
    const dosageGroup = this.formBuilder.group({
      id: [''],
      weight: ['', Validators.required],
      dosage: ['', Validators.required]
    });
    this.DosageMedicine.push(dosageGroup);
  }

  removeDosage(index: number) {
    this.DosageMedicine.removeAt(index);
  }

  get errorCtr() {
    return this.medicineDosageForm.controls;
  }

  ngOnInit(): void {
    this.list();
    this.mediTypelist();
  }

  showForm(text: string, userObject) {
    if (text == 'close') {
      this.showFormCheck = false;
      this.DosageMedicine.clear
      this.medicineDosageForm.reset();
      this.setDefaultValues();
      this.list();
      this.DosageMedicine.clear();
      return;
    }
    this.formHeading = text;
    this.showFormCheck = true;
    this.validateCheck = false;
    if (text == 'Add') {
      this.addDosage();
    }
    if (text == 'Update') {
      if (userObject != null) {
        this.medicineList(userObject.medicineTypeId);
        this.medicineDosageForm.patchValue({
          id: userObject.id,
          medicineTypeId: userObject.medicineTypeId,
          medicineId: userObject.medicineId
        })
        for (const dosage of userObject.DosageMedicine) {
          const dosageGroup = this.formBuilder.group(dosage);
          this.DosageMedicine.push(dosageGroup);
        }
      }
    }
  }

  submitForm(text: string) {
    this.validateCheck = true;
    if (!this.medicineDosageForm.valid) {
      return false
    }
    this.spinner.show();
    this.apiService.medicineDosageRegister(this.medicineDosageForm.value, text).subscribe((result: any) => {
      if (result.status) {
        this.toastr.success('Operation Successful');
        this.spinner.hide();
        this.showForm('close', null)
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
    this.apiService.medicineDosageList().subscribe((result: any) => {
      if (result.status) {
        this.listOfDosagemedi = result.res
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

  callMedicineList() {
    this.medicineList(this.medicineDosageForm.value.medicineTypeId)
  }

  unit(selectedValue: string) {
    const selectedMedicine = this.mediList.find(medicine => medicine.id === parseInt(selectedValue));
    if (selectedMedicine) {
      this.unitForMedi = selectedMedicine.unitofMeasure;
    }
    this.spinner.show();
    this.apiService.DosageIFExistList(this.medicineDosageForm.value.medicineTypeId, this.medicineDosageForm.value.medicineId).subscribe((result: any) => {
      if (result.status) {
        this.toastr.success('Operation Successful');
        this.spinner.hide();
        if (result.res.dosageMedicine && result.res.dosageMedicine.length > 0) {
          this.medicineDosageForm.patchValue({
            id: result.res.id
          })
          const length = this.DosageMedicine.length;
          for (let i = length - 1; i >= 0; i--) {
            this.DosageMedicine.removeAt(i);
          }
          for (const dosage of result.res.dosageMedicine) {
            const dosageGroup = this.formBuilder.group(dosage);
            this.DosageMedicine.push(dosageGroup);
          }
          this.formHeading = 'Update';
        }
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

  medicineList(id) {
    this.spinner.show();
    this.apiService.medicineListByType(id).subscribe((result: any) => {
      if (result.status) {

        this.mediList = result.res
        setTimeout(() => {
          this.medicineDosageForm.patchValue({
            medicineId: this.medicineDosageForm.value.medicineId
          })
        }, 100);
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
    this.medicineDosageForm.patchValue({
      medicineTypeId: '',
      medicineId: ''
    })
  }

  delete(id) {
    this.spinner.show();
    this.apiService.deletemedicineDosage(id).subscribe((result: any) => {
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

  changePage(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  filterMedicine() {
    return this.listOfDosagemedi.filter(user => {
      return user.medicineTypeName.toLowerCase().startsWith(this.searchText.toLowerCase()) || user.medicineName.toLowerCase().startsWith(this.searchText.toLowerCase());
    });
  }

}
