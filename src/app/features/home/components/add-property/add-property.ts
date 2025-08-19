import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HomeAPIService } from '../../services';
import { Button, LeaseType, PriceMode, PropertyType } from '../../../../shared';

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
  private homeService = inject(HomeAPIService);
  propertyTypes: Array<{
    label: string;
    value: number;
  }> = [];
  leaseType: Array<{
    label: string;
    value: number;
  }> = [];
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
      image: [null],
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.propertyForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
  ngOnInit(): void {
    this.priceMode = Object.keys(PriceMode)
      .filter((key) => isNaN(Number(key)))
      .map((key) => ({
        label: key,
        value: PriceMode[key as keyof typeof PriceMode],
      }));
    this.leaseType = Object.keys(LeaseType)
      .filter((key) => isNaN(Number(key)))
      .map((key) => ({
        label: key,
        value: LeaseType[key as keyof typeof LeaseType],
      }));
    this.homeService.getAmenities().subscribe((res) => {
      this.amenitiesList = res;
    });

    this.propertyTypes = Object.keys(PropertyType)
      .filter((key) => isNaN(Number(key)))
      .map((key) => ({
        label: key,
        value: PropertyType[key as keyof typeof PropertyType],
      }));
    this.homeService.getAmenities().subscribe((res) => {
      this.amenitiesList = res;
    });
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
      this.propertyForm.patchValue({ image: file });
    }
  }

  onSubmit() {
    if (this.propertyForm.valid) {
      console.log(
        'Form Data to Submit:',
        this.propertyForm.value
      );
      alert('Property submitted!');
    }
  }
}
