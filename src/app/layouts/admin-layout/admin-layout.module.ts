import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserComponent } from 'src/app/pages/user/user.component';
import { MedicineTypeComponent } from 'src/app/pages/medicine-type/medicine-type.component';
import { MedicineComponent } from 'src/app/pages/medicine/medicine.component';
import { MedicineDosageComponent } from 'src/app/pages/medicine-dosage/medicine-dosage.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TokenInterceptorService } from 'src/app/interceptor/token-interceptor.service';
import { PatientEnrollComponent } from 'src/app/pages/patient-enroll/patient-enroll.component';
import { PatientFormComponent } from 'src/app/pages/patient-form/patient-form.component';
import { PatientListComponent } from 'src/app/pages/patient-list/patient-list.component';
import { CustomPaginationComponent } from 'src/app/pages/custom-pagination/custom-pagination.component';
import { NgxPrintModule } from 'ngx-print';
import { ChangePasswordComponent } from 'src/app/pages/change-password/change-password.component';
import { StatsDashboardComponent } from 'src/app/pages/stats-dashboard/stats-dashboard.component';
import { RecPatientListComponent } from 'src/app/pages/rec-patient-list/rec-patient-list.component';
import { HistoryComponent } from 'src/app/pages/history/history.component';
// import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
    NgxSpinnerModule,
    NgxPrintModule
  ],
  declarations: [
    UserComponent,
    MedicineTypeComponent,
    MedicineComponent,
    MedicineDosageComponent,
    PatientEnrollComponent,
    PatientFormComponent,
    PatientListComponent,
    CustomPaginationComponent,
    ChangePasswordComponent,
    StatsDashboardComponent,
    RecPatientListComponent,
    HistoryComponent
  ]
})

export class AdminLayoutModule {}
