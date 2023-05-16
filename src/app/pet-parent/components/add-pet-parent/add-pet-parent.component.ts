import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-add-pet-parent',
  templateUrl: './add-pet-parent.component.html',
  styleUrls: ['./add-pet-parent.component.scss']
})
export class AddPetParentComponent implements OnInit {

  @Input() editFlag: boolean = false;
  public flatTabs: any[];
  editId: string;
  viewFlag: boolean = false;
  addFlag: boolean;

  constructor(public route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    // if(this.router.url.indexOf('/add-pet-parent') > -1) {
    //   let str = this.router.url;
    //   let id = str.split("add-pet-parent/")[1].split("/")[0];
    //   this.editFlag = false;
    //   this.editId = id;
    //   }
    //   else {
    //     this.editFlag = true;
    //   }
      this.route.params.subscribe(async params => {
        console.log("paramas", params);
        this.editId = params.id;
        const path = this.route.snapshot.url[0].path;
        console.log("path", path)
        if (path === 'add-pet-parent') {
          this.addFlag = true;
        }
        if (path === 'view-pet-parent') {
          this.viewFlag = true;
        }
        if (path === 'edit-pet-parent') {
          this.editFlag = true;
        }
      })
    if(this.editFlag) {
    this.flatTabs = [
      { tabId: 1, name: 'BasicDetails', label: 'Basic Details', link: 'pet-parent-details', property: 'BasicDetails' },
      { tabId: 2, name: 'AssociatePet', label: 'Associate Pet', link: 'associate-pet', property: 'AssociatePet' }
      // { tabId: 3, name: 'Device', label: 'Device', link: 'pet-device', property: 'petDevice' },
      // { tabId: 4, name: 'PetParentInfo', label: 'Pet Parent Info', link: 'pet-parent-info', property: 'petParentInfo' },
      // { tabId: 5, name: 'Review', label: 'Review', link: 'review', property: 'review' },
    ];
  }
  else {
    this.flatTabs = [
      { tabId: 1, name: 'BasicDetails', label: 'Basic Details', link: 'pet-parent-details', property: 'BasicDetails' }
      // { tabId: 3, name: 'Device', label: 'Device', link: 'pet-device', property: 'petDevice' },
      // { tabId: 4, name: 'PetParentInfo', label: 'Pet Parent Info', link: 'pet-parent-info', property: 'petParentInfo' },
      // { tabId: 5, name: 'Review', label: 'Review', link: 'review', property: 'review' },
    ];
  }
    console.log("this.flatTabs", this.flatTabs);
  }

  public activateTab(activeTab) {

    this.flatTabs.forEach(flatTag => {
      if (flatTag.tabId == activeTab.tabId) {
        flatTag.active = true;
        console.log("activeTab.tabId", activeTab.tabId);
        console.log("activeTab.tabId", activeTab.name);
      } else {
        flatTag.active = false;
      }


    });
  }
  navChange($event) {
    console.log("navChange", $event);
  }

}