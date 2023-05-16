import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClinicService } from '../clinic.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-view-associated-pets',
  templateUrl: './view-associated-pets.component.html',
  styleUrls: ['./view-associated-pets.component.scss']
})
export class ViewAssociatedPetsComponent implements OnInit {
  editFlag: boolean;
  editId: string;
  headers: any;
  dataArr: any;
  constructor(public route: ActivatedRoute,
    public router: Router,
    private spinner: NgxSpinnerService,
    private clinicService: ClinicService,
    private toastr: ToastrService, ) { }

  ngOnInit() {
    this.headers = [
      // {  label: "S.No", checked: true, clickable: true },
      { label: "Pet Name", checked: true },
      { label: "status", checked: true },
    ];

    if (this.router.url.indexOf('/view-clinic') > -1) {
      console.log("this.router.url", this.router.url);
      let str = this.router.url;
      let id = str.split("view-clinic/")[1].split("/")[0]
      this.editFlag = true;
      this.editId = id;
      this.spinner.show();
      this.clinicService.getAssociatedPets(`/api/study/associatedPets/${this.editId}`, '').subscribe(res => {
        console.log("res", res);
        if (res.status.success == true) {
          let user = res.response.pets;
          this.dataArr = user;
        }
        this.spinner.hide();
      },
        err => {

          console.log(err);
          if (err.status == 500) {
            this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
          }
          else {
            this.toastr.error(err.error.errors[0] ?.message || 'Something went wrong. Please try after sometime or contact administrator.');
          }
          this.spinner.hide();
        }
      )
    }
  }

  redirectPetView(data){
    console.log(data);
    const host: string =  location.origin;
    const url: string = host + '/#/' + String(`/user/patients/view/${data.petId}/${data.petStudyId}/patient-charts`);
    window.open(url, '_blank');

    // const url = this.router.createUrlTree([`/#/user/patients/view/${data.petId}/${this.editId}/patient-charts`])
    // window.open(url.toString(), '_blank')
  }

}
