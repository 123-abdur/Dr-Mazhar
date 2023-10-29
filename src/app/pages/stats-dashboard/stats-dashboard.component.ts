import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/services/api-service.service';

@Component({
  selector: 'app-stats-dashboard',
  templateUrl: './stats-dashboard.component.html',
  styleUrls: ['./stats-dashboard.component.scss']
})
export class StatsDashboardComponent implements OnInit {

  selectedDate: string;
  DoctorId: any = '';
  totalPatient: number = 0;
  totalAmount: number = 0;
  totalIM: number = 0;
  doctorList: any = [];
  listOfUser: any = [];
  searchText: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  constructor(
    private apiService: ApiServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private route: Router
  ) {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    this.selectedDate = `${year}-${month}-${day}`;
  }

  ngOnInit(): void {
    this.DoctorList();
  }

  viewDetail() {
    this.spinner.show();
    if (this.DoctorId != '') {
      this.apiService.getDetail(this.selectedDate, this.DoctorId).subscribe((result: any) => {
        if (result.status) {
          if (result.res) {
            this.totalPatient = result.res.PatientCount;
            this.totalAmount = result.res.TotalAmountSum;
            this.totalIM = result.res.IsTakeIMCount;
            this.toastr.success('Operation Successful');
          } else {
            this.toastr.success('No record Found');
          }
          this.spinner.hide();
        }
      }, (err) => {
        this.toastr.error('Something went wrong');
        this.spinner.hide();
      })
    } else {
      this.toastr.error('Please Select Doctor');
      this.spinner.hide();
    }
  }

  DoctorList() {
    this.apiService.doctorList().subscribe((result: any) => {
      if (result.status) {
        this.doctorList = result.res
      }
      else {
        this.toastr.error(JSON.stringify(result.message));
      }
    }, (err) => {
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

  showForm(id) {
    this.route.navigate(['patient/' + id]);
  }


  patientList() {
    this.spinner.show();
    this.apiService.patientListByDate(this.selectedDate).subscribe((result: any) => {
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

}
