import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Point } from '../../models/point.model';

@Component({
  selector: 'app-route-point-form',
  templateUrl: './route-point-form.component.html',
  styleUrl: './route-point-form.component.scss'
})
export class RoutePointFormComponent {
  @Input() point!: Point;
  @Output() updatePoint = new EventEmitter<Point>();
  @Output() deletePoint = new EventEmitter<Point>();

  onSave(): void {
    this.updatePoint.emit(this.point);
  }

  onDelete(): void {
    this.deletePoint.emit(this.point);
  }
}
