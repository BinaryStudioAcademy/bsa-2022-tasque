import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tasque-project-settings',
  templateUrl: './tasque-project-settings.component.html',
  styleUrls: ['./tasque-project-settings.component.sass']
})
export class TasqueProjectSettingsComponent implements OnInit {

  public projectId: number;
  public columnButtonText = 'Column and statuses';
  public issueTypesText = 'Issue types';
  public issueTemplateText = 'Basic issue template';

  constructor(
    public router: Router,
  ) { }

  ngOnInit(): void {
    
  }

  moveToIssueTemplates(): void {
    this.router.navigate(['project/issue-template']);
  }
}
