import { Component, Inject, ViewEncapsulation, OnInit, Injectable, TemplateRef, Directive } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Injectable()
export class ConfirmState {
  /**
   * The last options passed ConfirmService.confirm()
   */
  options: ConfirmOptions;

  /**
   * The last opened confirmation modal
   */
  modal: NgbModalRef;

  /**
   * The template containing the confirmation modal component
   */
  template: TemplateRef<any>;
}

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

@Component({
  selector: 'alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AlertModalComponent implements OnInit {

  options: ConfirmOptions;
  message: string;

  constructor(private state: ConfirmState) {
    this.options = state.options;
  }

  yes() {
    this.state.modal.close(true);

  }

  no() {
    this.state.modal.dismiss(false);
  }

  ngOnInit() {
    if (!this.state.options?.message)
      this.message = 'You have unsaved data on this page. Do you still wish to move?';
    else
      this.message = this.state.options.message;
  }
}
