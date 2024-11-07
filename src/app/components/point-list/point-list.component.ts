import { Component, OnInit } from '@angular/core';
import { RouteService } from '../../services/route.service';
import { Point } from '../../models/point.model';

@Component({
  selector: 'app-point-list',
  templateUrl: './point-list.component.html',
  styleUrls: ['./point-list.component.scss']
})
export class PointListComponent implements OnInit {
  points: Point[] = [];

  constructor(private routeService: RouteService) {}

  ngOnInit(): void {
    this.routeService.points$.subscribe(points => {
      this.points = points;
    });
  }

  sendPointsToServer(){
    this.routeService.sendPointsToServer();
  }

  resetPoints(){
    this.routeService.resetPoints()
  }
}
