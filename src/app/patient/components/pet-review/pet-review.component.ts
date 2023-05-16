import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TabserviceService } from 'src/app/shared/tabservice.service';
import { PetService } from '../../pet.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { AlertService } from 'src/app/components/alert-modal/alert.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-pet-review',
  templateUrl: './pet-review.component.html',
  styleUrls: ['./pet-review.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PetReviewComponent implements OnInit {
  data: any;
  editFlag: boolean = false;
  editId: any;
  petReviewArr: any;
  submitFlag: boolean = false;
  studyArr: any = [];
  petDetails: any = [];
  newArr: any = [];
  constructor(
    private router: Router,
    private tabservice: TabserviceService,
    private petservice: PetService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private customDatepipe: CustomDateFormatPipe,
    private alertService: AlertService
  ) { }

  async ngOnInit() {
    let str = this.router.url;
    if (this.router.url.indexOf('/edit-patient') > -1) {
      let id = str.split("edit-patient/")[1].split("/")[0];
      this.editFlag = true;
      this.editId = id;
    }

    let resp = this.tabservice.getModelData() ? this.tabservice.getModelData() : {};
    if (!resp || (resp && !resp.petInfo)) {
      if (!this.editFlag)
        this.router.navigate(['/user/patients/add-patient/pet-info']);
      else
        this.router.navigate([`/user/patients/edit-patient/${this.editId}/pet-info`]);
      return;
    }

    this.tabservice.dataModel$.subscribe(res => {
      this.data = res ? res : '';

      if (this.data) {
        this.data.petParentInfo = (this.data.petExistingArr ? this.data.petExistingArr : []).concat(this.data.petNewArr ? this.data.petNewArr : []);
      }
    });

    await  this.getStudy();
    this.petDetails = this.data.petStudy.arr;
    this.petDetails.forEach((ele1, i) => {
      this.studyArr.forEach((ele2,j) => {
        if(ele1.studyName.studyId == ele2.studyId){
          this.newArr.push({
            'studyName': ele1.studyName.studyName,
            'studyassDate':ele1.studyassDate, 
            'studyDescription': ele2.studyDescription,
            'externalPetValue': ele1.externalPet.externalPetValue
          })
        }
      });         
    });
  }

  private async getStudy() {
    this.spinner.show();
    let res: any = await (
      this.petservice.getPet('/api/study/getStudyList', '').pipe(
        catchError(err => {
          this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
          return of(false);
        })
      )
    ).toPromise();
    if (res.status.success === true) {
      this.studyArr = res.response.studyList;
      this.spinner.hide();
    }
  }

  back() {

    if (!this.editFlag) {
      this.router.navigate(['/user/patients/add-patient/pet-parent-info']);
    }
    else {
      this.router.navigate([`/user/patients/edit-patient/${this.editId}/pet-parent-info`]);
    }
  }
  submit() {
    let res = Object.assign({});

    let data = this.tabservice.getModelData() ? this.tabservice.getModelData() : {};

    // if (!(data.hasOwnProperty('petInfo'))  || !(data.hasOwnProperty('petDevice')) || !(data.hasOwnProperty('petParentInfo')) ) {
    // if (!(data.hasOwnProperty('petDevice'))) {
    //   this.toastr.error("Please select all mandatory fields in Pet Device tab");
    // }
    // if (!(data.hasOwnProperty('petParentInfo'))) {
    //   this.toastr.error("Please select all mandatory fields in Pet Parent Info tab");
    // }
    //   return;
    // }
    if (!(data.hasOwnProperty('petInfo'))) {
      this.toastr.error("Please select all mandatory fields in Pet Info tab");
      return;
    }
    if (!(data.hasOwnProperty('petStudy')) && data.petInfo.status == 2) {
      this.toastr.error("Pet cannot be marked as On-Study without associating a study.");
      return;
    }
    this.submitFlag = true;
    if (this.editFlag) {
      res["petId"] = this.editId;
    }
    res["petName"] = data.petInfo.petName;
    res["petImage"] = data.petInfo.petImageFileName ? data.petInfo.petImageFileName : '';
    res["breedId"] = data.petInfo.breed.breedId;
    res["breedName"] = data.petInfo.breed.breedName;
    res["gender"] = data.petInfo.gender;
    res["weight"] = data.petInfo.weight;
    res["weightUnit"] = data.petInfo.weightUnits;
    res["dateOfBirth"] = this.customDatepipe.transform(data.petInfo.dateofBirth, 'yyyy-MM-dd');
    res["isNeutered"] = data.petInfo.category == 'Neutered' ? true : false;

    res["petImageUrl"] = data.petInfo.petImageUrl ? data.petInfo.petImageUrl : '';
    // data.petInfo.status;

    // res["petParentName"] = data.petParentInfo.ppName;
    // res["petParentEmail"] = data.petParentInfo.ppEmail;
    let petDevicesArr = [];

    data.petDevice && data.petDevice.arr && data.petDevice.arr.forEach(ele => {
      if (ele.study != '') {
        petDevicesArr.push({
          "studyId": ele.study,
          //    "studyDescription":ele.studyDesc,
          "studyName": ele.studyName ? ele.studyName : '',
          "deviceId": ele.deviceNumber ? ele.deviceNumber.deviceId : '',
          "deviceNumber": ele.deviceNumber ? ele.deviceNumber.deviceNumber : '',
          "assignedOn": ele.assignedOn ? this.customDatepipe.transform(ele.assignedOn, 'yyyy-MM-dd') : '',
          "assignedOnDate": ele.assignedOn ? this.customDatepipe.transform(ele.assignedOn, 'yyyy-MM-dd HH:mm:ss') : '',
          "externalPetInfoId": ele.externalPetInfoId ? ele.externalPetInfoId : '',
          "externalPetValue": ele.externalPetValue ? ele.externalPetValue : '',
          "studyAssignedOnDate": ele.studyAssignedOn ? this.customDatepipe.transform(ele.studyAssignedOn, 'yyyy-MM-dd HH:mm:ss') : '',
        })
      }

    });
    // filter array

    let b1 = [];
    if (data.petStudy && data.petStudy.arr) {
      b1 = data.petStudy.arr
    }
    let b2 = petDevicesArr;
    let response = b1.filter(res =>
      !b2.some(ele => (ele.studyId == res.studyName.studyId)))

    response.forEach(res => {
      petDevicesArr.push({
        "studyId": res.studyName.studyId,
        "studyName": res.studyName.studyName ? res.studyName.studyName : '',
        "externalPetInfoId": res.externalPet.externalPetId ? res.externalPet.externalPetId : '',
        "externalPetValue": res.externalPet.externalPetValue ? res.externalPet.externalPetValue : '',
        "studyAssignedOnDate": res.studyassDate ? this.customDatepipe.transform(res.studyassDate, 'yyyy-MM-dd HH:mm:ss') : '',
      })
    })

    res["petDevices"] = petDevicesArr;

    let petParentsArr = [];
    data.petParentInfo && data.petParentInfo.forEach(ele => {
      petParentsArr.push({
        "petParentId": ele.ppId,
        "petParentName": ele.petParentFirstName + ' ' + ele.petParentLastName,
        'petParentFirstName': ele.petParentFirstName,
        'petParentLastName': ele.petParentLastName,
        "email": ele.ppEmail,
        "phoneNumber": (ele.phoneNumberCode ? ele.phoneNumberCode : '') + ele.phoneNumberValue,
        "shippingAddress": ele.addr
      })
    });

    res["petParents"] = petParentsArr;
    if (!this.editFlag && data.hasOwnProperty('petStudy')) {
      data.petInfo.status = '2';
    }

    if (this.editFlag) {
      // res["removedStudyIds"] = data.petDevice ? data.petDevice.removedStudyDevices : [] ;
      // [{petAssetId: 123,reasonId:34},{petAssetId: 123,reasonId:34}]
      res["petUnAssignAssets"] = data.petDevice ? data.petDevice.removedAssetIds : [];

      if (data.removedPetParents && data.removedPetParents.length > 0) {
        res["removedPetParents"] = data.removedPetParents.toString();
      }
      if (data.hasOwnProperty('petStudy') && data.petInfo.petPreviousStatus == data.petInfo.status) {
        data.petInfo.status = '2';
      }
      if ((data.hasOwnProperty('petStudy')) && (data.petInfo.status == '3' || data.petInfo.status == '1')) {
        res["confirmOffStudy"] = true;
      }
      else {
        res["confirmOffStudy"] = false;
      }
    }
    res["petStatusId"] = data.petInfo.status ? data.petInfo.status : '';

    if (!this.editFlag) {
      this.spinner.show();
      this.petservice.addPet('/api/pets/', res).subscribe(res => {
        if (res.status.success === true) {
          this.toastr.success('Pet added successfully!');
          this.spinner.hide();
          this.tabservice.clearDataModel();
          this.router.navigate(['/user/patients']);
        }
        else {
          this.toastr.error(res.errors[0].message);
          this.spinner.hide();
        }
      }, err => {
        console.log(err);
        this.errorMsg(err);
      });
    }
    else {
      this.spinner.show();
      this.petservice.updatePet('/api/pets/', res).subscribe(res => {
        if (res.status.success === true) {
          this.toastr.success('Pet updated successfully!');
          this.spinner.hide();
          this.tabservice.clearDataModel();
          this.router.navigate(['/user/patients']);
        }
        else {
          this.toastr.error(res.errors[0].message);
          this.spinner.hide();
        }
      }, err => {
        console.log(err);
        this.errorMsg(err);
      });

    }

  }

  errorMsg(err) {
    if (err.status == 500) {
      this.toastr.error(err.error.message + ". " + "Please try after sometime or contact administrator.");
    }
    else {
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    }
    this.spinner.hide();
  }

  canDeactivate(component, route, state, next) {
    if (next.url.indexOf('/auth/login') > -1) {
      return true;
    }
    if (next.url.indexOf('/user/patients') > -1 && this.submitFlag) {
      return true;
    }
    else if (next.url.indexOf('/add-patient') > -1 || next.url.indexOf('/edit-patient') > -1) {
      return true;
    }
    else {
      return this.alertService.confirm();
    }
  }
}
