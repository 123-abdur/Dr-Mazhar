import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/services/api-service.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  patienHistory: any = [];
  historyCheck: boolean = false;
  mobileValue : string = '';
  name:string = '';
  options: any = [];
  role: any = this.apiService.loginUserData?.role;
  constructor(private spinner: NgxSpinnerService,
    private toastr: ToastrService,private apiService: ApiServiceService) { }

  ngOnInit(): void {
  }

  convertNewlinesToBreaks(text: string): string {
    return text.replace(/\n/g, '<br>');
  }

  valuechange(){
    if(this.mobileValue.length == 11){
      this.getExistPatient();
    }
  }

  getExistPatient() {
    this.spinner.show();
    if (this.mobileValue != '') {
      this.apiService.getExistPatient(this.mobileValue).subscribe((result: any) => {
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

  showHistory() {
    this.spinner.show()
    this.apiService.getHistory(this.mobileValue,this.name).subscribe((result: any) => {
      if (result.status) {
        this.patienHistory = result.res;
        console.log('history',this.patienHistory)
        this.historyCheck = true;
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
