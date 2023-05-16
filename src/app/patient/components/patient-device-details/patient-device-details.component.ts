import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PetService } from '../../pet.service';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';

@Component({
  selector: 'app-patient-device-details',
  templateUrl: './patient-device-details.component.html',
  styleUrls: ['./patient-device-details.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class PatientDeviceDetailsComponent implements OnInit {
  petId: any;
  studyId: any;
  petDevices: any = [];
  headers = [];

  constructor(
    private userDataService: UserDataService,
    private petService: PetService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    public router: Router,
    private spinner: NgxSpinnerService,
    private customDatePipe: CustomDateFormatPipe
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.activatedRoute.params.subscribe(async params => {
      let str = this.router.url;
      this.petId = str.split("view/")[1].split("/")[0];
      this.studyId = str.split("view/")[1].split("/")[1];
    })

    this.getInitialData();
  }
  getInitialData() {

    this.headers=[
      { key: "deviceNumber", label: "Asset Number", checked: true },
      { key: "deviceModel", label: "Asset Model", checked: true },
      { key: "firmwareVersion", label: "Firmware version", checked: true },
      { key: "lastSync", label: "Last Sync", checked: true },
      { key: "assignedOn", label: "Assigned On", checked: true },
      { key: "unAssignedOn", label: "Unassigned On", checked: true },
      { key: "unassignedReason", label: "Unassigned Reason", checked: true },
      { key: "batteryPercentage", label: "Battery Level", checked: true },
    ];

  }
  formatter($event){
    $event.forEach(ele => {
      if(ele.assignedOn || ele.unAssignedOn){
        ele.assignedOn = this.customDatePipe.transform(ele.assignedOn, 'MM-dd-yyyy');
        ele.unAssignedOn = this.customDatePipe.transform(ele.unAssignedOn, 'MM-dd-yyyy');
      }
    });
    
  }
}
