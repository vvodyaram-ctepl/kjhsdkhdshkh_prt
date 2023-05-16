import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { ActivatedRoute } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class TabsService {
  upcomingTab: any;
  tabsSchema: any;
  currentParams: any;
  constructor(private route: ActivatedRoute) { }

  private nextSource = new Subject<any>();
  next$ = this.nextSource.asObservable();

  private reActivateSource = new Subject<any>();
  reActivate$ = this.reActivateSource.asObservable();

  private gotoNextSource = new Subject<any>();
  gotoNext$ = this.gotoNextSource.asObservable();

  private prevSource = new Subject<any>();
  prev$ = this.prevSource.asObservable();

  private gotoPrevSource = new Subject<any>();
  gotoPrev$ = this.gotoPrevSource.asObservable();

  private saveSource = new Subject<any>();
  save$ = this.saveSource.asObservable();

  private saveDraftSource = new Subject<any>();
  saveDraft$ = this.saveDraftSource.asObservable();

  private cancelSource = new Subject<any>();
  cancel$ = this.cancelSource.asObservable();

  private tabChangeSource = new Subject<any>();
  tabChange$ = this.tabChangeSource.asObservable();

  private gotoTabChangeSource = new Subject<any>();
  gotoTabChange$ = this.gotoTabChangeSource.asObservable();

  private getTabsSource = new Subject<any>();
  getTabs$ = this.getTabsSource.asObservable();

  private setTabsSource = new Subject<any>();
  setTabs$ = this.setTabsSource.asObservable();

  private tabsLoadedSource = new Subject<any>();
  loadTabs$ = this.tabsLoadedSource.asObservable();

  private submitSource = new Subject<any>();
  submit$ = this.submitSource.asObservable();

  private submitUpdatesSource = new Subject<any>();
  submitUpdates$ = this.submitUpdatesSource.asObservable();

  private applyDvcSource = new Subject<any>();
  applyDvc$ = this.applyDvcSource.asObservable();

  private addAnimalSource = new Subject<any>();
  addAnimal$ = this.addAnimalSource.asObservable();

  private ConfirmScheduleSource = new Subject<any>();
  ConfirmSchedule$ = this.ConfirmScheduleSource.asObservable();

  private SaveTentativeScheduleSource = new Subject<any>();
  SaveTentativeSchedule$ = this.SaveTentativeScheduleSource.asObservable();
  private resetSource = new Subject<any>();
  reset$ = this.resetSource.asObservable();

  private activateSource = new Subject<any>();
  activate$ = this.activateSource.asObservable();

  private inactivateSource = new Subject<any>();
  inactivate$ = this.inactivateSource.asObservable();

  private scheduleSource = new Subject<any>();
  schedule$ = this.scheduleSource.asObservable();

  private activeTabSource = new Subject<any>();
  activeTabs$ = this.activeTabSource.asObservable();

  private createpanelSource = new Subject<any>();
  createpanel$ = this.createpanelSource.asObservable();

  private replicateprimarySource = new Subject<any>();
  replicateprimary$ = this.replicateprimarySource.asObservable();

  private replicatesecondarySource = new Subject<any>();
  replicatesecondary$ = this.replicatesecondarySource.asObservable();

  next() {
    this.nextSource.next();
  }

  reActivate() {
    this.reActivateSource.next();
  }

  gotoNext() {
    this.gotoNextSource.next();
  }

  prev() {
    this.prevSource.next();
  }

  gotoPrev() {
    this.gotoPrevSource.next();
  }

  save() {
    this.saveSource.next();
  }

  saveDraft() {
    this.saveDraftSource.next();
  }

  cancel() {
    this.cancelSource.next();
  }
  submit() {
    this.submitSource.next();
  }
  submitUpdates() {
    this.submitUpdatesSource.next();
  }
  applyDvc() {
    this.applyDvcSource.next();
  }
  addAnimal() {
    this.addAnimalSource.next();
  }
  ConfirmSchedule() {
    this.ConfirmScheduleSource.next();
  }
  SaveTentativeSchedule() {
    this.SaveTentativeScheduleSource.next();
  }
  reset() {
    this.resetSource.next();
  }
  activate() {
    this.activateSource.next();
  }
  inactivate() {
    this.inactivateSource.next();
  }
  schedule() {
    this.scheduleSource.next();
  }
  tabChange() {
    this.tabChangeSource.next();
  }
  gotoChangedTab() {
    this.gotoTabChangeSource.next();
  }
  createpanel() {
    this.createpanelSource.next();
  }

  replicateprimary() {
    this.replicateprimarySource.next();
  }
  replicatesecondary() {
    this.replicatesecondarySource.next();
  }


  loadedTabs() {
    const timer = setInterval(() => {
      if (this.tabsSchema) {
        clearInterval(timer);
        this.tabsLoadedSource.next();
      }
    }, 500);
  }
  getTabs() {
    return this.tabsSchema;
  }
  setTabs(data) {
    this.tabsSchema = data;
  }
  setUpcomingTab(data) {
    this.upcomingTab = data;
  }
  getUpcomingTab() {
    return this.upcomingTab;
  }

  setParams(paramas) {
    this.currentParams = "";
    this.currentParams = paramas;
  }

  getParams() {
    return this.currentParams;
  }
  removeTab(main?, sub?) {
    if (!main && !sub) {
      return;
    }
    let tabs = JSON.parse(JSON.stringify(this.tabsSchema));
    let mainIndex;
    let subIndex;
    tabs.forEach((element, index) => {
      if (main && !sub) {
        if (element.name == main) {
          mainIndex = index;
        }
      }
      if (main && sub) {
        if (element.name == main) {
          mainIndex = index;
          element.sub.forEach((ele, ind) => {
            if (ele.name == sub) {
              subIndex = ind;
            }
          });
        }
      }
    });
    if (!mainIndex && !subIndex) {
      return;
    }
    if ((main && mainIndex == undefined) || (sub && subIndex == undefined)) {
      return;
    }
    if (mainIndex != undefined && subIndex == undefined) {
      this.tabsSchema.splice(mainIndex, 1);
    }

    if (mainIndex != undefined && subIndex != undefined) {
      if (subIndex == 0) {
        this.tabsSchema[mainIndex]["subIndex"] = 1;
      }
      this.tabsSchema[mainIndex].sub.splice(subIndex, 1);
    }
  }
  getCurrentMainTab() {
    console.log(this.tabsSchema);
    let tabs = JSON.parse(JSON.stringify(this.tabsSchema));
    let mainTab: any = "";
    tabs.forEach((element, index) => {
      if (element.active) {
        mainTab = element;
        console.log(mainTab);
      }
    });
    if (!mainTab && this.route.snapshot.queryParams.tab) {
      mainTab = tabs[this.route.snapshot.queryParams.tab ? this.route.snapshot.queryParams.tab : 0];
    }
    console.log(mainTab, this.route.snapshot.queryParams);
    return mainTab;
  }
  getCurrentSubTab() {
    if (this.getCurrentMainTab() && this.getCurrentMainTab().sub) {
      let subTab: any = "";
      this.getCurrentMainTab().sub.forEach(ele => {
        if (ele.active) {
          subTab = ele;
        }
      })
      if (!subTab && this.route.snapshot.queryParams.sub) {
        subTab = this.getCurrentMainTab()[this.route.snapshot.queryParams.sub ? this.route.snapshot.queryParams.sub : 0];
      }
      return subTab;
    }
  }
  addMainTab(index?, mainTab?) {
    this.tabsSchema.splice(index, 0, mainTab);
  }
  addSubTab(mainTab?, subIndex?, subTab?) {
    let mainIndex;
    if (mainTab && subTab) {
      this.tabsSchema.forEach((ele, ind) => {
        if (ele.name == mainTab) {
          mainIndex = ind;
        }
      });
      let exists;
      this.tabsSchema[mainIndex].sub.forEach(ele => {
        if (ele.name == subTab.name) {
          exists = true;
        }
      });
      if (!exists) {
        this.tabsSchema[mainIndex].sub.splice(subIndex, 0, subTab);
      }
    }
  }
  getTabIndex(main, sub?) {
    let index;
    if (main && !sub) {
      this.tabsSchema.forEach((ele, ind) => {
        if (ele.name == main) {
          index = ind;
        }
      });
      return index;
    }
    console.log(main, sub, main && sub);
    if (main && sub) {
      this.tabsSchema.forEach((ele, ind) => {
        console.log(ele.name == main);
        if (ele.name == main) {
          ele.sub.forEach((ele1, ind1) => {
            console.log(ele1.name == sub);
            if (ele1.name == sub) {
              index = ind1;
            }
          });
        }
      });
      console.log(index);
      return index;
    }
  }

  activeTabs() {
    this.activeTabSource.next();
  }

}
