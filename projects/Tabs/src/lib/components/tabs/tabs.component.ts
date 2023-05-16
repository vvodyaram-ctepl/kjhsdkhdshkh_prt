import { Component, OnInit, Input, ViewEncapsulation, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from 'rxjs';
import { combineLatest, of } from 'rxjs';
import { TabsService } from "../tabs.service";
import { NgbModal, NgbNav, NgbModalRef, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TabsComponent implements OnInit {
  changeTabObj: any = {

  };
  activeTab: any;
  activeSubTab: any;
  changedTab: any;
  hideNext: boolean;
  hideCancel: boolean;
  hideSaveDraft: boolean;
  hideSave: boolean;
  hideBack: boolean;
  subTabIndex: any = 0;
  mainTabIndex: any = 0;
  selectedTab: any;
  @ViewChild('t') t: ElementRef;
  @ViewChild('t1') t1: ElementRef;

  @Input() data;
  @Input() showButtons: boolean;
  @Input() staticRoute;
  @Output() tabChange = new EventEmitter();
  first: object;
  private alive: boolean = true;
  public routeParams: any = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public service: TabsService
  ) {
    service.gotoNext$.subscribe(data => {
      this.routeParams = this.service.getParams();
      let mainTab = 0;
      let subTab = 0;
      this.data.forEach((ele, index) => {
        if (ele.active) {
          mainTab = index;
        }
      })
      this.data[mainTab].sub && this.data[mainTab].sub.forEach((ele, index) => {
        if (ele.active) {
          subTab = index;
        }
      })


      if (this.data.length == 1 && this.data[mainTab].sub) {
        mainTab = 0;
        subTab = (this.activeSubTab && Number(this.activeSubTab.slice(-1))) || subTab;
        this.router.navigate(
          [this.staticRoute + this.data[mainTab].link + '/' + this.data[mainTab].sub[subTab + 1].link, this.routeParams ? this.routeParams : {}], { queryParams: { tab: mainTab, sub: subTab + 1 }, queryParamsHandling: "merge" });
        return;
      }

      if (this.data[mainTab].sub && this.data[mainTab].sub.length - 1 > subTab) {

        this.router.navigate(
          [this.staticRoute + this.data[mainTab].link + '/' + this.data[mainTab].sub[subTab + 1].link, this.routeParams ? this.routeParams : {}], { queryParams: { tab: mainTab, sub: subTab + 1 }, queryParamsHandling: "merge" });
      }

      if (!this.data[mainTab].sub && this.data.length - 1 > mainTab && !this.data[mainTab + 1].dynamic) {

        this.router.navigate(
          [this.staticRoute + this.data[mainTab + 1].link, this.routeParams], { queryParams: { tab: mainTab + 1 }, queryParamsHandling: "merge" });
      }

      if (this.data[mainTab].sub && this.data[mainTab].sub.length - 1 == subTab && this.data.length - 1 > mainTab && !this.data[mainTab + 1].dynamic) {

        if (this.data[mainTab + 1].sub) {
          this.router.navigate(
            [this.staticRoute + this.data[mainTab + 1].link + '/' + this.data[mainTab + 1].sub[0].link, this.routeParams], { queryParams: { tab: mainTab + 1, sub: 0 }, queryParamsHandling: "merge" });
        }
        if (!this.data[mainTab + 1].sub) {
          this.router.navigate(
            [this.staticRoute + this.data[mainTab + 1].link, this.routeParams], { queryParams: { tab: mainTab + 1, sub: 0 }, queryParamsHandling: "merge" });
        }
      }

      if (this.data[mainTab].sub && this.data[mainTab].sub.length - 1 == subTab && this.data.length - 1 > mainTab && this.data[mainTab + 1].dynamic) {

        if (this.data[mainTab + 1].sub[0]) {
          this.router.navigate(
            [this.staticRoute + this.data[mainTab + 1].link + '/' + this.data[mainTab + 1].sub[0].link, this.routeParams], { queryParams: { tab: mainTab + 1, sub: 0 }, queryParamsHandling: "merge" });
        } else {
          this.router.navigate(
            [this.staticRoute + this.data[mainTab + 1].link, this.routeParams], { queryParams: { tab: mainTab + 1, sub: 0 }, queryParamsHandling: "merge" });
        }
      }

      if (!this.data[mainTab].sub && this.data.length - 1 > mainTab && this.data[mainTab + 1].dynamic) {

        if (this.data[mainTab + 1].sub[0]) {
          this.router.navigate(
            [this.staticRoute + this.data[mainTab + 1].link + '/' + this.data[mainTab + 1].sub[0].link, this.routeParams], { queryParams: { tab: mainTab + 1, sub: 0 }, queryParamsHandling: "merge" });
        } else {
          this.router.navigate(
            [this.staticRoute + this.data[mainTab + 1].link, this.routeParams], { queryParams: { tab: mainTab + 1, sub: 0 }, queryParamsHandling: "merge" });
        }
      }

    })
    service.gotoPrev$.subscribe(data => {

      this.routeParams = this.service.getParams();
      let mainTab = 0;
      let subTab = 0;
      this.data.forEach((ele, index) => {
        if (ele.active) {
          mainTab = index;
        }
      })
      this.data[mainTab].sub && this.data[mainTab].sub.forEach((ele, index) => {
        if (ele.active) {
          subTab = index;
        }
      });


      if (this.data.length == 1 && this.data[mainTab].sub) {
        mainTab = 0;
        subTab = (this.activeSubTab && Number(this.activeSubTab.slice(-1))) || subTab;
        this.router.navigate(
          [this.staticRoute + this.data[mainTab].link + '/' + this.data[mainTab].sub[subTab - 1].link, this.routeParams ? this.routeParams : {}], { queryParams: { tab: mainTab, sub: subTab - 1 }, queryParamsHandling: "merge" });
        return;
      }


      if (this.data[mainTab].sub && subTab > 0) {
        this.router.navigate(
          [this.staticRoute + this.data[mainTab].link + '/' + this.data[mainTab].sub[subTab - 1].link, this.routeParams], { queryParams: { tab: mainTab, sub: subTab - 1 }, queryParamsHandling: "merge" });
        return;
      }
      if (this.data[mainTab].sub && subTab == 0 && this.data[mainTab - 1] && this.data[mainTab - 1].sub && this.data.length - 1 >= mainTab) {
        let subTabLink = this.data[mainTab - 1].sub[this.data[mainTab - 1].sub.length - 1].link;
        this.router.navigate(
          [this.staticRoute + this.data[mainTab - 1].link + '/' + subTabLink, this.routeParams], { queryParams: { tab: mainTab - 1, sub: this.data[mainTab - 1].sub.length - 1 }, queryParamsHandling: "merge" });
        return;
      }

      if (this.data[mainTab].sub && subTab == 0 && !this.data[mainTab - 1].sub && this.data.length - 1 > mainTab) {
        this.router.navigate(
          [this.staticRoute + this.data[mainTab - 1].link, this.routeParams], { queryParams: { tab: mainTab - 1, sub: null }, queryParamsHandling: "merge" });
        return;
      }

      if (!this.data[mainTab].sub && mainTab > 0 && this.data[mainTab - 1] && this.data[mainTab - 1].sub) {
        let subTabLink = this.data[mainTab - 1].sub[this.data[mainTab - 1].sub.length - 1].link;
        let mainTabLink = this.data[mainTab - 1].link == 'animals/other-suitable' ? 'animals' : this.data[mainTab - 1].link;
        console.log(this.data[mainTab - 1].link);
        this.router.navigate(
          [this.staticRoute + mainTabLink + '/' + subTabLink, this.routeParams], { queryParams: { tab: mainTab - 1, sub: this.data[mainTab - 1].sub.length - 1 }, queryParamsHandling: "merge" });
        return;
      }

      if (!this.data[mainTab].sub && mainTab > 0 && this.data[mainTab - 1] && !this.data[mainTab - 1].sub) {
        this.router.navigate(
          [this.staticRoute + this.data[mainTab - 1].link, this.routeParams], { queryParams: { tab: mainTab - 1 }, queryParamsHandling: "merge" });
        return;
      }

      if (this.data[mainTab].sub && mainTab > 0 && subTab == 0 && this.data[mainTab - 1] && !this.data[mainTab - 1].sub) {
        this.router.navigate(
          [this.staticRoute + this.data[mainTab - 1].link, this.routeParams], { queryParams: { tab: mainTab - 1 }, queryParamsHandling: "merge" });
        return;
      }

    });

    service.gotoTabChange$.subscribe(data => {
      this.routeParams = this.service.getParams();
      this.router.navigate([this.changeTabObj.url, this.routeParams ? this.routeParams : {}], { queryParams: this.changeTabObj.queryParams ? this.changeTabObj.queryParams : {}, queryParamsHandling: "merge" });

      /*   if (this.changeTabObj.queryParams.tab) {
           let tabElement = <any>this.t;
           tabElement.select('t-' + this.changeTabObj.queryParams.tab);
           this.mainTabIndex = this.changeTabObj.queryParams.tab;
         }*/
      /*if (this.changeTabObj.queryParams.sub) {
        let tabElement = <any>this.t;
        tabElement.select('t1-' + this.changeTabObj.queryParams.tab + '-' + this.changeTabObj.queryParams.sub);
        this.subTabIndex = this.changeTabObj.queryParams.sub;
      }*/

    })

    /*   service.gotoTabChange$.subscribe(data => {
         let tabs = this.selectedTab.split("-").slice(1);
         let subTabLink = this.data[tabs[0]].sub[tabs[1] ? tabs[1] : 0].link;
         console.log([this.staticRoute + this.data[tabs[0]].link + '/' + subTabLink], { queryParams: { tab: tabs[0], sub: tabs[1] ? tabs[1] : 0 }, queryParamsHandling: "merge" });
         this.router.navigate(
           [this.staticRoute + this.data[tabs[0]].link + '/' + subTabLink], { queryParams: { tab: tabs[0], sub: tabs[1] ? tabs[1] : 0 }, queryParamsHandling: "merge" });
       })*/
    service.activeTabs$.subscribe(data => {
      console.log("lllllll");
      this.ngOnInit();
      this.activeTabs();
    })
  }
  next() {
    this.service.next();
  }
  back() {
    this.service.prev();
  }
  save() {
    this.service.save();
  }
  saveDraft() {
    this.service.saveDraft();
  }
  cancel() {
    this.service.cancel();
  }
  submit() {
    this.service.submit();
  }
  submitUpdates() {
    this.service.submitUpdates();
  }
  ApplyDvc() {
    this.service.applyDvc();
  }
  addAnimal() {
    this.service.addAnimal();
  }
  ConfirmSchedule() {
    this.service.ConfirmSchedule();
  }
  SaveTentativeSchedule() {
    this.service.SaveTentativeSchedule();
  }
  activate() {
    this.service.activate();
  }
  schedule() {
    this.service.schedule();
  }
  inactivate() {
    this.service.inactivate();
  }
  createpanel() {
    this.service.createpanel();
  }

  replicateprimary() {
    this.service.replicateprimary();
  }
  replicatesecondary() {
    this.service.replicatesecondary();
  }

  Reset() {
    this.service.reset();
  }

  ngOnInit() {
    if (this.showButtons) {
      if (this.route.firstChild) {
        this.route.firstChild.params.subscribe(params => {
          if (Object.keys(params).length) {
            this.service.setParams(params);
            this.routeParams = this.service.getParams();
          } else {
            this.route.queryParams.subscribe(params => {
              this.route.children[0].children[0].params.subscribe(res => {
                this.service.setParams(res);
                this.routeParams = this.service.getParams();
              })
            })
          }
          setTimeout(() => {
            this.buttonsDisplay();
          }, 500);

        });
      } else {
        this.route.params.subscribe(params => {
          if (Object.keys(params).length) {
            this.service.setParams(params);
            this.routeParams = this.service.getParams();
          } else {
            this.route.queryParams.subscribe(params => {
              console.log("this.route", this.route);
              // this.route.children[0].children[0].params.subscribe(res => {
              //   this.service.setParams(res);
              //   this.routeParams = this.service.getParams();
              // })
            })
          }
          setTimeout(() => {
            this.buttonsDisplay();
          }, 500);

        });
      }
    }

    this.route.queryParams.subscribe(params => {
      console.log(params);
      if (Object.keys(params).length == 0) {
        setTimeout(() => {
          let activeIndex = 0;
          let subIndex = 0;
          this.data.forEach((ele, index) => {
            if (ele.active) {
              activeIndex = index;
            }
          });
          if (this.data[activeIndex].sub) {
            this.data[activeIndex].sub.forEach((ele, index) => {
              if (ele.active) {
                subIndex = index;
              }
            })
          }
          const queryParams = { tab: activeIndex };
          if (this.data[activeIndex].sub) {
            queryParams['sub'] = subIndex;
          }
          if (this.first) {
            let tabElement = <any>this.t;
            console.log("tabElement",tabElement);
            console.log("this.first",this.first['tab']);
            tabElement.select('t-' + this.first['tab']);
            console.log("ssss",tabElement.select('t-' + this.first['tab']));
            if (this.first['sub'] >= 0) {
              setTimeout(() => {
                let tabEle = <any>this.t1;
                // tabEle.select('t1-' + this.first['tab'] + '-' + this.first['sub']);
              }, 100)
            }
          }
          if (!this.first) {
            this.first = { tab: activeIndex };
            if (this.data[activeIndex].sub) {
              this.first['sub'] = subIndex;
            }
          }
          this.mainTabIndex = activeIndex;
          this.mainTabIndex = subIndex;
        }, 100)
        return;
      }
      if (params.tab) {
        this.data.forEach((element, index) => {
          element.active = false;
          if (params.sub && element.sub) {
            element.sub.forEach((ele, i) => {
              ele.active = false;
            })
          }
        });
      }

      if (!params.sub && this.data[params.tab] && this.data[params.tab].sub) {
        this.data[params.tab].sub.forEach((ele, i) => {
          ele.active = false;
          if (ele.link == "") {
            ele.active = true;
          }
        })
      }

      const tab = this.data[params.tab];

      if (params.tab) {
        tab['active'].set(true);
      }
      if (params.sub) {
        tab.sub[params.sub]['active'].set(true);
      }
      setTimeout(() => {
        if (params.tab) {
          tab['active'].set(true);
          let tabElement = <any>this.t;
          tabElement.select('t-' + params.tab);
        }
        if (params.sub) {
          tab.sub[params.sub]['active'].set(true);
          let tabEle = <any>this.t1;
          console.log(tabEle);
          tabEle.select('t1-' + params.tab + '-' + params.sub);
        }
        //this.loadTabControl();

      }, 1000)
    });

    this.service.setTabs(this.data);
    //this.loadTabControl();


  }
  updateButtons() {
    setTimeout(() => {
      this.buttonsDisplay();
    }, 500);
  }
  loadTabControl() {
    setTimeout(() => {
      if (this.data[this.mainTabIndex] && !this.data[this.mainTabIndex].sub && this.data[this.mainTabIndex].hideBack) {
        this.hideBack = true;
      }
      if (this.data[this.mainTabIndex] && !this.data[this.mainTabIndex].sub && this.data[this.mainTabIndex].hideSave) {
        this.hideSave = true;
      }
      if (this.data[this.mainTabIndex] && !this.data[this.mainTabIndex].sub && this.data[this.mainTabIndex].hideSaveDraft) {
        this.hideSaveDraft = true;
      }
      if (this.data[this.mainTabIndex] && !this.data[this.mainTabIndex].sub && this.data[this.mainTabIndex].hideCancel) {
        this.hideCancel = true;
      }
      if (this.data[this.mainTabIndex] && !this.data[this.mainTabIndex].sub && this.data[this.mainTabIndex].hideNext) {
        this.hideNext = true;
      }
      if (this.data[this.mainTabIndex] && this.data[this.mainTabIndex].sub && this.data[this.mainTabIndex].sub[this.subTabIndex].hideBack) {
        this.hideBack = true;
      }
      if (this.data[this.mainTabIndex] && this.data[this.mainTabIndex].sub && this.data[this.mainTabIndex].sub[this.subTabIndex].hideSave) {
        this.hideSave = true;
      }
      if (this.data[this.mainTabIndex] && this.data[this.mainTabIndex].sub && this.data[this.mainTabIndex].sub[this.subTabIndex].hideSaveDraft) {
        this.hideSaveDraft = true;
      }
      if (this.data[this.mainTabIndex] && this.data[this.mainTabIndex].sub && this.data[this.mainTabIndex].sub[this.subTabIndex].hideCancel) {
        this.hideCancel = true;
      }
      if (this.data[this.mainTabIndex] && this.data[this.mainTabIndex].sub && this.data[this.mainTabIndex].sub[this.subTabIndex].hideNext) {
        this.hideNext = true;
      }
    }, 500)
  }
  ngAfterViewInit() {
    this.activeTabs();

    var obsComb:Observable<any> = combineLatest(this.route.queryParams, (qparams) => ({ qparams }));
    obsComb.subscribe(ap => {
      this.ngOnInit();
      this.activeTabs();
      this.service.loadedTabs();
    });
  }
  beforeChange($event, flag?) {
    console.log("beforechange")
    console.log(flag + "event", $event)
    if (flag) {
      // $event.preventDefault();
    }
    console.log(this.t);
    this.tabChange.emit($event);
    if (this.showButtons) {
      console.log($event);
      this.changedTab = $event;
      console.log("this.changedTab",this.changedTab);
      //  this.selectedTab = $event.nextId;
      //   let tabs = this.selectedTab.split("-").slice(1);
      /*setTimeout(() => {
        if (tabs.length == 1) {
          let tabElement = <any>this.t;
          tabElement.select($event.activeId);
          this.mainTabIndex = tabs[0];
        }
        if (tabs.length == 2) {
          let tabEle = <any>this.t1;
          tabEle.select($event.activeId);
          this.subTabIndex = tabs[1];
        }
      }, 200)*/
      //$event.preventDefault();
      /* if (tabs[0] != this.mainTabIndex && tabs[1] != this.subTabIndex) {
         $event.preventDefault();
       }*/
    }
    // this.service.tabChange();
  }
  activeTabs() {
    console.log(this.data);
    this.data.forEach((element, index) => {
      if (element.active) {
        let tabElement = <any>this.t;
        console.log("tabElement",tabElement);
        tabElement.select('t-' + index);
        this.mainTabIndex = index;
        element.sub && element.sub.forEach((ele, i) => {
          if (ele.active) {
            setTimeout(() => {
              let tabEle = <any>this.t1;
              console.log(tabEle);
              tabEle.select('t1-' + index + '-' + i);
              this.subTabIndex = i;
            }, 100)
          }
        })
      }
    });
  }

  buttonsDisplay() {

    this.data.forEach(ele => {
      ele.showConfirmSchedule = null;
      ele.showSaveTentativeSchedule = null;
      if (ele.sub) {
        ele.sub.forEach(element => {
          element.showConfirmSchedule = null;
          element.showSaveTentativeSchedule = null;
        })
      }
    })

    if (this.showButtons) {
      this.data.forEach(element => {
        if (!element.hideBack) {
          this.hideBack = false;
        } else {
          this.hideBack = true;
        }
        if (!element.hideSave) {
          this.hideSave = false;
        } else {
          this.hideSave = true;
        }
        if (!element.hideSaveDraft) {
          this.hideSaveDraft = false;
        } else {
          this.hideSaveDraft = true;
        }
        if (!element.hideCancel) {
          this.hideCancel = false;
        } else {
          this.hideCancel = true;
        }
        if (!element.hideNext) {
          this.hideNext = false;
        } else {
          this.hideNext = true;
        }
        if (element.sub) {
          element.sub.forEach(ele => {
            if (!ele.hideBack) {
              this.hideBack = false;
            } else {
              this.hideBack = true;
            }
            if (!ele.hideSave) {
              this.hideSave = false;
            } else {
              this.hideSave = true;
            }
            if (!ele.hideSaveDraft) {
              this.hideSaveDraft = false;
            } else {
              this.hideSaveDraft = true;
            }
            if (!ele.hideCancel) {
              this.hideCancel = false;
            } else {
              this.hideCancel = true;
            }
            if (!ele.hideNext) {
              this.hideNext = false;
            } else {
              this.hideNext = true;
            }
          })
        }
      });
    }

  }

  changeTab(url, params, queryParams, $event, name?) {
    console.log(this.router);
    if (url == this.router.url.split(";")[0] && this.router['currentUrlTree']['queryParams'].tab == queryParams.tab) {
      return;
    }
    this.routeParams = this.service.getParams();
    this.changeTabObj = {
      url: url,
      params: this.routeParams,
      queryParams: queryParams,
      name: name.name
    }
    this.service.setUpcomingTab(this.changeTabObj);
    if (this.showButtons) {
      setTimeout(() => {
        this.selectedTab = this.changedTab;
        console.log(this.selectedTab);
        let tabs = this.selectedTab.activeId.split("-").slice(1);
        if (tabs.length == 1) {
          let tabElement = <any>this.t;
          tabElement.select(this.selectedTab.activeId);
          //this.mainTabIndex = tabs[0];
        }
        if (tabs.length == 2) {
          let tabEle = <any>this.t1;
          tabEle.select(this.selectedTab.activeId);
          //   this.subTabIndex = tabs[1];
        }
      }, 0)
      setTimeout(() => {
        this.service.tabChange();
      }, 100);
    }
    else {
      console.log(this.router, this.changeTabObj.url);
      this.router.navigate([this.changeTabObj.url, this.changeTabObj.params ? this.changeTabObj.params : {}], { queryParams: this.changeTabObj.queryParams ? this.changeTabObj.queryParams : {}, queryParamsHandling: "merge" });
    }

  }



}
