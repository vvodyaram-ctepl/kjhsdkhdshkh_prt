import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-new-user',
  templateUrl: './add-new-user.component.html',
  styleUrls: ['./add-new-user.component.scss']
})
export class AddNewUserComponent implements OnInit {

  @Input() editFlag:boolean = false;
  public flatTabs :any[];

  constructor(public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.flatTabs = [{tabId: 1, name : 'User Details',link:'add-user-details',property:'AddUserDetails'},
    {tabId: 2, name : 'Associated Study',link:'add-associated-study',property:'AddAssociatedStudy'}
  ];
  }

  public activateTab(activeTab) {
    this.flatTabs.forEach(flatTag => {
      if(flatTag.tabId == activeTab.tabId){
        flatTag.active = true;
      }else{
        flatTag.active = false;
      }
    });
  }
}
