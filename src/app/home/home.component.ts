import { Component, inject, OnInit } from '@angular/core';
import { MapComponent } from '@home/map/map.component';
import { AllData } from '@models/interfaces';
import { MapService } from '@services/map.service';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgxSpinnerModule, MapComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  isLoading = true;

  mapsService = inject(MapService);
  allData!: AllData;

  constructor(
    private readonly spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.spinner.show();
    this.mapsService.getAll().subscribe({
      next: (response) => {
        this.allData = response;
        this.isLoading = false;
        this.spinner.hide();
      },
      error: (_) => {
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }
}
