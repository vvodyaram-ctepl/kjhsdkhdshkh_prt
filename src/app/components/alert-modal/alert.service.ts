import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AlertModalComponent, ConfirmState } from './alert-modal.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


interface ConfirmOptions {
    /**
     * The title of the confirmation modal
     */
    title: string,
  
    /**
     * The message in the confirmation modal
     */
    message: string,

    activityName?: string,
    activityColor?: string,

    extraMessage?: string
  }
  
  @Injectable({
    providedIn: 'root',
  })
export class AlertService {
    ConfirmOptions:any;
    modalRef2: NgbModalRef;
    navigateAwaySelection: Subject<boolean> = new Subject<boolean>();
    // constructor(private modalService: NgbModal) { }
    constructor(private modalService: NgbModal, private state: ConfirmState) {}
    /**
   * Opens a confirmation modal
   * @param options the options for the modal (title and message)
   * @returns {Promise<any>} a promise that is fulfilled when the user chooses to confirm, and rejected when
   * the user chooses not to confirm, or closes the modal
   */
  confirm(options ?: ConfirmOptions): Promise<boolean> {
    this.state.options = options;
    this.state.modal = this.modalService.open(AlertModalComponent,{
                    size:'xs',
                    windowClass: 'smallModal',
                    backdrop: 'static',
                    keyboard: false
                  });
    console.log("this.state.modal.result",this.state.modal.result);
    return this.state.modal.result;
  }
}