import { Component, OnInit } from '@angular/core';
import {Degree} from '../../models/Degree';
import {DegreeService} from '../../services/degree.service';
import {StudentGroup} from "../../models/StudentGroup";
import {GroupService} from "../../services/group.service";
import {StudentDegree} from "../../models/StudentDegree";
import {PersonalFileGradesStatementService} from "../../services/personal-file-grades-statement.service";

@Component({
  selector: 'personal-file-grades-statement',
  templateUrl: './personal-file-grades-statement.component.html',
  styleUrls: ['./personal-file-grades-statement.component.scss']
})
export class PersonalFileGradesStatementComponent implements OnInit {
  degrees: Degree[];
  currentDegree: Degree;

  groups: StudentGroup[];
  currentGroups: StudentGroup[];

  fullTime: boolean;
  partTime: boolean;

  years: Array<number>;
  selectedYear: number;

  studyYearsForDocument: Array<number>;
  selectedStudyYearForDocument: number;

  isButtonLoadDisabled = false;

  personalFileGradesStatementLoading = false;

  constructor(private groupService: GroupService, private degreeService: DegreeService,
              private personalFileGradesStatementService: PersonalFileGradesStatementService) {
  }

  initStudyYearsForDocument() {
    var year = (new Date()).getFullYear();
    var month = (new Date()).getUTCMonth() + 1;

    if(month > 6) {
      this.selectedStudyYearForDocument = year - 1;
    } else {
      this.selectedStudyYearForDocument = year - 2;
    }

    this.studyYearsForDocument = [];
    for(var i = 0; i < 6; i++ ) {
      this.studyYearsForDocument.push(this.selectedStudyYearForDocument - i);
    }
  }

  ngOnInit() {
    this.initStudyYearsForDocument();

    this.fullTime = true;
    this.partTime = true;

    this.years = [1, 2, 3, 4, 5];
    this.selectedYear = 1;

    this.degreeService.getDegrees()
      .subscribe(degrees => {
        this.degrees = degrees;
        if (this.degrees) {
          this.currentDegree = this.degrees[0];
          this.onDegreeChange();
        }
      });
  }

  onDegreeChange(): void {
    this.selectedYear = 1;
    this.groupService.getGroupsByDegreeAndYear(this.currentDegree.id, this.selectedYear)
      .subscribe(groups => {
        this.groups = groups;
        this.currentGroups = this.groups;
        this.checkAllStudents();
      });
  }

  onYearChange(): void {
    this.groupService.getGroupsByDegreeAndYear(this.currentDegree.id, this.selectedYear)
      .subscribe(groups => {
        if (groups) {
          this.groups = groups;
        }
        this.currentGroups = this.groups;
        this.checkAllStudents();
      });
  }

  checkAllStudents(): void {
    for(var currentGroup of this.currentGroups) {
      currentGroup.checked = true;
      for(var studentDegree of currentGroup.studentDegrees) {
        studentDegree.checked = true;
      }
    }
  }

  onCurrentGroupsChange(): void {
    this.updateButtonLoad();
  }

  onFullTimeChange(): void {
    if(!this.partTime) {
       this.partTime = true;
    }
  }

  onPartTimeChange(): void {
    if(!this.fullTime) {
       this.fullTime = true;
    }
  }

  onSelectAllGroups(): void {
    this.currentGroups = this.groups;
    this.checkAllStudents();
    this.updateButtonLoad();
  }

  onCheckAllStudentsOfGroup(checked, studentDegrees): void {
    for(var studentDegree of studentDegrees) {
      studentDegree.checked = checked;
    }
    this.updateButtonLoad();
  }

  onCheckStudent(currentGroup): void {
    currentGroup.checked = this.isAllStudentsChecked();
    this.updateButtonLoad();
  }

  isAllStudentsChecked(): void {
    var result = true;
    for(var currentGroup of this.currentGroups) {
      for(var studentDegree of currentGroup.studentDegrees) {
        if(!studentDegree.checked) {
          result = false;
        }
      }
    }
    return result;
  }

  updateButtonLoad(): void {
    this.isButtonLoadDisabled = this.isBlankList();
  }

  isBlankList(): boolean {
    var result = true;
    for(var currentGroup of this.currentGroups) {
      for(var studentDegree of currentGroup.studentDegrees) {
        if(studentDegree.checked) {
          result = false;
        }
      }
    }
    return result;
  }

  onPersonalFileGradesStatementBuild(): void {
    let studentIds = [];
    for(var currentGroup of this.currentGroups) {
      for(var studentDegree of currentGroup.studentDegrees) {
        if(studentDegree.checked) {
          studentIds.push(studentDegree.student.id);
        }
      }
    }
    console.log(studentIds);
    let groupIds = [];
    for(var currentGroup of this.currentGroups) {
        groupIds.push(currentGroup.id);
    }
    this.personalFileGradesStatementLoading = true;
    this.personalFileGradesStatementService.buildPersonalFileGradesStatement(this.selectedStudyYearForDocument, groupIds).subscribe(a => {
        this.personalFileGradesStatementLoading = false;
      }
    );
  }
}
