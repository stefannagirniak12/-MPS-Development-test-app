import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { RoutePointFormComponent } from './components/route-point-form/route-point-form.component';
import { PointListComponent } from './components/point-list/point-list.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component'; import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    RoutePointFormComponent,
    PointListComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
