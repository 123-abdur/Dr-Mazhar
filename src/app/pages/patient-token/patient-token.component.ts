import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiServiceService } from 'src/app/services/api-service.service';

@Component({
  selector: 'app-patient-token',
  templateUrl: './patient-token.component.html',
  styleUrls: ['./patient-token.component.scss']
})
export class PatientTokenComponent implements OnInit, OnDestroy {

  token: any = []
  tokenSubscribe: Subscription;

  constructor(private apiservice: ApiServiceService) {
    this.tokenSubscribe = this.apiservice.data$.subscribe((value) => {
      this.token = value.split('_');
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.tokenSubscribe.unsubscribe();
  }

}
