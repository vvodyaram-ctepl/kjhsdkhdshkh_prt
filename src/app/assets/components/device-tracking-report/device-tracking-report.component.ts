import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';

@Component({
  selector: 'app-device-tracking-report',
  templateUrl: './device-tracking-report.component.html',
  styleUrls: ['./device-tracking-report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DeviceTrackingReportComponent implements OnInit {
  reportName: string;
  reportNameInfo: string;

  headers: any;
  filterTypeArr: any[];
  report_type: any = 1;
  reportUrl = "";
  showDataTable: boolean = true;
  studyAll: boolean = false;
  constructor(
    private customDatePipe: CustomDateFormatPipe
  ) { }

  ngOnInit() {
    this.onChangeReport();
  }
  public reloadDatatable() {
    this.showDataTable = false;
    setTimeout(() => {
      this.showDataTable = true;
    }, 1);
  }
  onChangeReport() {
    if (this.report_type == "1") {
      this.reportName = "Asset Details Report";
      this.reportNameInfo = "assetDetailsReport";
      console.log(this.reportNameInfo);
      this.studyAll = false;
      this.reloadDatatable();
      this.headers = [
        { key: "deviceType", label: "ASSET TYPE", checked: true },
        { key: "deviceModel", label: "ASSET MODEL", checked: true },
        { key: "deviceNumber", label: "ASSET NUMBER", checked: true },
        { key: "startDate", label: "ASSET LIFECYCLE START DATE ", checked: true },
        { key: "mfgSerialNumber", label: "MFG SERIAL NUMBER", checked: true },
        { key: "mfgFirmware", label: "MFG FIRMWARE", checked: true },
        { key: "assetStatus", label: "ASSET STATUS", checked: true }
      ];
      this.reportUrl = "/api/reports/getDeviceDetailsReport";

      this.filterTypeArr =
        [{
          name: "Asset Type",
          id: "deviceType"
        },
        {
          name: "Asset Model",
          id: "Model"
        },
        {
          name: "Asset Status",
          id: "assetStatus"
        }
        ];

    }
    else if (this.report_type == "2") {
      this.reportName = "Asset Tracking Report";
      this.reportNameInfo = "assetTrackingReport";
      this.studyAll = true;
      this.reloadDatatable();
      this.headers = [
        { key: "deviceType", label: "ASSET TYPE", checked: true },
        { key: "deviceModel", label: "ASSET MODEL", checked: true },
        { key: "deviceNumber", label: "ASSET NUMBER", checked: true },
        { key: "assetStatus", label: "ASSET STATUS", checked: true, width: 100 },
        { key: "currentPetName", label: "CURRENT PET NAME", checked: true },
        { key: "currentStudyName", label: "CURRENT STUDY NAME", checked: true },
        { key: "currentLocation", label: "CURRENT LOCATION", checked: true, width: 160 },
        { key: "currentBatteryLevel", label: "CURRENT BATTERY LEVEL", checked: true, width: 125 },
      ];
      this.reportUrl = "";
      this.reportUrl = "/api/reports/getDeviceTrackingReport";
      this.filterTypeArr =
        [{
          name: "Asset Type",
          id: "deviceType"
        },
        {
          name: "Asset Model",
          id: "Model"
        },
        {
          name: "Asset Status",
          id: "assetStatus"
        }
        ];
    }
    else if (this.report_type == "3") {
      this.reportName = "Asset History Report";
      this.reportNameInfo = "assetHistoryReport";
      this.studyAll = false;
      this.reloadDatatable();
      this.headers = [
        { key: "deviceType", label: "ASSET TYPE", checked: true },
        { key: "deviceModel", label: "ASSET MODEL", checked: true },
        { key: "deviceNumber", label: "ASSET NUMBER", checked: true },
        { key: "assignmentHistory", label: "ASSIGNMENT HISTORY", checked: true }
      ];
      this.reportUrl = "/api/reports/getDeviceHistoryReport";
      this.filterTypeArr =
        [{
          name: "Asset Type",
          id: "deviceType"
        },
        {
          name: "Asset Model",
          id: "Model"
        }
        ];

    }
    else if (this.report_type == "4") {
      this.reportName = "Asset Inventory Report";
      this.reportNameInfo = "assetInventoryReport";
      this.studyAll = false;
      this.reloadDatatable();
      this.headers = [
        { key: "deviceType", label: "ASSET TYPE", checked: true },
        { key: "deviceModel", label: "ASSET MODEL", checked: true },
        { key: "totalDevices", label: "TOTAL NO.OF ASSETS", checked: true },
        { key: "inUseDevices", label: "NO. OF ASSETS IN USE", checked: true },
        { key: "availableDevices", label: "NO. OF ASSETS AVILABLE FOR ASSIGNMENT", checked: true },
        { key: "malfunctionedDevices", label: "NO. OF ASSETS MALFUNCTIONED ", checked: true },

      ];
      this.reportUrl = "/api/reports/getDeviceInventoryReport";
      this.filterTypeArr =
        [{
          name: "Asset Type",
          id: "deviceType"
        },
        {
          name: "Asset Model",
          id: "Model"
        }
        ];

    }
    else if (this.report_type == "5") {
      this.reportName = "Asset Malfunction Report";
      this.reportNameInfo = "assetMalfunctionReport";
      this.studyAll = true;
      this.reloadDatatable();
      this.headers = [
        { key: "studyName", label: "STUDY NAME", checked: true },
        { key: "deviceType", label: "ASSET TYPE", checked: true },
        { key: "deviceNumber", label: "ASSET NUMBER", checked: true },
        { key: "note", label: "MALFUNCTIONING REASON", checked: true },
        { key: "unAssignDate", label: "MALFUNCTIONED ON", checked: true }
      ];
      this.reportUrl = "/api/reports/getDeviceMalfunctionReport";
      this.filterTypeArr =
        [{
          name: "Asset Type",
          id: "deviceType"
        },
        {
          name: "Study",
          id: "Study"
        }
        ];

    }
    else if (this.report_type == "6") {
      this.reportName = "Study Based Report";
      this.reportNameInfo = "studyBasedReport";
      this.studyAll = true;
      this.reloadDatatable();
      this.headers = [
        { key: "studyName", label: "STUDY NAME", checked: true },
        { key: "petName", label: "PET NAME", checked: true },
        { key: "deviceType", label: "ASSET TYPE", checked: true },
        { key: "deviceModel", label: "ASSET MODEL", checked: true },
        { key: "deviceNumber", label: "ASSET NUMBER", checked: true },
        { key: "status", label: "STUDY STATUS", checked: true },
        { key: "assetStatus", label: "ASSET STATUS", checked: true },
        { key: "currentBatteryLevel", label: "CURRENT BATTERY LEVEL", checked: true },
      ];
      this.reportUrl = "/api/reports/getStudyBasedReport";
      this.filterTypeArr =
        [{
          name: "Asset Type",
          id: "deviceType"
        },
        {
          name: "Asset Model",
          id: "Model"
        },
        {
          name: "Study",
          id: "Study"
        },
        {
          name: "Study Status",
          id: "Status"
        }, {
          name: "Asset Status",
          id: "assetStatus"
        }
        ];

    }
    else if (this.report_type == "7") {
      this.reportName = "Point Tracker Report";
      this.reportNameInfo = "pointTrackerReport";
      this.studyAll = false;
      this.reloadDatatable();
      this.headers = [
        { key: "date", label: "DATE", checked: true },
        { key: "campaign", label: "CAMPAIGN", checked: true },
        { key: "pet", label: "PET", checked: true },
        { key: "study", label: "STUDY", checked: true },
        { key: "activity", label: "ACTIVITY", checked: true },
        { key: "behavior", label: "BEHAVIOR", checked: true },
        { key: "points", label: "POINTS", checked: true },
        { key: "status", label: "STATUS", checked: true },
      ];
      this.reportUrl = "/api/reports/getPointTrackerReport";
      this.filterTypeArr =
        //      Campaign, Study, Status, Duration, Behavior
        [
          {
            name: "Campaign",
            id: "campaign"
          },
          {
            name: "Study",
            id: "Study"
          },
          {
            name: "Status",
            id: "trackerStatus"
          },
          {
            name: "Date",
            id: "dateType"
          },
          {
            name: "Behavior",
            id: "behavior"
          }
        ];

    }
    else if (this.report_type == "8") {
      this.reportName = "Customer Support Report";
      this.reportNameInfo = "customerSupportReport";
      this.studyAll = true;
      this.reloadDatatable();
      this.headers = [
        { key: "ticketID", label: "TICKET#", checked: true },
        { key: "ticketTitle", label: "TICKET TITLE", checked: true, width: 150 },
        { key: "createdOn", label: "CREATED ON", checked: true, width: 86 },
        { key: "priority", label: "PRIORITY", checked: true },
        { key: "petName", label: "PET", checked: true, width: 80 },
        { key: "study", label: "STUDY", checked: true, width: 120 },
        { key: "issue", label: "ISSUE", checked: true, width: 98 },
        { key: "assignedTo", label: "ASSIGNED TO", checked: true },
        { key: "lastModifiedOn", label: "LAST MODIFIED ON", checked: true, width: 110 },
        { key: "aging", label: "AGING", checked: true },
        { key: "status", label: "STATUS", checked: true, width: 96 },

      ];
      this.reportUrl = "/api/reports/getCustomerSupportTicketReport";

      this.filterTypeArr =
        [
          {
            name: "Priority",
            id: "ticketPriority"
          },
          {
            name: "Date",
            id: "dateType"
          },
          {
            name: "Study",
            id: "Study"
          },
          {
            name: "Assigned To",
            id: "assignedTo"
          },
          {
            name: "Status",
            id: "supportStatus"
          }];

    }
  }
  formatter($event) {
    // if(this.report_type == "3") {
    $event.forEach(ele => {
      if (ele.assignDate) {
        ele.assignDate = (ele.assignDate ? this.customDatePipe.transform(ele.assignDate, 'MM/dd/yyyy') + ' - ' : '') + (ele.unAssignDate ? this.customDatePipe.transform(ele.unAssignDate, 'MM/dd/yyyy') + ' - ' : '') + (ele.petName ? ele.petName + ' - ' : '') + (ele.studyName ? ele.studyName : '');
      }
      if (ele.isActive) {
        if (ele.isActive == true) {
          ele.isActive = "Active";
          ele['columnCssClass']['isActive'] = "active-status";
        } else {
          ele.isActive = "Inactive";
          ele['columnCssClass']['isActive'] = "inactive-status";
        }
      }
      if (ele.ticketTitle) {
        //  ele['columnCssClass']['ticketTitle'] = "ellipsis"
        ele['columnTitle']['ticketTitle'] = ele.ticketTitle;
      }
      if (ele.currentStatus) {
        if (ele.currentStatus == true) {
          ele.currentStatus = "Active";
          ele['columnCssClass']['currentStatus'] = "active-status";
        } else {
          ele.currentStatus = "Inactive";
          ele['columnCssClass']['currentStatus'] = "inactive-status";
        }
      }
      if (ele.unAssignDate) {
        ele.unAssignDate = this.customDatePipe.transform(ele.unAssignDate, 'MM/dd/yyyy');
      }
      if (ele.createdOn) {
        ele.createdOn = this.customDatePipe.transform(ele.createdOn, 'MM/dd/yyyy');
      }
      if (ele.status) {
        if (ele.status == 'Approved' || ele.status == 'Closed') {
          ele['columnCssClass']['status'] = "active-status";
        } else if (ele.status == 'Not Accepted' || ele.status == 'Open' || ele.status == 'Rejected') {
          ele['columnCssClass']['status'] = "inactive-status";
        } else if (ele.status == 'Active') {
          ele['columnCssClass']['status'] = "active-status";
        } else if (ele.status == 'Inactive') {
          ele['columnCssClass']['status'] = "inactive-status";
        } else if(ele.status == 'In-Review'){
          ele['columnCssClass']['status'] = "info-status";
        }else { //Pending
          ele['columnCssClass']['status'] = "testing-status ";
        }
      }
      if (ele.lastModifiedOn) {
        ele.lastModifiedOn = this.customDatePipe.transform(ele.lastModifiedOn, 'MM/dd/yyyy');
      }
      if (ele.addDate) {
        ele.addDate = this.customDatePipe.transform(ele.addDate, 'MM/dd/yyyy');
      }
      if (ele.study) {
        ele['columnCssClass']['study'] = "word-wrap";
      }
      if (ele.assetStatusId == '1') {
        // ele.statusId = "Discarded";
        ele['columnCssClass']['assetStatus'] = "off-status";
      }
      if (ele.assetStatusId == '2') {
        // ele.statusId = "Available";
        ele['columnCssClass']['assetStatus'] = "active-status";
      }
      if (ele.assetStatusId == '3') {
        ele['columnCssClass']['assetStatus'] = "testing-status";
      }
      if (ele.assetStatusId == '4') {
        // ele.statusId = "Allocated";
        ele['columnCssClass']['assetStatus'] = "info-status";
      }
      if (ele.assetStatusId == '5') {
        // ele.statusId = "Allocated";
        ele['columnCssClass']['assetStatus'] = "study-status";
      }
      if (ele.assetStatusId == '6') {
        // ele.statusId = "unassigned";
        ele['columnCssClass']['assetStatus'] = "unassigned-status";
      }
    })
    // }
  }

}
