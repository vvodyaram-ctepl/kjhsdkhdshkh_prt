import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-previlege',
  templateUrl: './view-previlege.component.html',
  styleUrls: ['./view-previlege.component.scss']
})
export class ViewPrevilegeComponent implements OnInit {

  headers: any;
  constructor() { }

  ngOnInit(): void {
    this.headers = [
      { key: "name", label: "Study Name", checked: true },
      { key: "company", label: "ROle(s)", checked: true },
      { key: "date", label: "Date Added", checked: true },
      { key: "date", label: "Last Login", checked: true },
      { key: "static", label: "", checked: true, clickable: true, width: 85 }
    ];
  }

  next() {

  }
  addStudy() {

  }

}
