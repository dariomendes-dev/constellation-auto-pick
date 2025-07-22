import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { VehicleService } from '../../../core/services/vehicle.service';
import { MatButtonModule } from '@angular/material/button';
import { IVehicle } from '../../../core/models/vehicle.model';
import { CAR_PLACEHOLDER_IMAGES } from '../../../core/constants/vehicle-images.const';
import { ViewStateService } from '../../../core/services/view-state.service';

@Component({
  selector: 'app-vehicle-details',
  imports: [CommonModule, MatChipsModule, MatButtonModule, MatIcon, CurrencyPipe, DatePipe],
  templateUrl: './vehicle-details.html',
  styleUrl: './vehicle-details.scss',
})
export class VehicleDetails implements OnInit, OnDestroy {
  vehicle!: IVehicle;
  selectedImageIndex = 0;
  showArrows = false;
  timeRemaining = '';
  timerInterval!: ReturnType<typeof setInterval>;

  carImages: string[] = CAR_PLACEHOLDER_IMAGES;
  constructor(private router: Router, private vehicleService: VehicleService, private viewStateService: ViewStateService) {}

  ngOnInit(): void {
    this.vehicle = this.vehicleService.selectedVehicle;
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (!this.vehicle) {
      this.router.navigate([''], {
        queryParams: this.viewStateService.toQueryParams(),
      });
      return;
    }

    this.startCountdown();
  }

  toggleFavourite(): void {
    this.vehicleService.toggleFavourite(this.vehicle);
    this.vehicle.favourite = !this.vehicle.favourite;
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  nextImage(): void {
    this.selectedImageIndex = (this.selectedImageIndex + 1) % this.carImages.length;
    console.log(this.selectedImageIndex);
  }

  prevImage(): void {
    this.selectedImageIndex = (this.selectedImageIndex - 1 + this.carImages.length) % this.carImages.length;
  }

  goBack() {
    this.router.navigate([''], {
      queryParams: this.viewStateService.toQueryParams(),
    });
  }
  /**
   * Starts a countdown if the current date is prior to the auctionDateTime
   */
  private startCountdown(): void {
    const auctionDate = new Date(this.vehicle.auctionDateTime).getTime();

    this.timerInterval = setInterval(() => {
      const now = Date.now();
      const diff = auctionDate - now;

      if (diff <= 0) {
        this.timeRemaining = 'Auction started';
        clearInterval(this.timerInterval);
        return;
      }

      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      this.timeRemaining = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}
