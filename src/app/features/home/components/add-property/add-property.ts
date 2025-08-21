import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PropertyService } from '../../services';
import { Button, LeaseType, PriceMode, PropertyType } from '../../../../shared';
import { AlertService } from '../../../../shared/services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-property',
  imports: [ReactiveFormsModule, CommonModule, Button],
  templateUrl: './add-property.html',
  styleUrl: './add-property.scss',
})
export class AddProperty implements OnInit {
  propertyForm: FormGroup;
  amenitiesList: Array<any> = [];
  priceMode: Array<{
    label: string;
    value: number;
  }> = [];
  private fb = inject(FormBuilder);
  private propertyService = inject(PropertyService);
  private alertService = inject(AlertService);
  propertyTypes: Array<{
    label: string;
    value: number;
  }> = [];
  leaseType: Array<{
    label: string;
    value: number;
  }> = [];
  private router = inject(Router);
  constructor() {
    this.propertyForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      ownerName: ['', Validators.required],
      location: ['', Validators.required],
      size: ['', Validators.required],
      expectedRent: ['', [Validators.required, Validators.min(0)]],
      leaseType: [1, Validators.required],
      priceMode: [1, Validators.required],
      type: [1, Validators.required],
      isFurnished: [false],
      isShared: [false],
      featured: [false],
      amenities: this.fb.array([]),
      images: [null],
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.propertyForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
  ngOnInit(): void {
    setTimeout(() => this.getEnumData());
    this.getAmenities();
  }
  onAmenityChange(event: any) {
    const amenities: FormArray = this.propertyForm.get(
      'amenities'
    ) as FormArray;
    if (event.target.checked) {
      amenities.push(this.fb.control(event.target.value));
    } else {
      const index = amenities.controls.findIndex(
        (x) => x.value === event.target.value
      );
      amenities.removeAt(index);
    }
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.propertyForm.patchValue({ images: [base64String] });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.propertyForm.valid) {
      this.propertyService.add(this.propertyForm.value);
      this.alertService.success('Property added successfully');
      this.router.navigate(['home']);
    }
  }

  private async getAmenities() {
    this.amenitiesList = await this.propertyService.getAmenities();
  }

  private getEnumData() {
    //get price mode
    this.priceMode = Object.keys(PriceMode)
      .filter((key) => isNaN(Number(key)))
      .map((key) => ({
        label: key,
        value: PriceMode[key as keyof typeof PriceMode],
      }));
    //get lease type
    this.leaseType = Object.keys(LeaseType)
      .filter((key) => isNaN(Number(key)))
      .map((key) => ({
        label: key,
        value: LeaseType[key as keyof typeof LeaseType],
      }));

    //get property types
    this.propertyTypes = Object.keys(PropertyType)
      .filter((key) => isNaN(Number(key)))
      .map((key) => ({
        label: key,
        value: PropertyType[key as keyof typeof PropertyType],
      }));
  }
}
