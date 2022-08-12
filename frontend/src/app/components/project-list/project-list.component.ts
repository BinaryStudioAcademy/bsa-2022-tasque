import { Component, OnInit } from '@angular/core';
import { ProjectModel } from '../../../core/models/project/project-model';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.sass']
})
export class ProjectListComponent implements OnInit {

  public items:ProjectModel[] = [
    {
      id: 1,
      name: 'Test Project',
      authorId: 1,
      organizationId: 1,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    },
    {
      id: 2,
      name: 'Test Project 2',
      authorId: 1,
      organizationId: 1,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    },
    {
      id: 3,
      name: 'Test Project 3',
      authorId: 1,
      organizationId: 1,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    },
    {
      id: 4,
      name: 'Test Project 4',
      authorId: 1,
      organizationId: 1,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    },
    {
      id: 5,
      name: 'Test Project 5',
      authorId: 1,
      organizationId: 1,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    },
    {
      id: 6,
      name: 'Test Project 6',
      authorId: 1,
      organizationId: 1,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    },
    {
      id: 7,
      name: 'Test Project 7',
      authorId: 1,
      organizationId: 1,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    },
    {
      id: 8,
      name: 'Test Project 8',
      authorId: 1,
      organizationId: 1,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    },
    {
      id: 9,
      name: 'Test Project 9',
      authorId: 1,
      organizationId: 1,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    },
  ] ;
  constructor() { }

  ngOnInit(): void {
  }

}
