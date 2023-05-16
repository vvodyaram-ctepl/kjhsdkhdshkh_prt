import { Component, OnInit } from '@angular/core';
import { CustomDateFormatPipe } from 'src/app/pipes/custom-date-format.pipe';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {
  headers: any;
  filterTypeArr: any[];
  constructor(
    public customDatePipe: CustomDateFormatPipe
  ) { }

  ngOnInit(): void {
    this.headers = this.getHeaders();
    this.filterTypeArr =
      [ 
        {
          name: "Category",
          id: "category"
        },
        // {
        //   name: "Pet Name",
        //   id: "petName"
        // },
        // {
        //   name: "Pet Parent Name",
        //   id: "petParentName"
        // },
        {
          name: "Timer Date Between",
          id: "dateType"
        }
      ];
  }

  getHeaders() {
    return [
      { key: "recordName", label: "Record Name", checked: true, sortable : true },
      { key: "category", label: "Category", checked: true , sortable : true },      
      { key: "duration", label: "Duration", checked: true , sortable : true },
      { key: "timerDate", label: "Date And Time", checked: true, sortable : true },
      { key: "petName", label: "Pet Name", checked: true, sortable : true },
      { key: "petParentName", label: "Pet Parent Name", checked: true, sortable : true },
      { key: "assetNumber", label: "Asset Number", checked: true, sortable : true}
    ];
  }

  formatter($event) {
    $event.forEach(ele => {
      ele.timerDate = this.customDatePipe.transform(ele.timerDate, 'MM/dd/yyyy HH:mm:ss');
    })
  }

}
