import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
if (!API_KEY) {
  console.error("Error: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not defined in .env.local");
  process.exit(1);
}

const BASE_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

// Bounding box for Nehru Place, New Delhi
const NEHRU_PLACE_BOUNDS = {
  south: 28.54, // South latitude
  west: 77.24,  // West longitude
  north: 28.56, // North latitude
  east: 77.26   // East longitude
};

// Radius for each search in meters.
const SEARCH_RADIUS = 1000; // 1 km is good for a dense area

// Delay between API calls to avoid hitting rate limits (in milliseconds)
const REQUEST_DELAY = 250;

// File paths for cache and state
const CACHE_FILE_PATH = path.resolve(process.cwd(), 'app/map/nehru-place-parking-cache.json');
const STATE_FILE_PATH = path.resolve(process.cwd(), 'scripts/cache-state.json');


// --- Helper Functions ---

// Function to sleep for a specified duration
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- Main Caching Logic ---

async function fetchParkingData() {
  console.log("Starting to fetch parking data for Nehru Place...");
  
  // --- Load previous state and data ---
  let allParkingLots = new Map();
  let lastPosition = { lat: NEHRU_PLACE_BOUNDS.south, lng: NEHRU_PLACE_BOUNDS.west };

  try {
    const cacheData = await fs.readFile(CACHE_FILE_PATH, 'utf8');
    const cachedPlaces = JSON.parse(cacheData);
    cachedPlaces.forEach(place => allParkingLots.set(place.place_id, place));
    console.log(`Loaded ${allParkingLots.size} places from existing cache.`);
  } catch (error) {
    console.log("No existing cache file found. Starting fresh.");
  }

  try {
    const stateData = await fs.readFile(STATE_FILE_PATH, 'utf8');
    lastPosition = JSON.parse(stateData);
    console.log(`Resuming from last saved position: Lat ${lastPosition.lat.toFixed(4)}, Lng ${lastPosition.lng.toFixed(4)}`);
  } catch (error) {
    console.log("No state file found. Starting from the beginning of the bounding box.");
  }
  // --- End loading ---

  // Calculate grid steps based on radius
  const latStep = (SEARCH_RADIUS * 1.5) / 111111;
  const lngStep = (SEARCH_RADIUS * 1.5) / (111111 * Math.cos(NEHRU_PLACE_BOUNDS.south * Math.PI / 180));

  let requestCount = 0;
  let firstRunLat = true;

  for (let lat = lastPosition.lat; lat < NEHRU_PLACE_BOUNDS.north; lat += latStep) {
    // For subsequent latitude rows, start from the west edge
    const startLng = firstRunLat ? lastPosition.lng : NEHRU_PLACE_BOUNDS.west;
    
    for (let lng = startLng; lng < NEHRU_PLACE_BOUNDS.east; lng += lngStep) {
      const location = `${lat},${lng}`;
      console.log(`\nSearching at: ${location}`);
      
      let nextPageToken = null;

      do {
        try {
          const params = {
            location,
            radius: SEARCH_RADIUS,
            type: 'parking',
            key: API_KEY,
            pagetoken: nextPageToken,
          };

          requestCount++;
          const { data } = await axios.get(BASE_URL, { params });

          if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
            console.error(`API Error for location ${location}:`, data.status, data.error_message || '');
            if (data.status === 'OVER_QUERY_LIMIT') {
              console.log('Query limit reached. Waiting for 1 minute...');
              await sleep(60000);
              continue; // Retry the same request
            }
            break;
          }

          if (data.results) {
            let newPlaces = 0;
            data.results.forEach(place => {
              if (!allParkingLots.has(place.place_id)) {
                allParkingLots.set(place.place_id, place);
                newPlaces++;
              }
            });
            console.log(`Found ${data.results.length} results. Added ${newPlaces} new unique places.`);
          }
          
          nextPageToken = data.next_page_token;
          
          if (nextPageToken) {
            console.log("Found next_page_token, waiting 2 seconds...");
            await sleep(2000);
          }

        } catch (error) {
          console.error(`Request failed for location ${location}:`, error.message);
          await sleep(5000);
        }
      } while (nextPageToken);

      // --- Save progress after each grid point ---
      try {
        const parkingArray = Array.from(allParkingLots.values());
        await fs.writeFile(CACHE_FILE_PATH, JSON.stringify(parkingArray, null, 2));
        await fs.writeFile(STATE_FILE_PATH, JSON.stringify({ lat, lng }));
        console.log(`Progress saved. Total unique places: ${allParkingLots.size}`);
      } catch (error) {
        console.error("Failed to save progress:", error);
      }
      // --- End saving ---

      await sleep(REQUEST_DELAY);
    }
    firstRunLat = false; // After the first latitude row, reset longitude
  }

  console.log(`\nFetching complete.`);
  console.log(`Total unique parking lots found: ${allParkingLots.size}`);
  console.log(`Total API requests made: ${requestCount}`);

  // Final save
  try {
    const parkingArray = Array.from(allParkingLots.values());
    await fs.writeFile(CACHE_FILE_PATH, JSON.stringify(parkingArray, null, 2));
    console.log(`Successfully saved final data to: ${CACHE_FILE_PATH}`);
    // Clean up state file on successful completion
    await fs.unlink(STATE_FILE_PATH);
    console.log("State file removed.");
  } catch (error) {
    console.error("Failed to write final cache file:", error);
  }
}

fetchParkingData();
