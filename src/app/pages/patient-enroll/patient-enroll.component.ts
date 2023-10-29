import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/services/api-service.service';

@Component({
  selector: 'app-patient-enroll',
  templateUrl: './patient-enroll.component.html',
  styleUrls: ['./patient-enroll.component.scss']
})
export class PatientEnrollComponent implements OnInit {

  cnciLengthValidation: boolean = false;
  phoneLengthValidation: boolean = false;
  showFormCheck: boolean = false;
  validateCheck: boolean = false;
  dueAmount: boolean = false;
  formHeading: string;
  enrollPatient: FormGroup;
  doctorList: any;
  sitPatient: FormGroup;
  role: any = this.apiService.loginUserData?.role;
  printCheck: boolean = false;
  tokenNo: any = [];
  isEditMode : boolean = false;
  options:any = [];
  selectedId: string = '';
  selectedMobile: string = '';
  disableField: boolean = false;

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private toastr: ToastrService, private apiService: ApiServiceService, private route: Router,private router: ActivatedRoute) {
    this.enrollPatient = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      guardian: ['', [Validators.required]],
      weight: ['', [Validators.required]],
      gender: ['', Validators.required],
      address: [''],
      age: ['', Validators.required],
      cnic: ['', [Validators.minLength(13), Validators.maxLength(13)]],
      mobile: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      DoctorId: ['', Validators.required],
      bP: [''],
      temperature: [''],
     // remainingAmount: ['0']
    });

    this.sitPatient = this.formBuilder.group({
      id: ['1'],
      inSitPatient: ['']
    });
  }

  get errorCtr() {
    return this.enrollPatient.controls;
  }

  ngOnInit(): void {
    this.DoctorList();
    this.isEditMode = false;
    if (this.route.url.includes('/edit')) {
    this.isEditMode = true;
    var id = 0
    this.router.params.subscribe(params => {
      id = params.id;
      this.getpatient(id)
    });
  } else {
    this.openModal();
  }
  }

  getpatient(id) {
    this.apiService.getPatient(id).subscribe((result: any) => {
      if (result.status) {
        console.log('result',result)
        this.toastr.success('Operation Successful');
        this.spinner.hide();
        this.enrollPatient.patchValue({
          id: result.res.id,
          name: result.res.name,
          guardian: result.res.guardian,
          weight: result.res.weight,
          gender: result.res.gender,
          address: result.res.address,
          age: result.res.age,
          cnic: result.res.cnic,
          mobile: result.res.mobile,
          DoctorId:result.res.DoctorId,
          bP: result.res.bP,
          temperature: result.res.temperature
         })

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

  resetForm() {
    this.tokenNo = [];
    this.dueAmount = false;
    this.enrollPatient.reset();
    this.setDefaultValues();
    this.printCheck = false
    this.validateCheck = false
    this.openModal();
  }

  submitForm(text: string) {
    this.validateCheck = true
    if (!this.enrollPatient.valid) {
      return false
    }
    this.spinner.show();
    this.apiService.enrollPatient(this.enrollPatient.value).subscribe(
      (result: any) => {
        if (result.status) {
          this.tokenNo = result.res.TokenNo.split('_');
          this.toastr.success('Operation Successful');
          this.spinner.hide();
          if (this.role == 'Doctor') {
            this.route.navigate(['patient/' + result.res.PatientId]);
          }
          // setTimeout(() => {
          //   this.triggerPrint();
          // }, 100);

          this.printCheck = true;
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

  public triggerPrint(): void {
    var b = document.getElementById('myPButton')
    b.click();
  }

  DoctorList() {
    this.spinner.show();
    this.apiService.doctorList().subscribe((result: any) => {
      if (result.status) {
        this.doctorList = result.res
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

  modalOpen: boolean = false;

  openModal() {
    this.modalOpen = true;
    this.options = [];
  }

  closeModal() {
    this.modalOpen = false;
  }

  setDefaultValues() {
    this.enrollPatient.patchValue({
      gender: '',
      doctorId: ''
    })
  }

  /*populateValue() {
    this.spinner.show();
    if (this.enrollPatient.value.mobile != '') {
      this.apiService.populateEnrollForm(this.enrollPatient.value.mobile).subscribe((result: any) => {
        if (result.status) {
          if(result.res != null){
          this.enrollPatient.patchValue({
            name: result.res.name,
            guardian: result.res.guardian,
            weight: result.res.weight,
            gender: result.res.gender,
            address: result.res.address,
            age: result.res.age,
            cnic: result.res.cnic,
            DoctorId:result.res.DoctorId,
            bP: result.res.bP,
            temperature: result.res.temperature
           })
          } else {
            this.toastr.error("No Record Found");
          }
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
    } else {
      this.toastr.error('Please Enter Phone Number');
    }
  }*/

  updateInsitPatient() {
    this.spinner.show();
    this.apiService.sitPatient(this.sitPatient.value).subscribe(
      (result: any) => {
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


  updateForm() {
    this.validateCheck = true
    if (!this.enrollPatient.valid) {
      return false
    }
    this.spinner.show();
    this.apiService.RecUpdatePatient(this.enrollPatient.value).subscribe((result: any) => {
      if (result.status) {
        this.toastr.success('Operation Successful');
        this.spinner.hide();
        this.route.navigate(['/rec-patient-list'], { replaceUrl: true });
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



  getExistPatient() {
    this.spinner.show();
    if (this.selectedMobile != '') {
      this.apiService.getExistPatient(this.selectedMobile).subscribe((result: any) => {
        if (result.status) {
          if(result.res != null){
          this.options = result.res
          } else {
            this.toastr.error("No Record Found");
          }
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
    } else {
      this.toastr.error('Please Enter Phone Number');
    }
  }

  populateExistPatient(){
    if(this.selectedId){
      this.getpatient(this.selectedId);
      this.disableField = true;
    } else{
      this.toastr.error('Please select patient');
    }
    this.closeModal();
  }

  enrollNew(){
    this.disableField = false;
    this.closeModal();
  }
}
