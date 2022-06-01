import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import * as mapboxgl from 'mapbox-gl';
import { environment } from "../../../../environments/environment";
import { MapService } from "../../../services/map/map.service";
import { MainLayoutService } from "../../../services/main-layout.service";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @ViewChild('mapboxContainer', {static: true})
  public mapboxContainerRef: ElementRef | undefined;


  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 37.75;
  lng = -122.41;
  zoom = 9;


  constructor(private mapService: MapService, public layoutService: MainLayoutService) {
    // @ts-ignore
    mapboxgl.accessToken = environment.mapbox.accessToken
  }

  ngOnInit(): void {
    this.mapService.initializeMap({
      mapboxContainer: this.mapboxContainerRef,
    })
  }
}
