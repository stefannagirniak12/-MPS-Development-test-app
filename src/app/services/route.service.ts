import { Injectable } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import { Point } from '../models/point.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  private pointsSource = new BehaviorSubject<Point[]>([]);
  points$ = this.pointsSource.asObservable();


  constructor(private http: HttpClient) { }
  
  addPoint(point: Point): void {
    const points = [...this.pointsSource.value, point];
    this.updatePointNumbers(points);
    this.pointsSource.next(points);
  }

  updatePoint(updatedPoint: Point): void {
    const points = this.pointsSource.value.map(point =>
      point.number === updatedPoint.number ? updatedPoint : point
    );
    this.pointsSource.next(points);
  }

  deletePoint(pointNumber: number): void {
    const points = this.pointsSource.value.filter(point => point.number !== pointNumber);
    this.updatePointNumbers(points);
    this.pointsSource.next(points);
  }

  resetPoints(){
    this.updatePointNumbers([]);
    this.pointsSource.next([]);
  }

  private updatePointNumbers(points: Point[]): void {
    points.forEach((point, index) => {
      point.number = index + 1;
    });
  }

  sendPointsToServer(): void {
    const points = this.pointsSource.value;
    const pointsData = JSON.stringify(points);
    const mockServerUrl = 'https://jsonplaceholder.typicode.com/posts';  // Example mock server endpoint

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post(mockServerUrl, pointsData, { headers }).pipe(take(1)).subscribe({
      next: (response) => {
        console.log('Data sent successfully to server:', response);
        this.resetPoints();
      },
      error: (error) => {
        console.error('Error sending data to server:', error);
      }
    });
  }
}
