import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class DatatableService {
  constructor(private http:HttpClient){

  }
  getDataTableData(url, data, method, body) {
    let preludeFilter: string = '';
    if(data.preludeStudyId)
      preludeFilter = `&preludeStudyId=${data.preludeStudyId}`;
    if (method == "POST") {
      return this.http.post((url.indexOf("?") != -1 ? url + "&" : url + "?") + "startIndex=" + data.startIndex + "&limit=" + data.limit + "&filterType=" + data.filterType +  "&filterValue=" + data.filterValue + "&sortBy=" + data.sortByColumn + "&order=" + data.sortDirection + "&searchText=" + data.searchText + "&startDate=" + data.startDate + "&endDate=" + data.endDate + preludeFilter, body, { params: data.params });
    }
    return this.http.get((url.indexOf("?") != -1 ? url + "&" : url + "?") + "startIndex=" + data.startIndex + "&limit=" + data.limit + "&filterType=" + data.filterType +  "&filterValue=" + data.filterValue + "&sortBy=" + data.sortByColumn + "&order=" + data.sortDirection + "&searchText=" + data.searchText + "&startDate=" + data.startDate + "&endDate=" + data.endDate + preludeFilter, { params: data.params });
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data']
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }
}