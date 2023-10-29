import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/services/api-service.service';

@Component({
  selector: 'app-rec-patient-list',
  templateUrl: './rec-patient-list.component.html',
  styleUrls: ['./rec-patient-list.component.scss']
})
export class RecPatientListComponent implements OnInit {


  cnciLengthValidation: boolean = false;
  phoneLengthValidation: boolean = false;
  showFormCheck: boolean = false;
  validateCheck: boolean = false;
  formHeading: string;
  recentTokenChecked: string = '0';
  listOfUser: any = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  sittingPatient: string = '';
  doneToken: string = '';
  searchText: string = '';
  role: any = this.apiService.loginUserData?.role;

  constructor(private spinner: NgxSpinnerService, private toastr: ToastrService, private apiService: ApiServiceService, private route: Router) {

  }

  ngOnInit(): void {
    this.userList();
  }

  ngOnDestroy(): void {
  }

  showForm(id) {
    this.route.navigate(['edit/' + id]);
  }

  userList() {
    this.spinner.show();
    this.apiService.recpatientList().subscribe((result: any) => {
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


  filterUsers() {
    return this.listOfUser.filter(user => {
      return user.name.toLowerCase().startsWith(this.searchText.toLowerCase()) || user.tokenNo.includes(this.searchText);
    });
  }

  changePage(pageNumber: number) {
    this.currentPage = pageNumber;
  }





}
