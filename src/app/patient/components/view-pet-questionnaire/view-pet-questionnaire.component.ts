import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { PetService } from '../../pet.service';

@Component({
  selector: 'app-view-pet-questionnaire',
  templateUrl: './view-pet-questionnaire.component.html',
  styleUrls: ['./view-pet-questionnaire.component.scss']
})
export class ViewPetQuestionnaireComponent implements OnInit {
  RWFlag: boolean;
  petId: string;
  studyId: string;
  petDetails: any;
  ques: boolean;

  constructor(
    private userDataService:UserDataService,
    private spinner:NgxSpinnerService,
    private petService:PetService,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private toastr:ToastrService
  ) { }

  ngOnInit(): void {
      //permission for the module
      let userProfileData = this.userDataService.getRoleDetails();
      userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
        if (ele.menuId == 21 && ele.menuActionId == 3) {
          this.RWFlag = true;
        }
      });

      this.activatedRoute.params.subscribe(async params => {
        let str = this.router.url;
        this.petId = str.split("view/")[1].split("/")[0];
        this.studyId = str.split("view/")[1].split("/")[1];
      })
      this.getInitialData();
  }

  viewResponses() {
    // window.open('/user/patients/view-pet-ques-response', "_blank");
    // /user/patients/view-pet-ques-response
  }
  
  getInitialData() {
    //get campaign points
    this.spinner.show();

    this.petService.getPet(`/api/pets/getPetDetailsById/${this.petId}`, '').subscribe(res => {
      if (res.status.success === true) {
        console.log(res);
        this.petDetails = res.response.petDTO;
        if(this.petDetails.questionnaireAttempted == 0) {
          //no questionnaires found
          this.ques = false;
        }
        else {
          //questionnaires found
          this.ques = true;
        }
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      if (err.status == 500) {
        this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
      }
      else {
        this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
      }
    });

    // this.getCampaignPoints();
    // replace with pet questionanire service
  }

}
