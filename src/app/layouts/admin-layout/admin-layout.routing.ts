import { Routes } from '@angular/router';
import { UserComponent } from 'src/app/pages/user/user.component';
import { MedicineTypeComponent } from 'src/app/pages/medicine-type/medicine-type.component';
import { MedicineComponent } from 'src/app/pages/medicine/medicine.component';
import { MedicineDosageComponent } from 'src/app/pages/medicine-dosage/medicine-dosage.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { PatientEnrollComponent } from 'src/app/pages/patient-enroll/patient-enroll.component';
import { PatientFormComponent } from 'src/app/pages/patient-form/patient-form.component';
import { PatientListComponent } from 'src/app/pages/patient-list/patient-list.component';
import { ChangePasswordComponent } from 'src/app/pages/change-password/change-password.component';
import { StatsDashboardComponent } from 'src/app/pages/stats-dashboard/stats-dashboard.component';
import { AdminGuard } from 'src/app/guards/admin.guard';
import { ReceptionistGuard } from 'src/app/guards/receptionist.guard';
import { DoctorGuard } from 'src/app/guards/doctor.guard';
import { AdminDespenserGuard } from 'src/app/guards/admin-despenser.guard';
import { RecPatientListComponent } from 'src/app/pages/rec-patient-list/rec-patient-list.component';
import { HistoryComponent } from 'src/app/pages/history/history.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'user',canActivate:[AuthGuard,AdminGuard],component: UserComponent },
    { path: 'change-password',canActivate:[AuthGuard],component: ChangePasswordComponent },
    { path: 'medicine-type', canActivate:[AuthGuard,AdminGuard],component: MedicineTypeComponent },
    { path: 'medicine', canActivate:[AuthGuard,AdminGuard],component: MedicineComponent },
    { path: 'medicine-dosage', canActivate:[AuthGuard,AdminGuard],component: MedicineDosageComponent },
    { path: 'patient-enroll', canActivate:[AuthGuard],component: PatientEnrollComponent },
    { path: 'edit/:id', canActivate:[AuthGuard],component: PatientEnrollComponent },
    { path: 'rec-patient-list', canActivate:[AuthGuard],component: RecPatientListComponent },
    { path: 'history', canActivate:[AuthGuard],component: HistoryComponent },
    { path: 'patient', canActivate:[AuthGuard,AdminDespenserGuard],component: PatientListComponent },
    { path: 'patient/:id', canActivate:[AuthGuard,AdminDespenserGuard],component: PatientFormComponent },
    { path: 'stats', canActivate:[AuthGuard,AdminGuard],component: StatsDashboardComponent },
];
