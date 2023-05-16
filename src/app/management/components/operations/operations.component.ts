import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss']
})
export class OperationsComponent implements OnInit {
  startDate: any;
  headers: any;
  endDate: string;
  userNameActAs: any;
  testt: any;
  public analyteMatrixResultform: FormGroup;

  constructor(private fb: FormBuilder) {
    this.analyteMatrixResultform = this.fb.group({
      userNameActAss: '',
    })
  }

  ngOnInit(): void {
    this.startDate = moment().format("MM-DD-YYYY");
    this.endDate = moment().format("MM-DD-YYYY");
    this.headers = [
      { key: "name", label: "name", checked: true },
      { key: "gender", label: "gender", checked: true },
      { key: "company", label: "company", checked: true },
      { key: "age", label: "age", checked: true }
    ];
  }
  clearDate() {

  }
  changeEndDate($event) {

  }


}
