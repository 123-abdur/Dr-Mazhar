import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ApiServiceService } from 'src/app/services/api-service.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit, OnDestroy {

  cnciLengthValidation: boolean = false;
  phoneLengthValidation: boolean = false;
  showFormCheck: boolean = false;
  validateCheck: boolean = false;
  formHeading: string;
  recentTokenChecked: string = '0';
  tokenSubscribe: Subscription;
  listOfUser: any = [];
  patientText: string = 'New Patient';
  selectedTab: string = 'newPatient';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  sittingPatient: string = '';
  doneToken: string = '';
  searchText: string = '';
  role: any = this.apiService.loginUserData?.role;
  private userListInterval: any;
  constructor(private spinner: NgxSpinnerService, private toastr: ToastrService, private apiService: ApiServiceService, private route: Router) {
    this.tokenSubscribe = this.apiService.data$.subscribe((value) => {
      this.recentTokenChecked = value;
    });
  }

  ngOnInit(): void {
    this.userList(false);
    this.userListInterval = setInterval(() => {
      this.selectTab('newPatient')
      this.userList(false);
    }, 60000);
    this.sittingList();
  }

  ngOnDestroy(): void {
    this.tokenSubscribe.unsubscribe();
    clearInterval(this.userListInterval);
  }

  showForm(id) {
    this.route.navigate(['patient/' + id]);
  }

  userList(val) {
    this.patientText = 'New Patient';
    this.spinner.show();
    this.apiService.patientList(val).subscribe((result: any) => {
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

  checkUserList() {
    this.patientText = 'Checked Patient';
    this.spinner.show();
    this.apiService.patientList(true).subscribe((result: any) => {
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
        this.userList(false);
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

  filterUsers() {
    return this.listOfUser.filter(user => {
      return user.name.toLowerCase().startsWith(this.searchText.toLowerCase()) || user.tokenNo.includes(this.searchText);
    });
  }

  changePage(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  selectTab(tabName: string): void {
    this.selectedTab = tabName;
  }

  sittingList() {
    this.spinner.show();
    this.apiService.sitPatientList().subscribe((result: any) => {
      if (result.status) {
        this.sittingPatient = result.res.insitPatient
        this.doneToken = result.res.totalDoctorPharmacyPatients
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

}
