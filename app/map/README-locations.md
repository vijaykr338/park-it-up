# Adding New Location Data

This guide explains how to add new parking location datasets to your generalized parking app.

## Quick Start

1. **Prepare your data**: Save your new location's parking data as a JSON file (e.g., `connaught-place-parking-cache.json`)

2. **Import the data**: Add the import to `parking-data-manager.ts`:
```typescript
import connaughtPlaceData from './connaught-place-parking-cache.json';
```

3. **Add to datasets**: Update the `INITIAL_DATASETS` array:
```typescript
const INITIAL_DATASETS: LocationDataset[] = [
  {
    id: 'nehru-place',
    name: 'Nehru Place',
    center: { lat: 28.549, lng: 77.25 },
    data: nehruPlaceData,
  },
  {
    id: 'connaught-place',
    name: 'Connaught Place',
    center: { lat: 28.6328, lng: 77.2197 },
    data: connaughtPlaceData,
  },
  // Add more locations here...
];
```

## Location Dataset Structure

Each location requires:

- **id**: Unique identifier (kebab-case recommended)
- **name**: Display name for the location
- **center**: Map center coordinates `{ lat: number, lng: number }`
- **data**: Raw parking data array (same format as Google Places API response)

## Data Format

Your JSON data should follow the Google Places API format:
```json
[
  {
    "business_status": "OPERATIONAL",
    "geometry": {
      "location": {
        "lat": 28.5402933,
        "lng": 77.2370633
      }
    },
    "name": "Parking Lot Name",
    "place_id": "unique_place_id",
    "rating": 4.2,
    "user_ratings_total": 156,
    "vicinity": "Address or vicinity",
    "photos": [
      {
        "photo_reference": "photo_reference_string"
      }
    ]
  }
]
```

## Dynamic Addition

You can also add datasets programmatically:

```typescript
import { parkingDataManager } from './parking-data-manager';

// Add a new dataset at runtime
parkingDataManager.addDataset({
  id: 'new-location',
  name: 'New Location',
  center: { lat: 28.0000, lng: 77.0000 },
  data: newLocationData
});
```

## Features

- **Automatic Processing**: Raw data is automatically converted to the app's format
- **Location Switching**: Users can switch between locations using the dropdown
- **Map Centering**: Map automatically centers on the selected location
- **Cost Savings**: No API calls needed - all data is cached locally
- **Search**: Local search works across all locations

## File Structure

```
app/map/
├── parking-data-manager.ts     # Main data management
├── LocationSelector.tsx        # Location dropdown component
├── nehru-place-parking-cache.json  # Sample data
├── your-new-location.json      # Your new location data
└── ...
```

## Notes

- The location selector only appears when multiple locations are available
- Data processing includes random price generation and other enhancements
- Search functionality works within the currently selected location
- All Google Places API dependencies have been removed for cost savings
