import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PropertyService } from '../../services';
import {
  ButtonComponent,
  IUser,
  LeaseType,
  PriceMode,
  PropertyType,
} from '../../../../shared';
import { AlertService } from '../../../../shared/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth';

@Component({
  selector: 'app-add-property',
  imports: [ReactiveFormsModule, CommonModule, ButtonComponent],
  templateUrl: './add-property.component.html',
  styleUrl: './add-property.component.scss',
})
export class AddPropertyComponent implements OnInit {
  propertyForm: FormGroup;
  amenitiesList: Array<any> = [];
  priceMode: Array<{
    label: string;
    value: number;
  }> = [];
  activeUser: IUser | null = null;
  private fb = inject(FormBuilder);
  private propertyService = inject(PropertyService);
  private alertService = inject(AlertService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  propertyTypes: Array<{
    label: string;
    value: number;
  }> = [];
  leaseType: Array<{
    label: string;
    value: number;
  }> = [];
  constructor() {
    effect(async () => {
      this.activeUser = this.authService.currentUser();
    });
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
      images: this.fb.array([]),
    });
  }

  get imageArray() {
    return this.propertyForm.get('images') as FormArray;
  }

  get amenitiesArray() {
    return this.propertyForm.get('amenities') as FormArray;
  }

  isInvalid(controlName: string): boolean {
    const control = this.propertyForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
  ngOnInit(): void {
    this.leaseType = this.propertyService.leaseType;
    this.priceMode = this.propertyService.priceModeArr;
    this.propertyTypes = this.propertyService.propertyTypes;
    this.getAmenities();
    this.getPropertyDetailsInEdit();
  }

  onAmenityChange(event: any) {
    if (event.target.checked) {
      this.amenitiesArray.push(this.fb.control(Number(event.target.value)));
    } else {
      const index = this.amenitiesArray.controls.findIndex(
        (x) => x.value === event.target.value
      );
      this.amenitiesArray.removeAt(index);
    }
  }

  removeImage(index: number) {
    this.imageArray.removeAt(index);
  }

  onImageSelected(event: any) {
    console.log(event.target.files);
    const files = event.target.files;
    for (let file of files) {
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result as string;
          this.imageArray.push(this.fb.control(base64String));
        };
        reader.readAsDataURL(file);
      }
    }
    event.target.value = '';
  }

  async onSubmit() {
    if (this.propertyForm.valid) {
      const propId = Number(this.activatedRoute.snapshot.params['id']);
      if (!isNaN(propId)) {
        await this.propertyService.update(propId, {
          ...this.propertyForm.value,
          ownerId: this.activeUser!.id,
        });
        this.alertService.success('Property updated successfully');
      } else {
        await this.propertyService.add({
          ...this.propertyForm.value,
          ownerId: this.activeUser!.id,
        });
        this.alertService.success('Property added successfully');
      }

      this.router.navigate(['my-properties']);
    }
  }

  private async getAmenities() {
    this.amenitiesList = await this.propertyService.getAmenities();
  }

  

  private async getPropertyDetailsInEdit() {
    const propertyId = Number(this.activatedRoute.snapshot.params['id']);
    if (!isNaN(propertyId)) {
      const property = await this.propertyService.getById(propertyId);
      if (property) {
        this.propertyForm.patchValue({
          title: property.title,
          description: property.description,
          ownerName: property.ownerName,
          location: property.location,
          size: property.size,
          expectedRent: property.expectedRent,
          leaseType: property.leaseType,
          priceMode: property.priceMode,
          type: property.type,
          isFurnished: property.isFurnished,
          isShared: property.isShared,
          featured: property.featured,
        });
        property.amenities.forEach((id) =>
          this.amenitiesArray.push(new FormControl(id))
        );
        property.images.forEach((img) =>
          this.imageArray.push(new FormControl(img))
        );
      }
    }
  }
}
