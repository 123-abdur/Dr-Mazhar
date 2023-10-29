import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';

export const ROUTES: any[] = [
  { path: '/stats', title: 'Dashboard',  icon: 'ni-tv-2 text-primary', class: '',subMenu:[] },

  {
    title: 'Setting',
    icon: 'ni-settings-gear-65 text-primary',
    class: '',
    subMenu: [
      { path: '/user', title: 'User', class: '' },
      { path: '/medicine-type', title: 'Medicine Types', class: '' },
      { path: '/medicine', title: 'Medicine', class: '' },
      { path: '/medicine-dosage', title: 'Medicine Dosage', class: '' }
    ]
  },
  // { path: '/patient-enroll', title: 'Patient Enroll', icon: 'ni-tv-2 text-primary', class: '', subMenu: [] },
  // { path: '/patient', title: 'Patient List', icon: 'ni-tv-2 text-primary', class: '', subMenu: [] },
  // { path: '/dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-primary', class: '',subMenu:[] },
  // { path: '/icons', title: 'Icons',  icon:'ni-planet text-blue', class: '' ,subMenu:[]},
  // { path: '/maps', title: 'Maps',  icon:'ni-pin-3 text-orange', class: '' ,subMenu:[]},
  // { path: '/user-profile', title: 'User profile',  icon:'ni-single-02 text-yellow', class: '' ,subMenu:[]},
  // { path: '/tables', title: 'Tables',  icon:'ni-bullet-list-67 text-red', class: '' ,subMenu:[]},
  // { path: '/login', title: 'Login',  icon:'ni-key-25 text-info', class: '' ,subMenu:[]},
  // { path: '/register', title: 'Register',  icon:'ni-circle-08 text-pink', class: '',subMenu:[] }
];

export const DoctorROUTES: any[] = [
  { path: '/patient', title: 'Patient List', icon: 'ni-tv-2 text-primary', class: '', subMenu: [] },
  { path: '/patient-enroll', title: 'Patient Enroll', icon: 'ni-tv-2 text-primary', class: '', subMenu: [] },
  { path: '/history', title: 'History', icon: 'ni-tv-2 text-primary', class: '', subMenu: [] },
];

export const DespenserROUTES: any[] = [
  { path: '/patient', title: 'Patient List', icon: 'ni-tv-2 text-primary', class: '', subMenu: [] },
  { path: '/history', title: 'History', icon: 'ni-tv-2 text-primary', class: '', subMenu: [] },
];

export const ReciptionistROUTES: any[] = [
  { path: '/patient-enroll', title: 'Patient Enroll', icon: 'ni-tv-2 text-primary', class: '', subMenu: [] },
  { path: '/rec-patient-list', title: 'Patient List', icon: 'ni-tv-2 text-primary', class: '', subMenu: [] },
  { path: '/history', title: 'History', icon: 'ni-tv-2 text-primary', class: '', subMenu: [] },

];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;
  role: any = this.apiService.loginUserData?.role;
  constructor(private router: Router, private apiService: ApiServiceService) { }

  ngOnInit() {
    if(this.role == 'Doctor'){
      this.menuItems = DoctorROUTES.filter(menuItem => menuItem);
    } else if(this.role == 'Despenser'){
      this.menuItems = DespenserROUTES.filter(menuItem => menuItem);
    }else if(this.role == 'Receptionist'){
      this.menuItems = ReciptionistROUTES.filter(menuItem => menuItem);
    }else if(this.role == 'Admin'){
      this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }

  toggleSubMenu(menuItem: any) {
    if (menuItem.subMenu) {
      menuItem.showSubMenu = !menuItem.showSubMenu;
    }
  }

  isSubMenuOpen(menuItem: any): boolean {
    return menuItem.showSubMenu;
  }

}

