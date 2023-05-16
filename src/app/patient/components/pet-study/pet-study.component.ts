import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { TabserviceService } from 'src/app/shared/tabservice.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddUserService } from 'src/app/clinical-users/components/add-user.service';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from 'src/app/components/alert-modal/alert.service';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import * as moment from 'moment';

@Component({
  selector: 'app-pet-study',
  templateUrl: './pet-study.component.html',
  styleUrls: ['./pet-study.component.scss']
})
export class PetStudyComponent implements OnInit {

  addStudyForm: FormGroup;
  arr: FormArray;
  dataFromB: string;
  studyArr: any;
  editFlag: boolean = false;
  editId: string;
  submitFlag: boolean = false;
  externalPetArr: any;
  addFilterFlag: boolean = true;

  constructor(private router: Router,
    private fb: FormBuilder,
    private tabservice: TabserviceService,
    private spinner: NgxSpinnerService,
    private adduserservice: AddUserService,
    private toastr: ToastrService,
    private customDatePipe: CustomDateFormatPipe,
    private alertService: AlertService) {

  }

  ngOnInit() {

    if (this.router.url.indexOf('/edit-patient') > -1) {
      console.log("this.router.url", this.router.url);
      let str = this.router.url;
      let id = str.split("edit-patient/")[1].split("/")[0];
      this.editFlag = true;
      this.editId = id;
    }

    this.spinner.show();
    this.adduserservice.getStudy('/api/study/getStudyList', '').subscribe(res => {

      this.studyArr = res.response.studyList;
      this.studyArr = this.studyArr.filter(ele => ele.studyId != 2901);
      console.log("this.studyArr",this.studyArr)
      this.spinner.hide();
    },
      err => {
        this.spinner.hide();
        this.toastr.error('Something went wrong. Please try after sometime or contact administrator.');
      }
    );


    this.addStudyForm = this.fb.group({
      arr: this.fb.array([this.createItem()])
    });

    // this.tabservice.dataModel$.subscribe(res => {
    let res = this.tabservice.getModelData() ? this.tabservice.getModelData() : {}
    if (!res || (res && !res.petInfo)) {
      if (!this.editFlag)
        this.router.navigate(['/user/patients/add-patient/pet-info']);
      else
        this.router.navigate([`/user/patients/edit-patient/${this.editId}/pet-info`]);
      return;
    }
    res = res ? (res['petStudy'] ? res['petStudy'] : '') : '';
    let rest = res ? res.arr : '';
    if (rest) {
      rest.forEach((ele, i) => {

        this.studySelected(ele.studyName.studyId, i, '');

        this.addStudyForm.controls.arr['controls'][i].patchValue({
          studyName: ele.studyName ? ele.studyName : '',
          studyassDate: ele.studyassDate ? ele.studyassDate : '',
          externalPet: ele.externalPet ? ele.externalPet : '',
          // isExternal:ele.isExternal ? ele.isExternal :'',
          startDate: ele.startDate ? ele.startDate : '',
          endDate: ele.endDate ? ele.endDate : '',
          disabled: ele.disabled,
          isVirtual: ele.isVirtual,
          studyDescription: ele.studyDescription ? ele.studyDescription : ''
        });

        if (i < (rest.length - 1)) {
          this.addItem();

        }
      })

    }

    // })
    //setting status as on study
    let data = this.tabservice.getModelData();

    if (Object.keys(data.petInfo).length > 0) {
      if (data.petInfo.status == '3') {
        this.addFilterFlag = false;
      }
    }
    //setting status as on study
  }

  createItem() {
    return this.fb.group({
      studyName: [''],
      studyassDate: [''],
      externalPet: [''],
      isExternalArr: [''],
      startDate: [''],
      endDate: [''],
      isExternal: [''],
      disabled: true,
      isVirtual: false,
      studyDescription: ['']
    })
  }

  studySelected(studyId, index, $event) {
    if (studyId) {
      this.spinner.show();
      this.adduserservice.getStudy(`/api/pets/getExternalPetInfoList/${studyId}`, '').subscribe(res => {

        let externalPetArr = [];
        let isExternal: boolean = false;
        if (res.response) {
          externalPetArr = res.response;
          isExternal = true;
          // this.addStudyForm.controls.arr['controls'][index].get('externalPet').setValidators(Validators.required);
        }
        else {
          externalPetArr = [];
          isExternal = false;
          // this.addStudyForm.controls.arr['controls'][index].get('externalPet').clearValidators();
        }

        this.addStudyForm.controls.arr['controls'][index].get('externalPet').updateValueAndValidity();
        // if (externalPetArr.length > 0) {

        this.addStudyForm.value.arr.forEach((ele, i) => {
          if (index == i) {
            this.addStudyForm.controls.arr['controls'][i].patchValue({
              'studyDescription': ele.studyDescription ? ele.studyDescription : '',
              "isExternalArr": externalPetArr,
              "isExternal": isExternal
            })
          }
        });
        // }


        //internal external studies should not go togther
        if (this.addStudyForm.value.arr.length > 1) {
          let externalArr = this.addStudyForm.value.arr[0].isExternalArr;
          // externalArr = externalArr ? externalArr :'';
          this.addStudyForm.value.arr.forEach((ele, i) => {
            if (index == i) {
              if (ele.isExternalArr == '' && externalArr != '') {
                this.toastr.error("A pet cannot be associated with internal and external studies simultaneously.");
                this.addStudyForm.controls.arr['controls'][i].patchValue({
                  "studyName": '',
                  "isExternalArr": ''
                })
              }
              if (ele.isExternalArr != '' && externalArr == '') {
                this.toastr.error("A pet cannot be associated with internal and external studies simultaneously.");
                this.addStudyForm.controls.arr['controls'][i].patchValue({
                  "studyName": '',
                  "isExternalArr": ''
                })
              }
            }
          })
        }


        this.spinner.hide();
      },
        err => {
          this.spinner.hide();
          this.toastr.error('Something went wrong. Please try after sometime or contact administrator.');
        }
      );
      this.addStudyForm.value.arr.forEach((ele, i) => {
        if (index == i) {
          this.addStudyForm.controls.arr['controls'][i].patchValue({
            "startDate": ele.studyName.startDate ? moment(new Date(ele.studyName.startDate)).format("MM-DD-YYYY") : '',
            "endDate": ele.studyName.endDate ? moment(new Date(ele.studyName.endDate)).format("MM-DD-YYYY") : ''
          });



          // this.addStudyForm.get('arr')['controls'][i].controls.studyassDate.setValidators([Validators.required]);
          // this.addStudyForm.get('arr')['controls'][i].controls.studyassDate.updateValueAndValidity();
        }
      });

    }
  }
  clearStudy(i) {
    // this.addStudyForm.get('arr')['controls'][i].controls.studyassDate.setValidators([]);
    // this.addStudyForm.get('arr')['controls'][i].controls.studyassDate.updateValueAndValidity();
  }

  addItem() {
    this.arr = this.addStudyForm.get('arr') as FormArray;
    this.arr.push(this.createItem());
  }

  removeItem(i: number) {
    this.arr = this.addStudyForm.get('arr') as FormArray;
    if (this.editFlag && this.arr.value[i].studyName.studyId) {
      //for removing the study ass data in device tab when study removed in study tab
      let studyId = this.arr.value[i].studyName.studyId;
      let result = [];
      let result1 = Object.assign({});
      let data = this.tabservice.getModelData();
      if (data.petDevice && data.petDevice.arr) {
        result = data.petDevice.arr.filter(ele => ele.study != studyId);
      }
      result1["arr"] = result;
      this.tabservice.setModelData(result1, 'petDevice');
    }
    this.arr.removeAt(i);
  }

  onSubmit($event) {
    console.log("addPlan", $event);

  }
  next() {
    // console.log("dsd")
    this.addStudyForm.markAllAsTouched();
    if (this.addStudyForm.valid) {
      //checking duplicates 
      let dup = this.addStudyForm.value.arr;
      let result = this.addStudyForm.value.arr.filter((thing, index, self) =>
        index === self.findIndex((t) => (
          t.studyName.studyId === thing.studyName.studyId
        ))
      );
      let result2 = this.addStudyForm.value.arr.filter((thing, index, self) =>
        index === self.findIndex((t) => (
          thing.externalPet != '' ? thing.externalPet.externalPetId : '' === thing.externalPet.externalPetId
        ))
      );

      if (result.length > 0 && dup.length != result.length) {
        if (result[0].studyName && result[0].studyName.studyId != '') {
          this.toastr.error('Study ' + result[0].studyName.studyName + ' already associated with the pet.');
          return;
        }
      }
      let externlPets = [];
      dup.forEach(element => {
        if (element.externalPet) {
          externlPets.push(element.externalPet.externalPetId);
        }
      });

      let filterDuplicates = externlPets => externlPets.filter((item, index) => externlPets.indexOf(item) != index);


      let duplicateExtPets = filterDuplicates(externlPets);

      if (duplicateExtPets.length > 0 && duplicateExtPets[0] != '') {
        this.toastr.error('External Pet already associated.');
        return;
      }
      // if(result2.length > 0 && dup.length != result2.length) {
      //   console.log(result2[0].externalPet,result2[0].externalPet.externalPetId);

      //   if(result2[0].externalPet && result2[0].externalPet.externalPetId != '') {
      //   this.toastr.error('External Pet already associated.');
      //   return;
      // }
      // }

      let editData1 = Object.assign({});
      let arr = [];
      this.addStudyForm.value.arr.forEach((ele, i) => {
        if (ele.studyName != '') {
          arr.push(ele);
        }
      });
      editData1["arr"] = arr;
      let data = this.tabservice.getModelData();
      if (arr.length > 0) {
        this.tabservice.setModelData(editData1, 'petStudy');
      }

      // if (!(data.hasOwnProperty('petStudy'))) {
      //   this.submitFlag = true;
      //   if (!this.editFlag)
      //     this.router.navigate(['/user/patients/add-patient/pet-parent-info']);
      //   else
      //     this.router.navigate([`/user/patients/edit-patient/${this.editId}/pet-parent-info`]);
      // }
      // else {
      this.submitFlag = true;
      if (!this.editFlag)
        this.router.navigate(['/user/patients/add-patient/pet-device']);
      else
        this.router.navigate([`/user/patients/edit-patient/${this.editId}/pet-device`]);
      // }
    }
    else {
      this.submitFlag = false;
    }

  }
  back() {

    if (!this.editFlag) {
      this.router.navigate(['/user/patients/add-patient/pet-info']);
    }
    else {
      this.router.navigate([`/user/patients/edit-patient/${this.editId}/pet-info`]);
    }
  }

  canDeactivate(component, route, state, next) {
    console.log('i am navigating away');
    console.log("routein basic", next.url);
    if (next.url.indexOf('/auth/login') > -1) {
      return true;
    }
    if (next.url.indexOf('/add-patient') > -1 || next.url.indexOf('/edit-patient') > -1) {
      this.addStudyForm.markAllAsTouched();
      if (this.addStudyForm.valid) {
        //checking if it has date and no study associated
        let stduEmptArr = [];
        this.addStudyForm.value.arr.forEach((ele, i) => {
          if (ele.studyassDate && ele.studyName == '') {
            stduEmptArr.push(ele);
          }
        })
        if (stduEmptArr.length > 0) {
          this.toastr.error('Study field cannot be empty.');
          return;
        }

        //checking duplicates 
        let dup = this.addStudyForm.value.arr;
        let result = this.addStudyForm.value.arr.filter((thing, index, self) =>
          index === self.findIndex((t) => (
            t.studyName.studyId === thing.studyName.studyId
          ))
        );
        let result2 = this.addStudyForm.value.arr.filter((thing, index, self) =>
          index === self.findIndex((t) => (
            t.externalPet != '' ? t.externalPet.externalPetId : '' === thing.externalPet.externalPetId
          ))
        );

        if (result.length > 0 && dup.length != result.length) {
          if (result[0].studyName && result[0].studyName.studyId != '') {
            this.toastr.error('Study ' + result[0].studyName.studyName + ' already associated with the pet.');
            return;
          }
        }
        let externlPets = [];
        dup.forEach(element => {
          if (element.externalPet) {
            externlPets.push(element.externalPet.externalPetId);
          }
        });
        let filterDuplicates = externlPets => externlPets.filter((item, index) => externlPets.indexOf(item) != index);
        let duplicateExtPets = filterDuplicates(externlPets);
        if (duplicateExtPets.length > 0 && duplicateExtPets[0] != '') {
          this.toastr.error('External Pet already associated.');
          return;
        }
        // if(result2.length > 0 && dup.length != result2.length) {
        //   if(result2[0].externalPet && result2[0].externalPet.externalPetId != '') {
        //   this.toastr.error('External Pet already associated.');
        //   return;
        // }
        // }

        this.submitFlag = true;
        let editData1 = Object.assign({});
        let arr = [];
        this.addStudyForm.value.arr.forEach((ele, i) => {
          if (ele.studyName != '') {
            arr.push(ele);
          }
        });
        editData1["arr"] = arr;
        if (arr.length > 0) {
          this.tabservice.setModelData(editData1, 'petStudy');
        }
        else {
          this.tabservice.removeModel('petStudy');
        }


      }
      else {
        this.submitFlag = false;
      }
    }
    else {
      let data = this.tabservice.getModelData() ? this.tabservice.getModelData() : {}
      if (this.addStudyForm.pristine == false || Object.keys(data).length > 0) {
        return this.alertService.confirm();
      }
      else {
        return true
      }
    }

    if (!this.submitFlag) {
      return false;
    }
    else {
      return true;
    }
  }
}
