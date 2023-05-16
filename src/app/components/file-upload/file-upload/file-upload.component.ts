import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";

const noop = () => { };
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FileUploadComponent),
    multi: true
  }]
})

export class FileUploadComponent implements ControlValueAccessor {
  public file: any;
  fileImage: any;
  private innerValue: any = '';
  @Input() disableBtn: boolean = false;
  @Input() Page: any = '';
  @Input() validTypes: any[];
  @Input() ngModel: any;
  @Input() fileSize: any;
  @Input() fileLength: any;
  @Input() fileFormat: any;

  @Input() bulkuploadText: boolean;
  @Output() selectedItem = new EventEmitter();
  excelType: any;
  fileType: any;
  constructor(
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }
  ngOnChanges() {
    // this.innerValue = this.selectedItem.emit(this.files);
    // console.log(" this.innerValue", this.innerValue)
  }
  ngAfterViewInit() {
    // this.innerValue =  this.selectedItem.emit(this.files);
    // console.log(" this.innerValue", this.innerValue)
  }


  files: any = [];
  fileNameArr: any = [];
  click(event) {
    console.log("uploadFile", event);
    event.target.value = '';
  }
  uploadFile(event) {
    console.log("uploadFile", event);
    // debugger;
    this.file = event[0];


    if (this.file != undefined) {

      //check file type
      // this.excelType = 
      console.log("filename", this.file.name)
      if (this.file.name) {
        let fileext = this.file.name.split(".")[1];
        if (fileext == 'doc' || fileext == 'docx' || fileext == 'dotx' || fileext == 'docm' || fileext == 'dotm') {
          this.fileType = 'word'
        }
        if (fileext == 'xls' || fileext == 'xlsx' || fileext == 'xlsm' || fileext == 'xlsb' || fileext == 'xltx') {
          this.fileType = 'excel'
        }
        // if(fileext == 'doc') {
        //   this.fileType = 'excel'
        // }

      }
      let mimeType = this.file['type'];
      console.log("this.validTypes", this.validTypes);
      console.log("this.mimeType", mimeType);
      console.log("this.file", this.file.name);
      let ext = this.file.name.split('.').pop();
      if (this.fileFormat == 'csv') {
        // alert("went")
        if (this.file.name.includes(".csv")) {
          // alert("yes")
          this.toastr.error('Only ' + this.validTypes + ' formats are supported. Please upload valid type!');
          return;
        }
      }

      if (this.validTypes) {
        if (!this.validTypes.includes(ext) && !this.validTypes.includes(mimeType)) {
          this.toastr.error('Only ' + this.validTypes + ' formats are supported. Please upload valid type!');
          return false;
        }
        else {

          //1mb = 1048576
          if (this.file.size > this.fileSize) {
            this.toastr.error('size must be less than' + this.fileSize);
            return false;
          }

          if (this.Page == 'addSupportMat') {
            if (this.files.length > 0 && this.files.length >= this.fileLength) {
              this.toastr.error("Cannot upload more than 5 files at a time.");
              return false;
            }
          }
          else {
            if (this.files.length > 0 && this.files.length <= this.fileLength) {
              this.toastr.error("Cannot upload more than one file at a time.");
              return false;
            }
          }

          for (let index = 0; index < event.length; index++) {
            const element = event[index];
            console.log(element);
            this.files.push(element);
            this.fileNameArr.push(element.name);
          }
          this.ngModel = this.fileNameArr;
          this.onChangeCallback(this.fileNameArr);
          this.selectedItem.emit(this.files);
        }
      }
      else {

        //1mb = 1048576
        if (this.file.size > this.fileSize) {
          this.toastr.error('size must be less than' + this.fileSize);
          return false;
        }

        if (this.Page == 'addSupportMat') {
          if (this.files.length > 0 && this.files.length >= this.fileLength) {
            this.toastr.error("Cannot upload more than 5 files at a time.");
            return false;
          }
        }
        for (let index = 0; index < event.length; index++) {
          const element = event[index];
          console.log(element);
          this.files.push(element);
          this.fileNameArr.push(element.name);
        }
        this.ngModel = this.fileNameArr;
        this.onChangeCallback(this.fileNameArr);
        this.selectedItem.emit(this.files);
      }
    }
  }
  deleteAttachment(index) {
    this.files.splice(index, 1);
    console.log("this.files", this.files);
    this.ngModel = this.fileNameArr;
    this.onChangeCallback(this.fileNameArr);
    this.selectedItem.emit(this.files);
  }


  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  //get accessor
  get value(): any {
    return this.innerValue;
  };

  //set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCallback(v);
    }
  }

  //Set touched on blur
  onBlur() {
    this.onTouchedCallback();
  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    if (value !== this.innerValue) {
      this.innerValue = value;
    }
  }

  //From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }


}
