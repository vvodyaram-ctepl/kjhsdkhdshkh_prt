import { Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserDataService } from 'src/app/services/util/user-data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssetsService } from '../../assets.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileUploadComponent } from 'src/app/components/file-upload/file-upload/file-upload.component';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss']
})
export class BulkUploadComponent implements OnInit {
  headers: any;
  validType:any;
  file:any;
  filterTypeArr: any[];
  RWFlag: boolean;
  selectedItem: any = '';
  selectedFile: any;
  public showDataTable: boolean = false;
  selectable: object = {
    title: '',
    selectAll: true
  };
  selectedRecordsEvent: any;
  isUpload: boolean;
  @ViewChild(FileUploadComponent) fileAttachmentRef: FileUploadComponent;

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private userDataService: UserDataService,
    private modalService: NgbModal,
    private assetsService: AssetsService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {

    this.validType = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.ms-excel'];
    //permission for the module
    let userProfileData = this.userDataService.getRoleDetails();
    console.log("userProfileData", userProfileData);
    let menuActionId = '';
    userProfileData.rolePermissions.forEach(ele => {
      if (ele.menuId == "17") {
        menuActionId = ele.menuActionId;
      }
    });
    if (menuActionId == "3") {
      this.RWFlag = true;
    }
    this.headers = [
      { key: "deviceNumber", label: "Asset Number", checked: true },
      { key: "deviceType", label: "Asset Type", checked: true },
      { key: "deviceModel", label: "Asset Model", checked: true },
      { key: "deviceLocationName", label: "Asset Location", checked: true },
      { key: "mfgSerialNumber", label: "Manufacturer Serial Number", checked: true },
      { key: "mfgFirmware", label: "Manufacturer Firmware", checked: true },
      { key: "mfgMacAddr", label: "Bluetooth MAC Address", checked: true },
      { key: "wifiMacAddr", label: "Wifi MAC Address", checked: true },
      { key: "trackingNumber", label: "Tracking Number", checked: true },
      { key: "exceptionMsg", label: "Exception", checked: true }
    ];
    this.filterTypeArr =
      [{
        name: "Study",
        id: "Study"
      },
      {
        name: "Device Type",
        id: "deviceType"
      }
      ];
    
  }

  formatter($event) {
    console.log($event);
    if($event.length == 0){
      this.showDataTable = false;
    }
    $event.forEach(ele => {
      ele.id = ele.rnum;
    //  console.log(this.selectable);
     // console.log(ele);
      
      
      if(ele.exceptionMsg && ele.exceptionMsg.trim() !=''){
        ele.exceptionMsg = ele.exceptionMsg.replace(/ *, */g, ',<br>')
        ele.disabled = true;
      }
      if (ele.isActive == true) {
        ele.isActive = "Active";
        ele['columnCssClass']['isActive'] = "active-status";
      } else {
        ele.isActive = "Inactive";
        ele['columnCssClass']['isActive'] = "inactive-status";
      }
    });
  }

  downloadBulkUpload() {
    //alert("File download.")
    this.spinner.show(); 
    
    this.assetsService.downloadExcel('/api/assets/downloadFile').subscribe(res => {
        console.log(res);
        this.spinner.hide();
        
        // create a new Blob by defining its content-type -- octet-stream
        let file = new Blob([res], { type: 'application/vnd.ms-excel' }); 
        const link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.download = "Bulk Asset Upload Template.xlsx";
        link.target = "_blank";
        link.click();

    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.errors[0] ?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
    });
  }
  selectedRecords($event) {
    console.log("$event", $event);
    this.selectedRecordsEvent = $event;
  }
  backToList() {
    this.router.navigate(['/user/assets/management']);
  }
  selectFileResult(event) {
    console.log("event fired for",event);
    if(event.length == 0){
      console.log("sghdshd");
       this.showDataTable = false;
    }
    this.selectedFile = '';
    
    // if (event.length == 0) {
    //   this.toastr.error('Invalid file format (Valid formats are .xlsx).', 'Error!');
    //   return false;
    // }
    if(event.length > 0){
      this.selectedFile = event[0];
      this.uploadTemplate();
    }
    else {
      this.selectedFile = '';
      this.file = '';
    }
  }
  uploadTemplate() {
    if(!this.selectedFile || !this.selectedFile.name){
      this.toastr.error('Kindly complete the template and upload.', 'Error!');
      return;
    }
    let formData = new FormData();
    formData.append("file",this.selectedFile);

    this.spinner.show();
    this.assetsService.bulkUpload('/api/assets/bulkAssetUpload', formData ).subscribe(res => {
        console.log(res);
        this.spinner.hide();
        if(res && res.response > 0 && res.status.success){
          this.reloadDataTable();
        }else{
          this.toastr.error('Please select a valid file for uploading.', 'Error!');
        }
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.errors[0] ?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
    });
  }
  save(){
    
    if(this.selectedRecordsEvent.length > 0){
      let selectedIds = [];
      this.selectedRecordsEvent.forEach(element => {
        selectedIds.push(element.stagingId);
      });
      let res = Object.assign({});
      res["stagingId"]= selectedIds.toString();
        this.spinner.show();
        this.assetsService.saveBulkUploadRecords('/api/assets/saveBulkUploadDevicesInfo', res ).subscribe(res => {
            console.log(res);
            this.spinner.hide();
            if(res && res.status.success){
              this.fileAttachmentRef.deleteAttachment(0);
              this.toastr.success('Assets added successfully!');
              this.reloadDataTable();
            }else {
              this.toastr.error(res.errors[0].message);
            }
        }, err => {
          this.spinner.hide();
          this.toastr.error(err.error.errors[0] ?.message || 'Something went wrong. Please try after sometime or contact administrator.!');
        });
    }else{
      this.toastr.error('Please atlest one record.', 'Error!');
      return;
    }
  }
  reloadDataTable(){
    this.showDataTable = false;
    setTimeout(()=>{
      this.showDataTable = true;
    },500);
  }
  back(){
    this.router.navigate(['/user/assets/management']);
  }
}
