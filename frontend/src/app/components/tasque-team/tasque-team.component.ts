import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { UserModel } from 'src/core/models/user/user-model';
import { ProjectService } from 'src/core/services/project.service';

@Component({
  selector: 'app-tasque-team',
  templateUrl: './tasque-team.component.html',
  styleUrls: ['./tasque-team.component.sass'],
})
export class TasqueTeamComponent implements OnInit {
  icon = faMagnifyingGlass;

  public loaded: UserModel[];
  public visible: UserModel[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
  ) {}

  ngOnInit(): void {
    const id = this.route.parent?.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['not-found']);
      return;
    }

    this.projectService
      .getProjectParticipants(parseInt(id))
      .subscribe((res) => {
        this.loaded = res.body as Array<UserModel>;
        this.visible = this.loaded;
      });
    this.visible = this.loaded;
  }

  public filter(val: string): void {
    this.visible = this.loaded.filter((user) =>
      user.name?.toLowerCase().includes(val.toLowerCase()),
    );
  }
}
