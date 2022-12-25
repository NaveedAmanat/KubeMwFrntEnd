import { Component, OnInit, ViewChild } from '@angular/core';
import { ComplianceService } from 'src/app/shared/services/compliance.service';
import { Router } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-compliance',
  templateUrl: './compliance.component.html',
  styleUrls: ['./compliance.component.css']
})
export class ComplianceComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any;
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
  dataSource: any;
  genderSelected: string;
  listing: any;
  constructor(private complianceService: ComplianceService,
    private router: Router) { }
    visitType = [{ seq: 1, desc: "Regular" }, { seq: 2, desc: "Floor" }, { seq: 3, desc: "ADC" }]
  ngOnInit() {
    // this.displayedColumns = ['brnchCd', 'brnchNm', 'trgt', 'lstVstDt', 'cmpltdVsts', 'remaing', 'rank', 'action'];
    this.displayedColumns = ['regNm','areaNm', 'brnchNm','vstTyp', 'trgt', 'cmpltdVsts', 'remaing', 'action'];
    this.complianceService.getADTTarget().subscribe(res => {
      this.listing = res;
      this.dataSource = new MatTableDataSource(this.listing);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }
  loadTargetVisits(trgt) {
    localStorage.setItem("trgt", JSON.stringify(trgt));
    this.router.navigate(['compliance/compliance-branch']);
  }

  findVisitType(seq) {
    let visitType = "";
    this.visitType.forEach(ele => {
      if (ele.seq == seq) {
        visitType = ele.desc;
      }
    })
    return visitType;
  }
}
