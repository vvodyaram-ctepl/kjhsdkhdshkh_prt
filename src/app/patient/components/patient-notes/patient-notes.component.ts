import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PetService } from '../../pet.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';

@Component({
  selector: 'app-patient-notes',
  templateUrl: './patient-notes.component.html',
  styleUrls: ['./patient-notes.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class PatientNotesComponent implements OnInit {

  petId: any;
  studyId: any;
  petNotes: any = [];
  RWFlag: boolean = false;
  headers = [];

  constructor(
    private petService: PetService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    public router: Router,
    private spinner: NgxSpinnerService,
    private userDataService: UserDataService,
    private customDatePipe: CustomDateFormatPipe
  ) { }

  ngOnInit(): void {
    //permission for the module
    let userProfileData = this.userDataService.getRoleDetails();
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == 21 && ele.menuActionId == 3) {
        this.RWFlag = true;
      }
    });
    this.spinner.show();
    this.activatedRoute.params.subscribe(async params => {
      let str = this.router.url;
      this.petId = str.split("view/")[1].split("/")[0];
      this.studyId = str.split("view/")[1].split("/")[1];
    })

    this.getInitialData();
  }
  getInitialData() {
    this.headers = [
      { key: "noteType", label: "Title", checked: true,width:245 },
      { key: "content", label: "Description", checked: true },
      { key: "modifiedDate", label: "Created Date", checked: true, width:150 },
    ];
    //   Get Notes
    // this.petService.getPet(`/api/pets/${this.petId}/getPetNotes`, '').subscribe(res => {
    //   if (res.status.success === true) {
    //     this.petNotes = res.response.petNotes;
    //     this.spinner.hide();
    //   }
    //   else {
    //     this.toastr.error(res.errors[0].message);
    //     this.spinner.hide();
    //   }
    // }, err => {
    //   this.toastr.error(err.error.errors[0] ?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    // });
  }
  formatter($event){
    $event.forEach(ele => {
      if(ele.modifiedDate){
        ele.modifiedDate = this.customDatePipe.transform(ele.modifiedDate, 'MM-dd-yyyy');
      }
    });
  }

  addNotesPage() {
    this.router.navigate([`/user/patients/pet-notes-info/${this.petId}/${this.studyId}`]);
  }

}
