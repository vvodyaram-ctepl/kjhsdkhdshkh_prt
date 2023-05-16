import { Component, OnInit, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClinicService } from '../clinic.service';
import * as $ from 'jquery';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-new-clinic',
  templateUrl: './add-new-clinic.component.html',
  styleUrls: ['./add-new-clinic.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddNewClinicComponent implements OnInit {

  @Input() editFlag: boolean = false;
  public flatTabs: any[];
  public tabData: any[];
  subscription: any;
  isExternal: string;
  hasExternalLink: string;
  @ViewChild('carousel') carousel: NgbCarousel;
  @Input() showNextSlide: any;
  studyId: any;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private clinicService: ClinicService
  ) {
    let data1 = this.clinicService.getModelData() ? this.clinicService.getModelData() : {};
  }

  ngOnInit() {
    this.clinicService.nextIdentifier$.subscribe((data) => {
      if (data && data == 'next') {
        this.carousel.next();
      } else if (data && data == 'back') {
        this.carousel.select('0');
        this.router.navigate([`/user/clinics/edit-clinic/${this.studyId}/basic-details`]);
      }
    });

    window.addEventListener("isAmCliniClicked", (event) => {
      let external = localStorage.getItem('external');
      this.hasExternalLink = localStorage.getItem('isPreludeUrl');
      this.isExternal = external;
    });
    if (!this.editFlag) {
      this.flatTabs = [
        { tabId: 1, name: 'Basic Details', link: 'basic-details', property: 'basicDetails', show: true },
        { tabId: 2, name: 'Plans', link: 'add-plans', property: 'addPlan', show: true },
        { tabId: 3, name: 'Notes', link: 'add-notes', property: 'addNotes', show: true },
        { tabId: 4, name: 'Mobile App Config', link: 'mobile-app-config', property: 'mobileApp', show: true },
        { tabId: 5, name: 'Push Notification', link: 'push-notification-study', property: 'notification', show: true },
        { tabId: 9, name: 'Image Scoring', link: 'study-image-scoring', property: 'imageScoring', show: true },
        { tabId: 6, name: 'Questionnaire', link: 'questionnaire', property: 'questionnaire', show: true }
      ];
    }
    else {
      this.flatTabs = [
        { tabId: 1, name: 'Basic Details', link: 'basic-details', property: 'addbasicDetails', show: true },
        { tabId: 2, name: 'Plans', link: 'add-plans', property: 'addPlans', show: true },
        { tabId: 3, name: 'Notes', link: 'view-notes', property: 'viewNotes', show: true },
        { tabId: 4, name: 'Mobile App Config', link: 'mobile-app-config', property: 'mobileApp', show: true },
        { tabId: 5, name: 'Push Notification', link: 'push-notification-study', property: 'pushNotification', show: true },
        { tabId: 9, name: 'Image Scoring', link: 'study-image-scoring', property: 'imageScoring', show: true },
        { tabId: 6, name: 'Questionnaire', link: 'questionnaire', property: 'questionnaire', show: true },
        { tabId: 7, name: 'Prelude Config', link: 'prelude-config', property: 'preludeConfig', show: false },
        { tabId: 8, name: 'Activity Factor', link: 'activity-factor', property: 'activityFactor', show: true }
      ];
      let str = this.router.url;
      this.studyId = str.split("edit-clinic/")[1].split("/")[0];
    }

    this.groupTabs(6, this.flatTabs);

    window.addEventListener("isAmCliniClicked", (event) => {
      let external = localStorage.getItem('external');
      this.hasExternalLink = localStorage.getItem('isPreludeUrl');
      this.isExternal = external;
      this.flatTabs.forEach(ele => {

        if (this.editFlag) {
          if (ele.tabId == 7) {
            if (this.isExternal == "true" && this.hasExternalLink != '') {
              ele.show = true;
            }
            else {
              ele.show = false;
            }
          }
        }
        else {
          if (ele.tabId == 6) {
            if (this.isExternal == "true" && this.hasExternalLink != '') {
            }
            else {
            }
          }
        }
      })
    });

  }

  groupTabs(numberOfChunks: number, inputList: any) {
    this.tabData = [];
    inputList.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / numberOfChunks);
      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [];
      }
      resultArray[chunkIndex].push(item);
      this.tabData = resultArray;
      return resultArray
    }, []);
  }

  public activateTab(activeTab) {
    this.flatTabs.forEach(flatTag => {
      if (flatTag.tabId == activeTab.tabId) {
        flatTag.active = true;
      } else {
        flatTag.active = false;
      }
    });
  }

  ngOnChanges() {
    window.addEventListener("isAmCliniClicked", (event) => {
      let external = localStorage.getItem('external');
      this.hasExternalLink = localStorage.getItem('isPreludeUrl');
      this.isExternal = external;
      this.flatTabs.forEach(ele => {
        if (this.editFlag) {
          if (ele.tabId == 7) {
            if (this.isExternal == "true" && this.hasExternalLink != '') {
              ele.show = true;
            }
            else {
              ele.show = false;
            }
          }
        }
        else {
          if (ele.tabId == 6) {
            if (this.isExternal == "true" && this.hasExternalLink != '') {
            }
            else {
            }
          }
        }
      });
    });
  }

  ngAfterViewInit() {
    if (this.showNextSlide) {
      this.carousel.activeId = '1';
    }
  }

  onSlide($event, carousel) {
    if ($event.current == "0") {
      if (this.editFlag)
        this.router.navigate([`/user/clinics/edit-clinic/${this.studyId}/basic-details`]);
      else
        this.router.navigate([`/user/clinics/add-new-clinic/basic-details`]);
    }
    if ($event.current == "1") {
      if (this.editFlag)
        this.router.navigate([`/user/clinics/edit-clinic/${this.studyId}/questionnaire`]);
      else
        this.router.navigate([`/user/clinics/add-new-clinic/questionnaire`]);
    }
  }
}