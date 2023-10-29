import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/services/api-service.service';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss']
})
export class PatientFormComponent implements OnInit {

  cnciLengthValidation: boolean = false;
  phoneLengthValidation: boolean = false;
  showFormCheck: boolean = false;
  validateCheck: boolean = false;
  formHeading: string;
  enrollPatient: FormGroup;
  medTypeList: any = [];
  mediList: any = [];
  allMedicineType: any = [];
  allMedicine: any = [];
  allDosage: any = [];
  role: any = this.apiService.loginUserData?.role;
  listOfUser: any;
  internalmedi: any = []
  patienHistory: any = [];
  historyCheck: boolean = false;
  printCheck: boolean = false;
  dosageList: any = [];
  medicineTypeID: any;
  currentDate: Date = new Date();
  @ViewChild('textArea1') textArea1: ElementRef;
  selectionList: string[] = ['hourly', 'ہر 6 گھنٹے کے بعد', 'روزانہ ایک', 'صبح ناشتے سے 30 منٹ پہلے', 'کھانے سے 30 منٹ پہلے', 'صرف قبض میں', 'پونا کھانے کا چمچ', 'کھانے کا چمچ', 'صرف الٹی میں', 'چائے کا چمچ', 'قطرے روزانہ ', 'روزانہ صبح', 'روزانہ رات', 'رات سونے کے وقت', '4 کھانے کے چمچ رات کو', 'صبح-شام', 'صبح-دوپہر-رات'];
  outdoorMedicineList: string[] = ['nebulize with Ventoline solution-  drops', 'nebulize with Atem nebule-  drops', 'nebulize with clenil for abasol-  drops', 'nebulize with normal saline 2ml'];
  constructor(private route: ActivatedRoute, private router: Router,
    private renderer: Renderer2, private el: ElementRef,
    private formBuilder: FormBuilder, private spinner: NgxSpinnerService,
    private toastr: ToastrService, private apiService: ApiServiceService) {
    this.enrollPatient = this.formBuilder.group({
      id: [''],
      name: [''],
      guardian: [''],
      weight: [''],
      gender: [''],
      doctorName: [''],
      tokenNo: [''],
      address: [''],
      age: [''],
      cnic: [''],
      mobile: [''],
      outdoor: [''],
      symptoms: [''],
      diagnosis: [''],
      advised: [''],
      totalAmount: ['', [Validators.required]],
      isTakeIM: [false],
      bP: [''],
      temperature: [''],
      remainingAmount: ['0'],
      dueAmount: ['0'],
      receivingAmount: ['0'],
      ischecked: [false],
      isPharmacy: [false],
      template: ['simple'],
      printIndoor: ['outdoor'],
      historyId: [0],
      patient_internal_medicine: this.formBuilder.array([])
    });
  }

  get DosageMedicine(): FormArray {
    return this.enrollPatient.get('patient_internal_medicine') as FormArray;
  }

  addDosage() {
    const dosageGroup = this.formBuilder.group({
      id: [''],
      medicineTypeId: ['', Validators.required],
      medicineId: ['', Validators.required],
      dosageId: [''],
      dosage: [''],
      time: ['', Validators.required],
      isDropdown: [false],
      isdosageDropDown: [false],
      unit: [''],
      mediList: [[]],
      dosageList: [[]]
    });
    this.DosageMedicine.push(dosageGroup);
  }

  removeDosage(index: number) {
    this.DosageMedicine.removeAt(index);
  }

  get errorCtr() {
    return this.enrollPatient.controls;
  }

  ngOnInit(): void {
    var id = 0
    //this.mediTypelist();
    this.getAllMedicineList();
    this.route.params.subscribe(params => {
      id = params.id;
      this.getpatient(id);
      window.scrollTo(0, 0);
    });
    this.addDosage();

  }


  toggleInputField(dosageGroup: FormGroup) {
    const timeControl = dosageGroup.get('time');
    if (timeControl) {
      const currentValue = timeControl.value;
      if (currentValue === 'Add') {
        dosageGroup.get('isDropdown').setValue(true);
      } else {
        // Set isDropdown to true to show the dropdown
        // dosageGroup.get('isDropdown').setValue(false);
      }
    }
  }

  toggleDInputField(dosageGroup: FormGroup) {
    const timeControl = dosageGroup.get('dosageId');
    if (timeControl) {
      const currentValue = timeControl.value;
      if (currentValue === 'addMore') {
        dosageGroup.get('isdosageDropDown').setValue(true);
        dosageGroup.get('dosageId').setValue(null);
      } else {
        // Set isDropdown to true to show the dropdown
        // dosageGroup.get('isDropdown').setValue(false);
      }
    }
  }

  getpatient(id) {
    this.apiService.getPatient(id).subscribe((result: any) => {
      if (result.status) {
        this.toastr.success('Operation Successful');
        this.spinner.hide();
        if (this.role == 'Doctor') {
          this.apiService.updateData(result.res.tokenNo);
        }
        this.enrollPatient.patchValue({
          id: result.res.id,
          name: result.res.name,
          guardian: result.res.guardian,
          weight: result.res.weight,
          gender: result.res.gender,
          tokenNo: result.res.tokenNo,
          address: result.res.address,
          age: result.res.age,
          cnic: result.res.cnic,
          mobile: result.res.mobile,
          outdoor: result.res.outdoor == null ? '' : result.res.outdoor,
          symptoms: result.res.symptoms == null ? '' : result.res.symptoms,
          diagnosis: result.res.diagnosis == null ? '' : result.res.diagnosis,
          advised: result.res.advised == null ? '' : result.res.advised,
          doctorName: result.res.doctorName,
          totalAmount: result.res.totalAmount,
          bP: result.res.bP,
          temperature: result.res.temperature,
          isPharmacy: result.res.isPharmacy,
          remainingAmount: result.res.remainingAmount,
          dueAmount: result.res.dueAmount == null ? '0' : result.res.dueAmount,
          receivingAmount: result.res.receivingAmount == null ? '0' : result.res.receivingAmount,
        })
        this.checkHistory();
        if (result.res.patient_internal_medicine && result.res.patient_internal_medicine.length > 0) {
          this.internalmedi = result.res.patient_internal_medicine;
          //this.patchFormArrayValues(result.res.patient_internal_medicine);
           this.patchFormArrayValuesLocally(result.res.patient_internal_medicine);
        } else{
        /* static work */
       /* if (this.enrollPatient.value.temperature == 99 || this.enrollPatient.value.temperature == 100 || this.enrollPatient.value.temperature == 101 || this.enrollPatient.value.temperature == 102 || this.enrollPatient.value.temperature == 103 || this.enrollPatient.value.temperature == 104 || this.enrollPatient.value.temperature == 105) {
          const formArray = this.DosageMedicine;
          while (formArray.length !== 0) {
            formArray.removeAt(0);
          }
          const foundObject = this.medTypeList.find(item => item.medicineTypeName === 'Syp.');
          if (this.enrollPatient.value.weight >= 2 && this.enrollPatient.value.weight <= 10) {
            this.addDosage();
            const control = formArray.at(0);
            control.get('medicineTypeId').patchValue(foundObject.id);
            this.medicineList(foundObject.id, control, '0')
            if (this.enrollPatient.value.temperature == 99 || this.enrollPatient.value.temperature == 100 || this.enrollPatient.value.temperature == 101) {
              control.get('time').patchValue(3);
            } else {
              control.get('time').patchValue(4);
            }
          }



          if (this.enrollPatient.value.weight >= 10 && this.enrollPatient.value.weight <= 35) {
            this.addDosage();
            const control1 = formArray.at(0);
            control1.get('medicineTypeId').patchValue(foundObject.id);
            this.medicineList(foundObject.id, control1, '1')
            if (this.enrollPatient.value.temperature == 99 || this.enrollPatient.value.temperature == 100 || this.enrollPatient.value.temperature == 101) {
              control1.get('time').patchValue(3);
            } else {
              control1.get('time').patchValue(4);
            }
          }
          if (this.enrollPatient.value.weight >= 2 && this.enrollPatient.value.weight <= 35) {
            this.addDosage();
            const control2 = formArray.at(1);
            control2.get('medicineTypeId').patchValue(foundObject.id);
            this.medicineList(foundObject.id, control2, '2')
            if (this.enrollPatient.value.temperature == 99 || this.enrollPatient.value.temperature == 100 || this.enrollPatient.value.temperature == 101) {
              control2.get('time').patchValue(3);
            } else {
              control2.get('time').patchValue(4);
            }
          }

          if (this.enrollPatient.value.weight >= 2 && this.enrollPatient.value.weight <= 35) {
            this.addDosage();
            const control3 = formArray.at(2);
            control3.get('medicineTypeId').patchValue(foundObject.id);
            this.medicineList(foundObject.id, control3, '3')
            control3.get('time').patchValue(3);

          }
        }*/




        //#region new static work

        if (this.enrollPatient.value.temperature == 99 || this.enrollPatient.value.temperature == 100 || this.enrollPatient.value.temperature == 101 || this.enrollPatient.value.temperature == 102 || this.enrollPatient.value.temperature == 103 || this.enrollPatient.value.temperature == 104 || this.enrollPatient.value.temperature == 105) {
          const formArray = this.DosageMedicine;
          while (formArray.length !== 0) {
            formArray.removeAt(0);
          }
          const foundObject = this.allMedicineType.find(item => item.medicineTypeName === 'Syp.');
          if (this.enrollPatient.value.weight >= 2 && this.enrollPatient.value.weight <= 10) {
            this.addDosage();
            const control = formArray.at(0);
            control.get('medicineTypeId').patchValue(foundObject.id);
            let medicineList = this.getMedicineById(foundObject.id)
            control.get('mediList').setValue(medicineList);
            const foundObject1 = this.DosageMedicine.at(0).get('mediList').value.find(item => item.medicineName === 'PCM');
            control.get('unit').patchValue(foundObject1.unitofMeasure);
            control.get('medicineId').patchValue(foundObject1.id);
            let dosageList = this.getDosageById(foundObject.id,foundObject1.id,this.enrollPatient.value.weight)
            control.get('dosageList').setValue(dosageList);
            control.get('dosageId').setValue(dosageList[0]?.id ? dosageList[0]?.id : '');
            if (this.enrollPatient.value.temperature == 99 || this.enrollPatient.value.temperature == 100 || this.enrollPatient.value.temperature == 101) {
              control.get('time').patchValue(3);
            } else {
              control.get('time').patchValue(4);
            }
          }
          if (this.enrollPatient.value.weight >= 10 && this.enrollPatient.value.weight <= 35) {
            this.addDosage();
            const control1 = formArray.at(0);
            control1.get('medicineTypeId').patchValue(foundObject.id);
            let medicineList = this.getMedicineById(foundObject.id);
            control1.get('mediList').setValue(medicineList);
            const foundObject1 = this.DosageMedicine.at(0).get('mediList').value.find(item => item.medicineName === 'PCM 1 Fast');
            control1.get('unit').patchValue(foundObject1.unitofMeasure);
            control1.get('medicineId').patchValue(foundObject1.id);
            let dosageList = this.getDosageById(foundObject.id,foundObject1.id,this.enrollPatient.value.weight)
            control1.get('dosageList').setValue(dosageList);
            control1.get('dosageId').setValue(dosageList[0]?.id ? dosageList[0]?.id : '');
            if (this.enrollPatient.value.temperature == 99 || this.enrollPatient.value.temperature == 100 || this.enrollPatient.value.temperature == 101) {
              control1.get('time').patchValue(3);
            } else {
              control1.get('time').patchValue(4);
            }
          }
          if (this.enrollPatient.value.weight >= 2 && this.enrollPatient.value.weight <= 35) {
            this.addDosage();
            const control2 = formArray.at(1);
            control2.get('medicineTypeId').patchValue(foundObject.id);
            let medicineList = this.getMedicineById(foundObject.id);
            control2.get('mediList').setValue(medicineList);
            const foundObject1 = this.DosageMedicine.at(0).get('mediList').value.find(item => item.medicineName === 'Brufen');
            control2.get('unit').patchValue(foundObject1.unitofMeasure);
            control2.get('medicineId').patchValue(foundObject1.id);
            let dosageList = this.getDosageById(foundObject.id,foundObject1.id,this.enrollPatient.value.weight)
            control2.get('dosageList').setValue(dosageList);
            control2.get('dosageId').setValue(dosageList[0]?.id ? dosageList[0]?.id : '');
            if (this.enrollPatient.value.temperature == 99 || this.enrollPatient.value.temperature == 100 || this.enrollPatient.value.temperature == 101) {
              control2.get('time').patchValue(3);
            } else {
              control2.get('time').patchValue(4);
            }
          }

          if (this.enrollPatient.value.weight >= 2 && this.enrollPatient.value.weight <= 35) {
            this.addDosage();
            const control3 = formArray.at(2);
            control3.get('medicineTypeId').patchValue(foundObject.id);
            let medicineList = this.getMedicineById(foundObject.id);
            control3.get('mediList').setValue(medicineList);
            const foundObject1 = this.DosageMedicine.at(0).get('mediList').value.find(item => item.medicineName === 'CPM (Del)');
            control3.get('unit').patchValue(foundObject1.unitofMeasure);
            control3.get('medicineId').patchValue(foundObject1.id);
            let dosageList = this.getDosageById(foundObject.id,foundObject1.id,this.enrollPatient.value.weight)
            control3.get('dosageList').setValue(dosageList);
            control3.get('dosageId').setValue(dosageList[0]?.id ? dosageList[0]?.id : '');
            control3.get('time').patchValue(3);

          }
        }

        //#endregion
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

  populate() {
    if (this.enrollPatient.value.historyId > 0) {
      this.apiService.getPatient(this.enrollPatient.value.historyId).subscribe((result: any) => {
        if (result.status) {
          this.toastr.success('Operation Successful');
          this.spinner.hide();
          this.enrollPatient.patchValue({
            outdoor: result.res.outdoor == null ? '' : result.res.outdoor
          })
          if (result.res.patient_internal_medicine && result.res.patient_internal_medicine.length > 0) {
            this.internalmedi = result.res.patient_internal_medicine;
            this.patchFormArrayValuesLocally(result.res.patient_internal_medicine);

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
    } else {
      this.toastr.error('Please any radio button from history');
    }
  }

  /*patchFormArrayValues(data: any[]) {
    const formArray = this.DosageMedicine;
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
    data.forEach((item, index) => {
      var dosageBool = false;
      var timeBool = false;
      if (item.dosage != 0 && item.dosage != null) {
        dosageBool = true;
      }
      if (item.time > 4) {
        timeBool = true;
      }
      this.addDosage()
      this.callMedicineListForPatch(item, index, 'edit');
      const control = formArray.at(index);
      control.get('time').patchValue(item.time);
      control.get('dosage').patchValue(item.dosage);
      control.get('isDropdown').patchValue(timeBool);
      control.get('isdosageDropDown').patchValue(dosageBool);
    });
  }*/

  print(): void {
    this.printCheck = true;
    setTimeout(() => {
      window.print();
      if (!this.enrollPatient.value.isPharmacy) {
        this.submitPharmacyForm();
      } else {
        this.printCheck = false;
      }
    }, 2000);
  }

  showHistory() {
    this.apiService.getHistory(this.enrollPatient.value.mobile, this.enrollPatient.value.name).subscribe((result: any) => {
      if (result.status) {
        this.patienHistory = result.res;
        this.historyCheck = true;
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

  submitForm() {
    this.validateCheck = true
    if (!this.enrollPatient.valid) {
      return false
    }
    this.spinner.show();
    this.apiService.UpdatePatient(this.enrollPatient.value).subscribe((result: any) => {
      if (result.status) {
        this.toastr.success('Operation Successful');
        this.spinner.hide();
        this.router.navigate(['/patient'], { replaceUrl: true });
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

  submitPharmacyForm() {
    if (this.enrollPatient.value.ischecked) {
      this.enrollPatient.value.receivingAmount = parseInt(this.enrollPatient.value.receivingAmount) + parseInt(this.enrollPatient.value.remainingAmount);
    } else {
      this.enrollPatient.value.dueAmount = parseInt(this.enrollPatient.value.dueAmount) + parseInt(this.enrollPatient.value.remainingAmount);
    }
    this.spinner.show();
    this.apiService.UpdatePatientPharmacy(this.enrollPatient.value).subscribe((result: any) => {
      if (result.status) {
        this.toastr.success('Operation Successful');
        this.spinner.hide();
        this.printCheck = false;
        this.router.navigate(['/patient'], { replaceUrl: true });
      }
      else {
        this.toastr.error(JSON.stringify(result.message));
        this.spinner.hide();
        this.printCheck = false;
      }
    }, (err) => {
      this.spinner.hide();
      this.toastr.error('Something went wrong');
      this.printCheck = false;
    })
  }

 /* mediTypelist() {
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



  callMedicineList(event, index) {
    const newValue = event.target.value;
    const control = this.DosageMedicine.at(index);
    control.get('medicineTypeId').setValue(newValue);
    this.medicineList(newValue, control);
  }

  callMedicineListForPatch(event, index, val = '') {
    const newValue = event;
    const control = this.DosageMedicine.at(index);
    let id = 0;
    if (val == 'edit') {
      id = newValue.medicineTypeId
    } else {
      id = newValue
    }
    control.get('medicineTypeId').setValue(id);
    this.medicineList(newValue, control, val, index);
  }

  medicineList(id, control, val = '', index = 0) {
    this.spinner.show();
    let typeId = 0;
    if (val == 'edit') {
      typeId = id.medicineTypeId
    } else {
      typeId = id
    }
    this.apiService.medicineListByType(typeId).subscribe((result: any) => {
      if (result.status) {

        control.get('mediList').setValue(result.res);
        control.get('medicineId').enable();
        let id1;
        if (val == 'edit') {
          id1 = id.medicineId
        } else {
          id1 = '';
        }
        control.get('medicineId').setValue(id1);
        if (val == 'edit') {
          this.callDosageList(id, index, val)
        }
         //#region static work 
        if (this.enrollPatient.value.temperature == 99 || this.enrollPatient.value.temperature == 100 || this.enrollPatient.value.temperature == 101 || this.enrollPatient.value.temperature == 102 || this.enrollPatient.value.temperature == 103 || this.enrollPatient.value.temperature == 104 || this.enrollPatient.value.temperature == 105) {
          if (val == '0') {
            const foundObject1 = this.DosageMedicine.at(0).get('mediList').value.find(item => item.medicineName === 'PCM');
            control.get('unit').patchValue(foundObject1.unitofMeasure);
            control.get('medicineId').patchValue(foundObject1.id);
            this.DosageList(foundObject1.id, control);
          }
          if (val == '1') {
            const foundObject2 = this.DosageMedicine.at(0).get('mediList').value.find(item => item.medicineName === 'PCM 1 Fast');
            control.get('medicineId').patchValue(foundObject2.id);
            control.get('unit').patchValue(foundObject2.unitofMeasure);
            this.DosageList(foundObject2.id, control);
          }
          if (val == '2') {
            const foundObject3 = this.DosageMedicine.at(1).get('mediList').value.find(item => item.medicineName === 'Brufen');
            control.get('unit').patchValue(foundObject3.unitofMeasure);
            control.get('medicineId').patchValue(foundObject3.id);
            this.DosageList(foundObject3.id, control);
          }

          if (val == '3') {
            const foundObject4 = this.DosageMedicine.at(2).get('mediList').value.find(item => item.medicineName === 'CPM (Del)');
            control.get('medicineId').patchValue(foundObject4.id);
            control.get('unit').patchValue(foundObject4.unitofMeasure);
            this.DosageList(foundObject4.id, control);
          }
          //#endregion
        }
        this.spinner.hide();
      } else {
        this.toastr.error(JSON.stringify(result.message));
        this.spinner.hide();
      }
    }, (err) => {
      this.spinner.hide();
      this.toastr.error('Something went wrong');
    });
  }


  callDosageList(event, index, val = '') {
    let newValue;
    let medicineId;
    if (val == 'edit') {
      newValue = event//.dosageId == 0 ? null : event.dosageId
      medicineId = event.medicineId
    } else {
      newValue = event.target.value;
      medicineId = event.target.value
    }
    const control = this.DosageMedicine.at(index);
    var list = control.get('mediList').value.find(x => x.id == medicineId)
    control.get('unit').setValue(list.unitofMeasure);
    control.get('medicineId').setValue(medicineId);
    this.DosageList(newValue, control, val);
  }

  DosageList(id, control, val = '') {
    this.spinner.show();
    let medId = 0;
    if (val == 'edit') {
      medId = id.medicineId
    } else {
      medId = id
    }
    const weight = this.enrollPatient.get('weight').value;
    const obj = {
      medicineTypeId: control.get('medicineTypeId').value,
      medicineId: medId,
      weight: weight
    };
    this.apiService.dosageListByType(obj).subscribe((result: any) => {
      if (result.status) {
        control.get('dosageList').setValue(result.res);
        let id1
        if (val == 'edit') {
          id1 = id.dosageId == 0 ? null : id.dosageId;
        } else {
          id1 = result.res[0]?.id ? result.res[0].id : ''
        }
        control.get('dosageId').setValue(id1);

        this.spinner.hide();
      } else {
        this.toastr.error(JSON.stringify(result.message));
        this.spinner.hide();
      }
    }, (err) => {
      this.spinner.hide();
      this.toastr.error('Something went wrong');
    });
  }*/

  closeForm() {
    this.router.navigate(['patient']);
  }

  validationLength(text) {
    if (text == 'cnic' && this.enrollPatient.value.cnic.length != 13) {
      this.cnciLengthValidation = true;
    } else {
      this.cnciLengthValidation = false;
    }
    if (text == 'phone' && this.enrollPatient.value.contactPhone.length != 11) {
      this.phoneLengthValidation = true;
    } else {
      this.phoneLengthValidation = false;
    }
  }

  setDefaultValues() {
    this.enrollPatient.patchValue({
      gender: '',
      doctor: ''
    })
  }

  setRemaining() {
    const totalAmount = this.enrollPatient.value.totalAmount;
    const dueAmount = this.enrollPatient.value.dueAmount;
    const receivingAmount = totalAmount - dueAmount;
    this.enrollPatient.get('receivingAmount').setValue(receivingAmount);
  }

  checkHistory() {
    if (this.enrollPatient.value.mobile != '') {
      this.apiService.getAmountHistory(this.enrollPatient.value.mobile).subscribe((result: any) => {
        if (result.status) {
          this.enrollPatient.patchValue({
            remainingAmount: result.res == null ? 0 : result.res
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
    } else {
      this.toastr.error('Please Enter Phone Number');
    }
  }

  selectionClick(value: any) {
    const textareaElement: HTMLTextAreaElement = this.textArea1.nativeElement;

    if (textareaElement) {
      const cursorPosition = textareaElement.selectionStart;
      const currentValue = this.enrollPatient.value.outdoor;
      const newValue = currentValue.substring(0, cursorPosition) + value + currentValue.substring(cursorPosition);
      textareaElement.value = newValue;
      textareaElement.setSelectionRange(cursorPosition + value.length, cursorPosition + value.length);
      textareaElement.focus();
      this.enrollPatient.patchValue({ outdoor: textareaElement.value })
    }
  }

  convertNewlinesToBreaks(text: string): string {
    return text.replace(/\n/g, '<br>');
  }



  //#region new code

  getAllMedicineList() {
    this.spinner.show();
    this.apiService.getAllMedicineList().subscribe((result: any) => {
      if (result.status) {
        this.allMedicineType = result.res.MedicineTypes;
        this.allMedicine = result.res.Medicines;
        this.allDosage = result.res.Dosages;
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

  getMedicineList(id, index) {
    let medicineList = this.getMedicineById(id);
    const control = this.DosageMedicine.at(index);
    control.get('mediList').setValue(medicineList);
  }

  getDosageList(id, index) {
    const control = this.DosageMedicine.at(index);
    let dosageList = this.getDosageById(control.get('medicineTypeId').value, id, this.enrollPatient.get('weight').value);
    control.get('dosageList').setValue(dosageList);
    control.get('dosageId').setValue(dosageList[0]?.id ? dosageList[0]?.id : '');
    var list = control.get('mediList').value.find(x => x.id == id);
    control.get('unit').setValue(list.unitofMeasure);

  }

  patchFormArrayValuesLocally(data: any[]) {
    const formArray = this.DosageMedicine;
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
    data.forEach((item, index) => {
      var dosageBool = false;
      var timeBool = false;
      if (item.dosage != 0 && item.dosage != null) {
        dosageBool = true;
      }
      if (item.time > 4) {
        timeBool = true;
      }
      this.addDosage()

      const control = formArray.at(index);
      let typeId = item.medicineTypeId;
      let medicineId = item.medicineId;
      let dosageId = item.dosageId == 0 ? null : item.dosageId;
      control.get('medicineTypeId').setValue(typeId);
      let medicineList = this.getMedicineById(typeId);
      control.get('mediList').setValue(medicineList);
      control.get('medicineId').setValue(medicineId);
      let dosageList = this.getDosageById(typeId, medicineId, this.enrollPatient.get('weight').value);
      control.get('dosageList').setValue(dosageList);
      control.get('dosageId').setValue(dosageId);
      var list = control.get('mediList').value.find(x => x.id == medicineId);
      console.log('list',list)
      control.get('unit').setValue(list?.unitofMeasure);
      control.get('time').patchValue(item.time);
      control.get('dosage').patchValue(item.dosage);
      control.get('isDropdown').patchValue(timeBool);
      control.get('isdosageDropDown').patchValue(dosageBool);
      
    });
  }

  getMedicineById(id) {
    return this.allMedicine.filter(x => x.medicineTypeId == id);
  }

  getDosageById(typeId, id, weight) {
    return this.allDosage.filter(x => {
      if (x.weight.includes('+')) {
        const parsedWeight = parseFloat(x.weight);
        const givenWeight = parseFloat(weight);
        return x.medicineTypeId == typeId && x.medicineId == id && givenWeight >= parsedWeight;
      } else {
        return x.medicineTypeId == typeId && x.medicineId == id && x.weight == weight;
      }
    });
  }
  

  //#endregion
}
