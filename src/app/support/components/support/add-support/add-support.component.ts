import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SupportService } from 'src/app/support/support.service';
import { ToastrService } from 'ngx-toastr';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/components/alert-modal/alert.service';
import { AssetsService } from 'src/app/assets/components/assets.service';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ValidationService } from 'src/app/components/validation-message/validation.service';

@Component({
  selector: 'app-add-support',
  templateUrl: './add-support.component.html',
  styleUrls: ['./add-support.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddSupportComponent implements OnInit {
  supportForm: FormGroup;
  editProd: boolean = false;
  id: any = '';
  petParentId: any = '';
  resolutionList: any = '';
  submitFlag: boolean = false;

  assignedToList: any = [];
  ticketPriorities: any = [];
  statusList: any = [];
  petList: any = [];
  parentlist: any = [];
  contactMethodList: any = [];
  studyList: any = [];
  issueList: any = [];
  rootCauseList: any = [];
  sensorLocations: any = [];
  sensorList: any = [];
  inventoryStatusList: any = [];
  agentActionListInitial: any = [];
  agentActionListSecondary: any = [];
  agentActionListTertiary: any = [];
  defectiveSensorActionList: any = [];
  petId: any = '';
  studyId: any = '';
  issueId: any = '';
  secondary: boolean = false;
  tertiary: boolean = false;
  showOtherLocation: boolean = false;
  // inventoryType: any = '';
  validType: string[];
  selectedFile: any;
  RWFlag: boolean = false;
  list: any = [];
  fileIndex: number;

  public showDataTable: boolean = false;
  showDefectiveSensor: boolean = false;

  @ViewChild('archiveContent') archiveContent: ElementRef;
  @ViewChild('archiveContent2') archiveContent2: ElementRef;
  
  modalRef2: NgbModalRef;
  studyDetails: any;
  statusCopy: any;

  constructor(
    public router: Router,
    private fb: FormBuilder,
    private supportservice: SupportService,
    private toastr: ToastrService,
    private userService: UserDataService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private assetsService: AssetsService,
    private customDatePipe: CustomDateFormatPipe,
    private modalService: NgbModal
  ) { }

  async ngOnInit() {
    //permission for the module
    let userProfileData = this.userService.getRoleDetails();
    console.log("userProfileData", userProfileData);
    let menuActionId = '';
    userProfileData.rolePermissions && userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "37") {
        menuActionId = ele.menuActionId;
      }
    });
    if (menuActionId == "4") {
      this.RWFlag = true;
    }

    this.validType = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    this.buildForm();

    this.getInitialData();

    await this.activatedRoute.params.subscribe(async params => {
      const path = this.activatedRoute.snapshot.url[0].path;
      if (path === 'edit') {
        this.spinner.show();
        this.editProd = true;
        let str = this.router.url;
        //this.supportForm.controls['ticketTitle'].disable();
        this.id = str.split("edit/")[1].split("/")[0];
        this.supportservice.getSupportService(`/api/support/${this.id}`).subscribe(res => {
          if (res.status.success === true) {
            let customerSupport = res.response.customerSupport;
            this.resolutionList = customerSupport.resolutionList;

            this.getAgentAction(1);
            this.getAgentAction(2);
            this.getAgentAction(3);

            let uploadArr = [];
            customerSupport.uploadedFiles && customerSupport.uploadedFiles.forEach(ele => {
              uploadArr.push({ originalFileName: ele.originalFileName, gcFileName: ele.gcFileName, attachmentId: ele.attachmentId });
            })

            if (customerSupport.assignedTo || !this.RWFlag) {
              this.supportForm.patchValue({
                "userId": {
                  userId: customerSupport.assignedTo,
                  userName: customerSupport.assignedName
                }
              });
            }
            // else {
            //   if (this.RWFlag)
            //     this.supportForm.patchValue({
            //       "userId": {
            //         userId: this.userService.getUserId(),
            //         userName: this.userService.getUserDetails().userName.toString()
            //       }
            //     })
            // }

            this.supportForm.patchValue({
              "petId": {
                petId: customerSupport.petId,
                petName: customerSupport.petName,
              },
              "studyId": {
                studyId: customerSupport.studyId,
                studyName: customerSupport.studyName
              }
            });

            if (this.supportForm.value.petId.petId) {
              this.getParent();
            }
            //commented by Devi
            // if (this.supportForm.value.studyId.studyId) {
              this.getSensorName();
            // }
            
          

            this.supportForm.patchValue({
              "createdBy":customerSupport.createdBy,
              "mfgSerialNumber":customerSupport.mfgSerialNumber,
              "mfgMacAddr":customerSupport.mfgMacAddr,
              "wifiMacAddr":customerSupport.wifiMacAddr,
              "status": customerSupport.statusId,
              "petParentAddress": customerSupport.petParentAddress,
              "issueId": customerSupport.issueId,
              "sensorId": {
                sensorId: customerSupport.sensorId,
                sensorName: customerSupport.sensorName
              },
              "rootCauseId": customerSupport.rootCauseId,
              "storageLocationId": {
                storageLocationId: customerSupport.sensorLocationId,
                storageLocationName: customerSupport.sensorLocationName
              },
              "sensorOtherLocation": customerSupport.sensorOtherLocation,
              "studyStartDate": customerSupport.studyStartDate ? this.customDatePipe.transform(customerSupport.studyStartDate, 'MM-dd-yyyy') : '',
              "studyEndDate": customerSupport.studyEndDate ? this.customDatePipe.transform(customerSupport.studyEndDate, 'MM-dd-yyyy') : '',
              "studyStatus": customerSupport.studyStatus,
              "inventoryStatusId": {
                inventoryStatusId: customerSupport.inventoryStatusId,
                inventoryStatusName: customerSupport.inventoryStatusName,
                // type: customerSupport.inventoryType
              },
              "contactMethodId": customerSupport.contactMethodId,
              "priorityId": customerSupport.priorityId,
              "ticketTitle": customerSupport.ticketTitle,
              "petParentId": {
                petParentId: customerSupport.petParentId,
                petParentName: customerSupport.petParentName,
              },
              "petId": {
                petId: customerSupport.petId,
                petName: customerSupport.petName,
              },
              "studyId": {
                studyId: customerSupport.studyId,
                studyName: customerSupport.studyName
              },
              "notes": customerSupport.notes,

              "agentActionIdInitial": {
                agentActionId: customerSupport.agentSystemActionInitialId,
                agentActionName: customerSupport.agentSystemActionInitialName,
                showDefectiveSensor: customerSupport.agentSystemActionInitialShowDefective
              },
              "agentActionIdSecondary": {
                agentActionId: customerSupport.agentSystemActionSecondaryId,
                agentActionName: customerSupport.agentSystemActionSecondaryName,
                showDefectiveSensor: customerSupport.agentSystemActionSecondaryShowDefective
              },
              "agentActionIdTertiary": {
                agentActionId: customerSupport.agentSystemActionTertiaryId,
                agentActionName: customerSupport.agentSystemActionTertiaryName,
                showDefectiveSensor: customerSupport.agentSystemActionTertiaryShowDefective
              },
              "defectiveSensorActionId": customerSupport.defectiveSensorActionId === null ? '' : {
                defectiveSensorActionId: customerSupport.defectiveSensorActionId,
                defectiveSensorActionName: customerSupport.defectiveSensorActionName
              },
              "fileEdit": uploadArr,
              "ticketCreatedDate": this.customDatePipe.transform(customerSupport.ticketCreatedDate, 'MM/dd/yyyy HH:mm:ss'),

            });

            this.statusCopy = JSON.parse(JSON.stringify(this.supportForm.value.status));
            console.log("this.statusCopy",this.statusCopy)

            if (this.supportForm.value.issueId) {
              this.getRootCause(this.supportForm.value.issueId);
            }

            // if (this.supportForm.value.inventoryStatusId.type) {
            //   this.inventoryType = this.supportForm.value.inventoryStatusId.type;
            // }

            // if (this.supportForm.value.sensorId.sensorId !== null) {
            //   this.getInventoryStatus(this.supportForm.value.sensorId.sensorId);
            // }
            if (this.supportForm.value.sensorOtherLocation == '' || this.supportForm.value.sensorOtherLocation == null) {
              this.showOtherLocation = false;
            } else {
              this.showOtherLocation = true;
            }

            if (this.supportForm.value.agentActionIdSecondary.agentActionId !== '' || this.supportForm.value.agentActionIdSecondary.agentActionId !== null) {
              this.secondary = true;
            }

            if (this.supportForm.value.agentActionIdTertiary.agentActionId !== '' || this.supportForm.value.agentActionIdTertiary.agentActionId !== null) {
              this.tertiary = true;
            }
            this.clearDefective();

            this.spinner.hide();
          }
          this.clearDefective();
        })

       

      }
      else {
        this.editProd = false;
        this.spinner.hide();
      }

    });
  }

  changeStatus() {
    console.log("tktStatus",this.statusCopy);

    if(this.editProd) {
      this.openPopup(this.archiveContent2, 'xs');
      // if (confirm('Do you want to change the ticket status ?')) { 
      //   this.statusCopy = JSON.parse(JSON.stringify(this.supportForm.value.status));
      // }
      // else {
      //   this.supportForm.patchValue({
      //     status: this.statusCopy
      //   })
        
      // }

    }

  }
  changeValue() {
    this.statusCopy = JSON.parse(JSON.stringify(this.supportForm.value.status));
  }
  unChangeValue() {
    console.log("this.statusCopy",this.statusCopy)
    this.supportForm.patchValue({
          status: this.statusCopy
        })
  }

  deleteRecord(list, i) {
    this.list = list;
    this.fileIndex = i;
    this.openPopup(this.archiveContent, 'xs');
  }
  openPopup(div, size) {
    this.modalRef2 = this.modalService.open(div, {
      size: size,
      windowClass: 'smallModal',
      backdrop: 'static',
      keyboard: false
    });
    this.modalRef2.result.then((result) => {
      console.log(result);
    }, () => {
    });
  }
  deleteAttachment() {
    let fileName = [];
    fileName = this.list.toString().split(".");
    let reqObject = Object.assign({});
    this.supportForm.value.fileEdit.splice(this.fileIndex, 1);
    reqObject["attachmentId"] = parseInt(this.list.attachmentId);
    reqObject["fileName"] = this.list.gcFileName;
    reqObject["statusId"] = this.supportForm.value.status ? this.supportForm.value.status : 0;
    this.supportservice.updateSupport('/api/support/deleteFile', reqObject).subscribe(res => {
      this.spinner.show();
      if (res.status.success === true) {
        this.spinner.hide();
        this.toastr.success(`Attachment ${this.list.originalFileName} deleted from ticket# ${this.id}`);
        this.modalRef2.close();
        //  window.location.reload();
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      this.toastr.error(err.error?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
    });
  }


  async getInitialData() {
    this.spinner.show();
    await this.getTicketPriorities();
    await this.getAssignedTo();
    await this.getStatuses();
    await this.getPetName();
    await this.getContactMethod();
    await this.getIssueList();
    //    await this.getSensorName(0);
    await this.getSensorLocation();
    await this.getAgentAction(1);
    await this.getDefectiveSensorAction();
    await this.getParent()

  }

  getTicketPriorities() {
    this.supportservice.getSupportService('/api/lookup/getTicketPriorities').subscribe(res => {
      if (res.status.success === true) {
        this.ticketPriorities = res.response.ticketPriorities;
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      this.toastr.error(err.error?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });
  }
  // Assigned To
  getAssignedTo() {
    this.supportservice.getSupportService('/api/lookup/getUsers').subscribe(res => {
      if (res.status.success === true) {
        let userId = this.userService.getUserId();
        if (!this.RWFlag) {
          this.assignedToList = res.response.assignedUserList && res.response.assignedUserList.filter(item => item.userId == userId);
        }
        else {
          this.assignedToList = res.response.assignedUserList;
        }

      } else {
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      this.toastr.error(err.error?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });
  }
  // Status
  getStatuses() {
    this.supportservice.getSupportService('/api/lookup/getStatus').subscribe(res => {
      if (res.status.success === true) {
        this.statusList = res.response.statusList;
      } else {
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      this.toastr.error(err.error?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });
  }
  //Pet Name
  getPetName() {
    this.spinner.show();
    this.supportservice.getSupportService('/api/lookup/getPetName').subscribe(res => {
      if (res.status.success === true) {
        this.petList = res.response.petNameList;
      } else {
        this.toastr.error(res.errors[0].message);
      }
      this.spinner.hide();
    }, err => {
      this.toastr.error(err.error?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });
  }

  getParent() {
    this.supportForm.value.studyId = '';
    this.supportForm.value.petParentId = '';
    this.supportForm.value.petParentAddress = '';
    this.supportForm.patchValue({
      "petParentAddress": '',
      "petParentId": {
        petParentId: '',
        petParentName: '',
      },
      "studyId": {
        studyId: '',
        studyName: ''
      },

    })

    this.petId = this.supportForm.value.petId.petId ? this.supportForm.value.petId.petId : 0;
    this.spinner.show();
    this.supportservice.getSupportService(`/api/lookup/getPetParentName/${this.petId}`).subscribe(res => {
      if (res.status.success === true) {
        this.parentlist = res.response.petNameList;
        console.log(this.parentlist.length);
        if (!this.parentlist.length) {
          this.supportForm.patchValue({
            "petParentId": '',
            "petParentAddress": ''
          })
        }
        if (this.parentlist.length == 1) {
          this.supportForm.patchValue({
            "petParentId": {
              petParentId: this.parentlist[0].petParentId,
              petParentName: this.parentlist[0].petParentName,
            },
            "petParentAddress": this.parentlist[0].petParentAddress
          });
        }
        this.spinner.hide();
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });
    //get study
    this.supportservice.getSupportService(`/api/lookup/getStudyName/${this.petId}`).subscribe(res => {
      if (res.status.success === true) {
        this.studyList = res.response.studyNameList;
        this.spinner.hide();
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });
  }

  clearPetDetails() {
    this.supportForm.value.studyId = '';
    this.supportForm.value.petParentId = '';
    this.supportForm.value.petParentAddress = '';
    this.supportForm.patchValue({
      "petParentAddress": '',
      "petParentId": {
        petParentId: '',
        petParentName: '',
      },
      "studyId": {
        studyId: '',
        studyName: ''
      },
      "storageLocationId": {
        storageLocationId: '',
        storageLocationName: ''
      },
      "sensorId": {
        sensorId: '',
        sensorName: '',
      },
      "inventoryStatusId": {
        inventoryStatusId: '',
        inventoryStatusName: ''
      }
    });
    this.getParent();
    this.getSensorName();
  }
  clearStudyDetails() {
    this.supportForm.value.sensorId = '';
    this.supportForm.value.storageLocationId = '';
    this.supportForm.value.sensorOtherLocation = '';
    this.supportForm.value.inventoryStatusId = '';
    this.supportForm.patchValue({
      "sensorId": {
        sensorId: '',
        sensorName: '',
      },
      "inventoryStatusId": {
        inventoryStatusId: '',
        inventoryStatusName: ''
      },
      "storageLocationId": '',
      "sensorOtherLocation": ''
    });
  }
  clearSensorDetails() {
    this.supportForm.patchValue({
      "inventoryStatusId": {
        inventoryStatusId: '',
        inventoryStatusName: ''
      },
      "storageLocationId": '',
      "sensorOtherLocation": ''
    });
  }

  getParentAdress($event) {
    if ($event.petParentAddress !== null || $event.petParentAddress !== '') {
      this.supportForm.patchValue({
        "petParentAddress": $event.petParentAddress
      });
    } else {
      this.supportForm.patchValue({
        "petParentAddress": ''
      });
    }
  }

  //Issue
  getIssueList() {
    this.supportservice.getSupportService(`/api/lookup/getIssue`).subscribe(res => {
      if (res.status.success === true) {
        this.issueList = res.response.issueList;
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      this.toastr.error(err.error?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });
  }
  //rootcause
  getRootCause(issueId) {
    if (issueId === "null") {
      this.supportForm.patchValue({
        'rootCauseId': null
      })
      return
    } else {
      this.spinner.show();
      //this.issueId = $event.target.value.split(':')[1].trim();
      this.supportservice.getSupportService(`/api/lookup/getRootCause/${issueId}`).subscribe(res => {
        if (res.status.success === true) {
          this.rootCauseList = res.response.rootCauseList;
          this.spinner.hide();
        }
        else {
          this.toastr.error(res.errors[0].message);
          this.spinner.hide();
        }
      }, err => {
        this.spinner.hide();
        this.toastr.error(err.error?.message || 'Something went wrong. Please try after sometime or contact administrator.');
      });
    }
  }

  //SensorName
  getSensorName() {
   
    this.studyId = this.supportForm.value.studyId.studyId ? this.supportForm.value.studyId.studyId : 0;
    this.petId = this.supportForm.value.petId.petId ? this.supportForm.value.petId.petId : 0;
    this.studyList.forEach(element => {
      if (this.studyId === element.studyId) {
        this.studyDetails = element;
        console.log("this.studyDetails", this.studyDetails);
        this.supportForm.patchValue({
          'studyStatus': this.studyDetails.status ? this.studyDetails.status : false,
          'studyStartDate': this.studyDetails.startDate ? this.customDatePipe.transform(this.studyDetails.startDate, 'MM-dd-yyyy') : '',
          'studyEndDate': this.studyDetails.endDate ? this.customDatePipe.transform(this.studyDetails.endDate, 'MM-dd-yyyy') : '',
        })
      }
    });
    this.supportservice.getSupportService(`/api/lookup/getSensorName/${this.studyId}/${this.petId}`).subscribe(res => {
      if (res.status.success === true) {
        this.sensorList = res.response.sensorNameList;
        console.log("this.sensorList[0]",this.sensorList);
        if (!this.sensorList.length) {
          this.supportForm.patchValue({
            "sensorId": '',
            "storageLocationId": '',
            "inventoryStatusId": '',
          })
        }
       
        if (this.sensorList.length == 1) {
          console.log("this.sensorList[0]",this.sensorList[0]);
          this.supportForm.patchValue({
            "storageLocationId": {
              storageLocationId: this.sensorList[0].sensorLocationId,
              storageLocationName: this.sensorList[0].sensorLocationName
            },
            "sensorId": {
              sensorId: this.sensorList[0].sensorId,
              sensorName: this.sensorList[0].sensorName,
            },
            "inventoryStatusId": {
              inventoryStatusId: this.sensorList[0].sensorStatusId,
              inventoryStatusName: this.sensorList[0].sensorStatusName
            },
            "mfgSerialNumber":this.sensorList[0].mfgSerialNumber,
            "mfgMacAddr":this.sensorList[0].mfgMacAddr,
            "wifiMacAddr":this.sensorList[0].wifiMacAddr,
          })
        }
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      this.toastr.error(err.error?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });
  }
  //SensorLocation
  getSensorLocation() {
    this.supportservice.getSupportService(`/api/lookup/getSensorLocation`).subscribe(res => {
      if (res.status.success === true) {
        this.sensorLocations = res.response.sensorLocationList;
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      this.toastr.error(err.error?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });
  }

  clearOtherLocation($event) {
    let locationid = $event.storageLocationId;
    if (locationid !== 4) {
      this.showOtherLocation = false;
      this.supportForm.value.sensorOtherLocation = '';
    } else {
      this.showOtherLocation = true;
    }
  }

  //get Inventory Status
  getInventoryStatus($event) {
    //let deviceId = $event.sensorId;
    // console.log($event);
    // this.sensorLocations = [{
    //   storageLocationId: $event.sensorLocation,
    //   storageLocationName: $event.sensorLocationName
    // }];
    // this.inventoryStatusList = [{
    //   inventoryStatusId: $event.sensorStatusId,
    //   inventoryStatusName: $event.sensorStatusName
    // }];
console.log("$eventtt", $event)
    this.supportForm.patchValue({
      "storageLocationId": {
        storageLocationId: $event.sensorLocation,
        storageLocationName: $event.sensorLocationName
      },
      "inventoryStatusId": {
        inventoryStatusId: $event.sensorStatusId,
        inventoryStatusName: $event.sensorStatusName
      },
      "mfgSerialNumber":$event.mfgSerialNumber,
      "mfgMacAddr":$event.mfgMacAddr,
      "wifiMacAddr":$event.wifiMacAddr
    })
    // this.supportservice.getSupportService(`/api/lookup/getInventoryStatus/${deviceId}`).subscribe(res => {
    //   if (res.status.success === true) {
    //     this.inventoryStatusList = res.response.inventoryStatusList;
    //     this.spinner.hide();
    //   }
    //   else {
    //     this.toastr.error(res.errors[0].message);
    //     this.spinner.hide();
    //   }
    // }, err => {
    //   this.spinner.hide();
    //   this.toastr.error(err.error?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    // });

  }
  //Contact method
  getContactMethod() {
    this.supportservice.getSupportService('/api/lookup/getContactMethod').subscribe(res => {
      if (res.status.success === true) {
        this.contactMethodList = res.response.contactMethodList;
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      this.toastr.error(err.error?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });
  }
  //getAgentAction
  getAgentAction(id) {
    this.spinner.show();
    this.supportservice.getSupportService(`/api/lookup/getAgentAction/${id}`).subscribe(res => {
      if (res.status.success === true) {
        if (id == 1) {
          this.agentActionListInitial = res.response.agentActionList;
        }
        if (id == 2) {
          this.agentActionListSecondary = res.response.agentActionList;
        }
        if (id == 3) {
          this.agentActionListTertiary = res.response.agentActionList;
        }
        this.spinner.hide();
      }
      else {
        this.spinner.hide();
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });
  }

  displayAgentActionSecondary() {
    this.getAgentAction(2);
    this.secondary = true;
    this.checkDefective();
  }

  displayAgentActionTertiary() {
    this.getAgentAction(3);
    this.tertiary = true;
    this.checkDefective();
  }

  checkDefectiveTertiary() {
    this.checkDefective();
  }

  checkDefective() {
    if (this.supportForm.value.agentActionIdInitial.showDefectiveSensor == 1 || this.supportForm.value.agentActionIdSecondary.showDefectiveSensor == 1 || this.supportForm.value.agentActionIdTertiary.showDefectiveSensor == 1) {
      this.showDefectiveSensor = true;
      this.supportForm.controls['defectiveSensorActionId'].setValidators([Validators.required]);
      this.supportForm.controls['defectiveSensorActionId'].updateValueAndValidity();
    } else {
      this.showDefectiveSensor = false;
      this.supportForm.controls['defectiveSensorActionId'].clearValidators();
      this.supportForm.controls['defectiveSensorActionId'].updateValueAndValidity();
    }
  }

  clearDefective() {

    if (!this.supportForm.value.agentActionIdInitial.agentActionId) {
      this.supportForm.patchValue({
        "agentActionIdSecondary": {
          agentActionId: '',
          agentActionName: '',
        },
        "agentActionIdTertiary": {
          agentActionId: '',
          agentActionName: '',
        }
      })
      this.secondary = false;
    }
    if (!this.supportForm.value.agentActionIdSecondary.agentActionId) {
      this.supportForm.patchValue({
        "agentActionIdTertiary": {
          agentActionId: '',
          agentActionName: '',
        }
      })
      this.tertiary = false;
    }
    this.checkDefective();
    if (!this.showDefectiveSensor) {
      this.supportForm.patchValue({
        "defectiveSensorActionId": null
      })
    }
  }

  //defective Sensor Action
  getDefectiveSensorAction() {
    this.supportservice.getSupportService('/api/lookup/getDefectiveSensorAction').subscribe(res => {
      if (res.status.success === true) {
        this.defectiveSensorActionList = res.response.defectiveSensorActionList;
      }
      else {
        this.toastr.error(res.errors[0].message);
      }
    }, err => {
      this.toastr.error(err.error?.message || 'Something went wrong. Please try after sometime or contact administrator.');
    });
  }

  changeInventoryStatus($event) {
    let sensorId = $event.defectiveSensorActionId;
  }

  public buildForm(): void {
    this.supportForm = this.fb.group({
      ticketTitle: ['', [Validators.required, ValidationService.exceptSpecialChar]],
      priorityId: [null, [Validators.required]],
      petParentId: [''],
      petId: [''],
      contactMethodId: [null, [Validators.required]],
      studyId: [''],
      studyStartDate: [''],
      studyEndDate: [''],
      studyStatus: [''],
      ticketCategoryId: [''],
      notes: [''],
      userId: [''],
      status: [1, [Validators.required]],
      petParentAddress: [''],
      issueId: [null],
      sensorId: [''],
      rootCauseId: [null],
      storageLocationId: [''],
      sensorOtherLocation: [''],
      inventoryStatusId: [''],
      agentActionIdInitial: [''],
      agentActionIdSecondary: [''],
      agentActionIdTertiary: [''],
      defectiveSensorActionId: [''],
      file: [''],
      fileEdit: [''],
      ticketCreatedDate: [''],
      createdBy:[''],
      mfgSerialNumber:[''],
      mfgMacAddr:[''],
      wifiMacAddr:['']
    })
  }

  async updateCustomerSupport() {
    console.log(this.supportForm);
    if (!this.supportForm.valid) {
      this.supportForm.markAllAsTouched();
      return false;
    }
    this.submitFlag = true;

    let reqObject = Object.assign({});
    reqObject["ticketTitle"] = this.supportForm.value.ticketTitle ? this.supportForm.value.ticketTitle : '';
    reqObject["priorityId"] = this.supportForm.value.priorityId ? this.supportForm.value.priorityId : null;
    reqObject["assignedTo"] = this.supportForm.value.userId.userId ? this.supportForm.value.userId.userId : null;
    reqObject["statusId"] = this.supportForm.value.status ? this.supportForm.value.status : null;
    reqObject["petParentAddress"] = this.supportForm.value.petParentAddress ? this.supportForm.value.petParentAddress : '';
    reqObject["studyId"] = this.supportForm.value.studyId.studyId ? this.supportForm.value.studyId.studyId : null;
    reqObject["sensorId"] = this.supportForm.value.sensorId.sensorId ? this.supportForm.value.sensorId.sensorId : null;
    reqObject["notes"] = this.supportForm.value.notes ? this.supportForm.value.notes : '';
    let uploadedFileResponse = [];
    if (this.selectedFile && this.selectedFile.length > 0) {
      uploadedFileResponse = await this.uploadTemplate();
    }
    console.log(uploadedFileResponse);
    if (this.editProd) {
      reqObject["ticketId"] = this.id;
      reqObject["petNameId"] = this.supportForm.value.petId.petId ? this.supportForm.value.petId.petId : null;
      reqObject["petParentNameId"] = this.supportForm.value.petParentId.petParentId ? this.supportForm.value.petParentId.petParentId : null;
      reqObject["contactMethodId"] = this.supportForm.value.contactMethodId ? this.supportForm.value.contactMethodId : null;
      reqObject["issueId"] = this.supportForm.value.issueId ? this.supportForm.value.issueId : null;
      reqObject["rootCauseId"] = this.supportForm.value.rootCauseId ? this.supportForm.value.rootCauseId : null;
      if (this.supportForm.value.storageLocationId.storageLocationId == 4) {
        reqObject["sensorLocationId"] = 4;
        reqObject["sensorOtherLocation"] = this.supportForm.value.sensorOtherLocation ? this.supportForm.value.sensorOtherLocation : null;
      } else {
        reqObject["sensorLocationId"] = this.supportForm.value.storageLocationId.storageLocationId ? this.supportForm.value.storageLocationId.storageLocationId : null;
        reqObject["sensorOtherLocation"] = null;
      }
      reqObject["inventoryStatusId"] = this.supportForm.value.inventoryStatusId.inventoryStatusId ? this.supportForm.value.inventoryStatusId.inventoryStatusId : null;
      // if (this.inventoryType == "inventory") {
      //   reqObject["inventoryStatusId"] = this.supportForm.value.inventoryStatusId.inventoryStatusId ? this.supportForm.value.inventoryStatusId.inventoryStatusId : null;
      //   reqObject["inventoryStudyStatus"] = null
      // } else {
      //   reqObject["inventoryStudyStatus"] = this.supportForm.value.inventoryStatusId.inventoryStatusId ? this.supportForm.value.inventoryStatusId.inventoryStatusId : null;
      //   reqObject["inventoryStatusId"] = null;
      // }

      reqObject["agentSystemActionInitialId"] = this.supportForm.value.agentActionIdInitial.agentActionId ? this.supportForm.value.agentActionIdInitial.agentActionId : null;
      reqObject["agentSystemActionSecondaryId"] = this.supportForm.value.agentActionIdSecondary.agentActionId ? this.supportForm.value.agentActionIdSecondary.agentActionId : null;
      reqObject["agentSystemActionTertiaryId"] = this.supportForm.value.agentActionIdTertiary.agentActionId ? this.supportForm.value.agentActionIdTertiary.agentActionId : null;
      reqObject["defectiveSensorActionId"] = this.supportForm.value.defectiveSensorActionId && this.supportForm.value.defectiveSensorActionId.defectiveSensorActionId ? this.supportForm.value.defectiveSensorActionId.defectiveSensorActionId : null;
      if (uploadedFileResponse && uploadedFileResponse.length > 0) {
        reqObject["uploadedFileNames"] = uploadedFileResponse;
      }
      this.supportservice.updateSupport('/api/support', reqObject).subscribe(res => {
        this.spinner.show();
        if (res.status.success === true) {
          this.spinner.hide();
          this.toastr.success(`Ticket ${this.id} updated successfully!`);
          this.supportForm.markAsPristine();
          this.backToList();
        }
        else {
          this.toastr.error(res.errors[0].message);
        }
      }, err => {
        this.toastr.error(err.error?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
      });
    } else {

      reqObject["petName"] = this.supportForm.value.petId.petId ? this.supportForm.value.petId.petId : null;
      reqObject["petParentName"] = this.supportForm.value.petParentId.petParentId ? this.supportForm.value.petParentId.petParentId : null;
      reqObject["contactMethod"] = this.supportForm.value.contactMethodId ? this.supportForm.value.contactMethodId : null;
      reqObject["issue"] = this.supportForm.value.issueId ? this.supportForm.value.issueId : null;
      reqObject["rootCause"] = this.supportForm.value.rootCauseId ? this.supportForm.value.rootCauseId : null;
      if (this.supportForm.value.storageLocationId.storageLocationId == 4) {
        reqObject["sensorLocation"] = 4;
        reqObject["sensorOtherLocation"] = this.supportForm.value.sensorOtherLocation ? this.supportForm.value.sensorOtherLocation : null;
      } else {
        reqObject["sensorLocation"] = this.supportForm.value.storageLocationId.storageLocationId ? this.supportForm.value.storageLocationId.storageLocationId : null;
        reqObject["sensorOtherLocation"] = null;
      }
      reqObject["inventoryStatus"] = this.supportForm.value.inventoryStatusId.inventoryStatusId ? this.supportForm.value.inventoryStatusId.inventoryStatusId : null;
      // if (this.inventoryType == "inventory") {
      //   reqObject["inventoryStatus"] = this.supportForm.value.inventoryStatusId.inventoryStatusId ? this.supportForm.value.inventoryStatusId.inventoryStatusId : null;
      //   reqObject["inventoryStudyStatus"] = null
      // } else {
      //   reqObject["inventoryStudyStatus"] = this.supportForm.value.inventoryStatusId.inventoryStatusId ? this.supportForm.value.inventoryStatusId.inventoryStatusId : null;
      //   reqObject["inventoryStatus"] = null;
      // }
      reqObject["agentSystemActionInitial"] = this.supportForm.value.agentActionIdInitial.agentActionId ? this.supportForm.value.agentActionIdInitial.agentActionId : null;
      reqObject["agentSystemActionSecondary"] = this.supportForm.value.agentActionIdSecondary.agentActionId ? this.supportForm.value.agentActionIdSecondary.agentActionId : null;
      reqObject["agentSystemActionTertiary"] = this.supportForm.value.agentActionIdTertiary.agentActionId ? this.supportForm.value.agentActionIdTertiary.agentActionId : null;
      reqObject["defectiveSensorAction"] = this.supportForm.value.defectiveSensorActionId && this.supportForm.value.defectiveSensorActionId.defectiveSensorActionId ? this.supportForm.value.defectiveSensorActionId.defectiveSensorActionId : null;
      if (uploadedFileResponse && uploadedFileResponse.length > 0) {
        reqObject["uploadedFileNames"] = uploadedFileResponse;
      }
      this.supportservice.addSupportService('/api/support', reqObject).subscribe(res => {
        this.spinner.show();
        if (res.status.success === true) {
          this.spinner.hide();
          this.toastr.success('Ticket added successfully!');
          this.supportForm.markAsPristine();
          this.backToList();
        }
        else {
          this.toastr.error(res.errors[0].message);
        }
      }, err => {
        this.toastr.error(err.error?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
      });
    }
  }
  backToList() {
    this.router.navigate(['/user/support']);
  }

  canDeactivate(component, route, state, next) {
    if (next.url.indexOf('/auth/login') > -1) {
      return true;
    }
    if (next.url.indexOf('/user/support') > -1 && this.submitFlag) {
      return true;
    }
    if (this.supportForm.pristine == false ) { //|| this.supportForm.dirty == false
      return this.alertService.confirm();
    }
    else {
      return true;
    }
  }

  // inventoryStatus($event) {
  //   this.inventoryType = $event.type;
  // }
  selectFileResult(event) {
    console.log("event fired for", event);
    this.selectedFile = '';
    if (event.length == 0) {
      // this.toastr.error('Invalid file format (Valid formats are .xlsx).', 'Error!');
      return false;
    }
    this.selectedFile = event;
    console.log("this.selectedFile", this.selectedFile);
    // this.uploadTemplate();
  }
  async uploadTemplate() {
    if (this.selectedFile && this.selectedFile.length == 0) {
      this.toastr.error('Please select a valid file for uploading.', 'Error!');
      return;
    }
    let formData = new FormData();
    this.selectedFile && this.selectedFile.forEach(element => {
      formData.append("file", element);
    });
    formData.append("moduleName", 'CustomerSupport');
    this.spinner.show();
    let data = await this.assetsService.bulkUpload('/api/fileUpload/bulkUpload', formData).toPromise();
    if (data.response && data.response.length > 0) {
      return data.response;
    } else {
      return [];
    }
    /* this.assetsService.bulkUpload('/api/fileUpload/bulkUpload', formData).subscribe(res => {
      console.log(res);
      this.spinner.hide();
      if (res && res.response > 0 && res.status.success) {
        // this.reloadDataTable();
        debugger;
        return res;
      } else {
        this.toastr.error('Please select a valid file for uploading.', 'Error!');
      }
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.errors[0]?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
    }); */
  }

}
