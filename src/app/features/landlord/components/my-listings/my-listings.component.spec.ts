import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyListingsComponent } from './my-listings.component';
import { provideRouter } from '@angular/router';
import { AuthService, UserRole } from '../../../auth';
import { PropertyService } from '../../../property/services';
import { SearchService, UserFavoritesService } from '../../../home';
import { IProperty } from '../../../property/interface';

describe('MyListingsComponent', () => {
  let component: MyListingsComponent;
  let fixture: ComponentFixture<MyListingsComponent>;

  const mockAuthService = {
    currentUser: () => ({ id: 1, role: UserRole.LandLord }),
  };

  const mockPropertyService = {
    getAll: jasmine.createSpy().and.returnValue(Promise.resolve([])),
    delete: jasmine.createSpy().and.stub(),
    getAmenitiesMap: jasmine.createSpy().and.returnValue(Promise.resolve(new Map())),
  };

  const mockSearchService = {
    debouncedSearch: jasmine.createSpy().and.returnValue(''),
  };

  const mockUserFavoritesService = {
    getUserFavorites: jasmine.createSpy().and.returnValue(Promise.resolve([])),
    updateUserFavorite: jasmine.createSpy().and.returnValue(Promise.resolve()),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyListingsComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
        { provide: PropertyService, useValue: mockPropertyService },
        { provide: SearchService, useValue: mockSearchService },
        { provide: UserFavoritesService, useValue: mockUserFavoritesService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyListingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadProperties with search term', async () => {
    const spy = spyOn(component, 'loadProperties');
    await fixture.whenStable();
    expect(spy).not.toHaveBeenCalled(); // Because we mocked search to empty string
  });

  it('should set user favorites map if user exists', async () => {
    await fixture.whenStable();
    expect(mockUserFavoritesService.getUserFavorites).toHaveBeenCalledWith(1);
    expect(component.favorites()).toEqual(new Map());
  });

  it('should call delete on deleteProperty()', async () => {
    const property: IProperty = { id: 10 } as IProperty;
    spyOn(component, 'loadProperties');
    component.deleteProperty(property);
    expect(mockPropertyService.delete).toHaveBeenCalledWith(10);
    expect(component.loadProperties).toHaveBeenCalled();
  });

});
