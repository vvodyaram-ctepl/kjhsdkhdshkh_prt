import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';
import { TabserviceService } from 'src/app/shared/tabservice.service';

@Component({
  selector: 'app-mobile-app-feedback',
  templateUrl: './mobile-app-feedback.component.html',
  styleUrls: ['./mobile-app-feedback.component.scss']
})
export class MobileAppFeedbackComponent implements OnInit {

  headers: any;
  filterTypeArr: any[];
  constructor(
    public customDatePipe: CustomDateFormatPipe,
    private tabservice: TabserviceService,
    public router: Router
  ) { }

  
ngOnInit() {
    this.headers = this.getHeaders();
    this.filterTypeArr =
      [ 
      {
        name: "Phone Model",
        id: "phoneModel"
      },
      {
        name: "Page",
        id: "feedbackPage"
      },
      {
        name: "Feedback Date Between",
        id: "dateType"
      }
    
      ];
  }


  getHeaders() {
    return [
      { key: "petName", label: "Pet Name", checked: true, sortable : true, clickable: true },
      { key: "petOwnerName", label: "Pet Parent Name", checked: true, sortable : true, clickable: true },      
      { key: "feedbackDate", label: "FeedBack Date", checked: true, sortable : true, format: 'MM/dd/yyyy' },
      { key: "pageName", label: "Page", checked: true, sortable : true },
      { key: "deviceType", label: "Phone Model", checked: true, sortable : true },
      { key: "feedback", label: "FeedBack", checked: true, width: 300 }
    ];
  }

  formatter($event) {
    $event.forEach(ele => {
      ele.feedbackDate = this.customDatePipe.transform(ele.feedbackDate, 'MM/dd/yyyy');
    })
  }

  getNode($event) {
    console.log('event ::: ', $event);
    if ($event.header === 'petName') {
      const host: string =  location.origin;
      const url: string = host + '/#/' + String(`user/patients/view/${$event.item.petId}/${$event.item.petStudyId}/patient-charts`);
      window.open(url, '_blank');
    }
    if ($event.header === 'petOwnerName') {
      const host: string =  location.origin;
      const url: string = host + '/#/' + String(`user/petparent/view-pet-parent/${$event.item.petParentId}`);
      window.open(url, '_blank');
    }
  }

}
