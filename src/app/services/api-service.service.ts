import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  private dataSubject = new BehaviorSubject<string>('');
  data$ = this.dataSubject.asObservable();
  loginUserData: any = JSON.parse(localStorage.getItem('userdata'));
  constructor(private http: HttpClient) { }

  // get loginUserData(){
  //   return this._loginUserData;
  // }

  // set loginUserData(val){
  //   this._loginUserData = val;
  // }

  userRegister(user, text) {
    if (text == "Add") {
      return this.http.post(environment.url + 'api/userRegistration', user);
    } else if (text == "Update") {
      return this.http.put(environment.url + 'api/editUser', user);
    }
  }
  updateData(newValue: string) {
    this.dataSubject.next(newValue);
  }

  userList() {
    return this.http.get(environment.url + 'api/userList');
  }

  deleteUser(id) {
    return this.http.get(environment.url + 'api/userDelete/' + id);
  }

  login(user): Observable<any> {
    return this.http.post(environment.url + 'api/login', user);
  }

  mediTypeList() {
    return this.http.get(environment.url + 'api/mediListType');
  }

  getAllMedicineList() {
    return this.http.get(environment.url + 'api/patientMediListType');

  }

  medTypeRegister(user, text) {
    if (text == "Add") {
      return this.http.post(environment.url + 'api/addMedicineType', user);
    } else if (text == "Update") {
      return this.http.put(environment.url + 'api/editMedicineType', user);
    }
  }

  deletemedTypeList(id) {
    return this.http.get(environment.url + 'api/medicineTypeDelete/' + id);
  }

  medicineList() {
    return this.http.get(environment.url + 'api/mediList');
  }

  medicineRegister(user, text) {
    if (text == "Add") {
      return this.http.post(environment.url + 'api/addMedicine', user);
    } else if (text == "Update") {
      return this.http.put(environment.url + 'api/editMedicine', user);
    }
  }

  deletemedicineList(id) {
    return this.http.get(environment.url + 'api/medicineDelete/' + id);
  }

  medicineDosageRegister(user, text) {
    if (text == "Add") {
      return this.http.post(environment.url + 'api/medicineDosageRegistration', user);
    } else if (text == "Update") {
      return this.http.put(environment.url + 'api/editMedicineDosage', user);
    }
  }

  medicineDosageList() {
    return this.http.get(environment.url + 'api/dosageList');
  }

  deletemedicineDosage(id) {
    return this.http.get(environment.url + 'api/medicineDosageDelete/' + id);
  }

  medicineListByType(id) {
    return this.http.get(environment.url + 'api/medicineByMedicineTypeId/' + id);
  }


  dosageListByType(obj) {
    return this.http.post(environment.url + 'api/dosageByMedicineIdId', obj);
  }


  enrollPatient(user) {
    return this.http.post(environment.url + 'api/enrollPatient', user);
  }

  UpdatePatient(user) {
    return this.http.put(environment.url + 'api/editPatient', user);
  }

  UpdatePatientPharmacy(user) {
    return this.http.put(environment.url + 'api/editPatientByPharmacy', user);
  }

  patientList(val) {
    return this.http.get(environment.url + 'api/patientList?val=' + val + '&role=' + this.loginUserData?.role);
  }

  patientListByDate(val) {
    return this.http.get(environment.url + 'api/patientListByDate?date=' + val);
  }

  getPatient(id) {
    return this.http.get(environment.url + 'api/patientById/' + id);
  }
  doctorList() {
    return this.http.get(environment.url + 'api/doctorList');
  }

  getHistory(mobile, name) {
    return this.http.get(environment.url + 'api/viewHistory?mobile=' + mobile + '&name=' + name);
  }

  passwordChange(user) {
    return this.http.post(environment.url + 'api/changePassword', user);
  }


  DosageIFExistList(val, val2) {
    return this.http.get(environment.url + 'api/dosageExist?medicineTypeId=' + val + '&medicineId=' + val2);
  }

  getDetail(selectedDate, id) {
    return this.http.get(environment.url + 'api/viewDetial?date=' + selectedDate + '&id=' + id);
  }

  getAmountHistory(mobile) {
    return this.http.get(environment.url + 'api/viewAmountHistory?mobile=' + mobile);
  }

  sitPatient(user) {
    return this.http.put(environment.url + 'api/editSittingPatient', user);
  }

  sitPatientList() {
    return this.http.get(environment.url + 'api/getInsitPatient');
  }


  recpatientList() {
    return this.http.get(environment.url + 'api/RecpatientList');
  }

  RecUpdatePatient(user) {
    return this.http.put(environment.url + 'api/recEditPatient', user);
  }

  populateEnrollForm(mobile) {
    return this.http.get(environment.url + 'api/populateEnrollForm?mobile=' + mobile);
  }

  getExistPatient(mobile) {
    return this.http.get(environment.url + 'api/getExistPatient?mobile=' + mobile);
  }
}
