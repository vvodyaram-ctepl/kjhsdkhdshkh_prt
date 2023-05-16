import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { PetService } from '../../pet.service';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-patient-client-info',
  templateUrl: './patient-client-info.component.html',
  styleUrls: ['./patient-client-info.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class PatientClientInfoComponent implements OnInit {

  petId: any;
  studyId: any;
  petParents: any = [];
  headers=[];

  constructor(
    private userDataService: UserDataService,
    private petService: PetService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    public router: Router,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.activatedRoute.params.subscribe(async params => {
      let str = this.router.url;
      this.petId = str.split("view/")[1].split("/")[0];
      this.studyId = str.split("view/")[1].split("/")[1];
    });
    this.headers = [
      { key: "petParentName", label: "Name", checked: true },
      { key: "email", label: "Email", checked: true },
      { key: "phoneNumber", label: "Mobile", checked: true },
      { key: "shippingAddress", label: "Shipping Address", checked: true, width:400 }
    ];

    this.getInitialData();
  }

  formatUSPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      var intlCode = (match[1] ? '+1 ' : '+1 ');
      return [intlCode, ' ', '(', match[2], ')', match[3], '-', match[4]].join('');
    }
    return null;
  }
  formatUKPhoneNumber(phoneNumber) {
    let phoneNumberArr = phoneNumber.toString().split(/44(.+)/);
    console.log("phoneNumberArr",phoneNumberArr)
    let genPh = phoneNumberArr[1]
    // return phoneNumberArr[1].replace(/\s+/g, '').replace(/(.)(\d{4})(\d)/, '+44 $1 - $2 - $3');
    let newString = '+44' + ' ' + genPh.substr(0, 2) + '-' + genPh.substr(2, 4) + '-' + genPh.substr(6, 4);
    return newString
}

  getInitialData() {
    //  Get Pet Parents
    
  }

}
