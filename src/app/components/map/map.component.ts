import { Component, ComponentFactoryResolver, OnInit, ViewContainerRef } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-draw'; 
import { Point } from '../../models/point.model';
import { RouteService } from '../../services/route.service';
import 'leaflet-polylinedecorator';
import { RoutePointFormComponent } from '../route-point-form/route-point-form.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  private map!: L.Map;
  private pointMarkers: L.Marker[] = []; 
  private polyline!: L.Polyline;
  private editPopupOpen: boolean = false;

  constructor(
    private routeService: RouteService,
    private resolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
    this.initializeMap();
    this.routeService.points$.subscribe(points => {
      this.updateRoute(points);
      if(points.length == 0){
        for(let marker of this.pointMarkers){
          marker.remove();
        }
      }
    });
  }

  private initializeMap(): void {
    this.map = L.map('map').setView([48.009218959872605, 37.80258178710938], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => this.onMapClick(e));

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      if (this.editPopupOpen) {
        this.editPopupOpen = false;
      }
    });
  }

  private onMapClick(e: L.LeafletMouseEvent): void {
    const newPoint: Point = {
      number: this.pointMarkers.length + 1,
      latitude: e.latlng.lat,
      longitude: e.latlng.lng,
      height: 0 
    };
    this.addPoint(newPoint);
  }

  private addPoint(point: Point): void {
    if (!this.editPopupOpen) {
      const myIcon = L.icon({
        iconUrl: 'assets/images/circle-dot-regular.svg',
        iconSize: [25, 25],
        iconAnchor: [13, 13],
        popupAnchor: [-3, -76],
        shadowUrl: 'assets/images/circle-dot-regular.svg',
        shadowSize: [25, 25],
        shadowAnchor: [13, 13]
      });
      const marker = L.marker([point.latitude, point.longitude], {
        draggable: true,
        icon: myIcon
      }).addTo(this.map);

      marker.on('click', () => this.openEditPopup(point, marker)); // Open edit form on click
      marker.on('dragend', (event) => this.updatePointLocation(event, point));

      this.pointMarkers.push(marker);
      this.routeService.addPoint(point);
    }
  }

  private updatePointLocation(event: L.LeafletEvent, point: Point): void {
    const marker = event.target as L.Marker;
    const position = marker.getLatLng();
    const updatedPoint = {
      ...point,
      latitude: position.lat,
      longitude: position.lng
    };
    this.routeService.updatePoint(updatedPoint);
  }

  private openEditPopup(point: Point, marker: L.Marker): void {
    marker.unbindPopup();
    marker.closePopup();

    this.editPopupOpen = true;
    const factory = this.resolver.resolveComponentFactory(RoutePointFormComponent);
    const componentRef = this.viewContainerRef.createComponent(factory);

    componentRef.instance.point = point;

    componentRef.instance.updatePoint.subscribe((updatedPoint: Point) => {

      marker.setLatLng({ lat: updatedPoint.latitude, lng: updatedPoint.longitude });
      this.routeService.updatePoint(updatedPoint);
      componentRef.destroy();
      setTimeout(() => {
        this.editPopupOpen = false;
      }, 100);
    });

    componentRef.instance.deletePoint.subscribe((deletedPoint: Point) => {
      this.deletePoint(deletedPoint, marker);
      componentRef.destroy();
      setTimeout(() => {
        this.editPopupOpen = false;
      }, 100);
    });

    const popupContent = componentRef.location.nativeElement;

    marker.bindPopup(popupContent);

    marker.openPopup();
  }


  private updateRoute(points: Point[]): void {
    if (this.polyline) {
      this.polyline.remove();
    }

    const latlngs: L.LatLngExpression[] = points.map(point => [point.latitude, point.longitude]);
    this.polyline = L.polyline(latlngs, {
      color: 'black',
      weight: 4
    }).addTo(this.map);

    this.clearArrows();

    this.addDirectionalArrows();
  }

  private clearArrows(): void {
    const decorators = (this.map as any)._layers;
    for (const layer in decorators) {
      if (decorators[layer] instanceof (L as any).PolylineDecorator) {
        this.map.removeLayer(decorators[layer]);
      }
    }
  }

  private addDirectionalArrows(): void {
    if (!this.polyline) return;

    const arrowDecorator = (L as any).polylineDecorator(this.polyline, {
      patterns: [
        {
          offset: '100px', 
          repeat: '100px',
          symbol: (L as any).Symbol.arrowHead({
            pixelSize: 10,
            polygon: false,
            pathOptions: { stroke: true, color: 'black' }
          })
        }
      ]
    });

    arrowDecorator.addTo(this.map);
  }


  deletePoint(point: Point, marker: L.Marker): void {
    marker.remove();
    this.pointMarkers = this.pointMarkers.filter(m => m !== marker);
    this.routeService.deletePoint(point.number);
  }

  sendPointsToServer(): void {
    this.routeService.sendPointsToServer(); 
  }
}
