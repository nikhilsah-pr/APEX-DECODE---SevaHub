const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const dataPath = path.join(__dirname, 'data.json');

// Helper function to read data
const readData = () => {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return { services: [], bookings: [], locations: [], categories: [] };
  }
};

// Helper function to write data
const writeData = (data) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing data:', error);
  }
};

// --- ROUTES ---

// 1. Get Categories
app.get('/api/categories', (req, res) => {
  const data = readData();
  res.json(data.categories);
});

// 2. Get Locations
app.get('/api/locations', (req, res) => {
  const data = readData();
  res.json(data.locations);
});

app.post('/api/locations', (req, res) => {
  const { location } = req.body;
  const data = readData();
  if (location && !data.locations.includes(location)) {
    data.locations.push(location);
    writeData(data);
    res.status(201).json({ message: 'Location added successfully', location });
  } else {
    res.status(400).json({ message: 'Location already exists or invalid' });
  }
});

// 3. Get Services
app.get('/api/services', (req, res) => {
  const { category, search, location } = req.query;
  const data = readData();
  
  let result = data.services;
  
  if (category) {
    result = result.filter(s => s.category.toLowerCase() === category.toLowerCase());
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    result = result.filter(s => 
      s.name.toLowerCase().includes(searchLower) || 
      s.category.toLowerCase().includes(searchLower) ||
      s.description.toLowerCase().includes(searchLower)
    );
  }

  if (location) {
    const locLower = location.toLowerCase();
    result = result.filter(s => s.address.toLowerCase().includes(locLower));
  }
  
  res.json(result);
});

// 4. Get Single Service
app.get('/api/services/:id', (req, res) => {
  const data = readData();
  const service = data.services.find(s => s.id === parseInt(req.params.id));
  if (service) {
    res.json(service);
  } else {
    res.status(404).json({ message: 'Service not found' });
  }
});

// 5. Add Service (Merchant feature)
app.post('/api/services', (req, res) => {
  const data = readData();
  const newService = req.body;
  
  const id = data.services.length > 0 ? Math.max(...data.services.map(s => s.id)) + 1 : 1;
  
  const serviceToAdd = {
    ...newService,
    id,
    rating: newService.rating || 0,
    reviewCount: newService.reviewCount || 0,
    reviews: newService.reviews || [],
    verified: false,
    distance: newService.distance || (Math.random() * 5 + 0.5).toFixed(1)
  };
  
  data.services.push(serviceToAdd);
  
  // also extract location/address logic optionally to locations array
  let locationPart = serviceToAdd.address.split(',')[0].trim();
  if (!data.locations.includes(locationPart)) {
    data.locations.push(locationPart);
  }

  writeData(data);
  res.status(201).json(serviceToAdd);
});

// 6. Get Bookings
app.get('/api/bookings', (req, res) => {
  const data = readData();
  // Filter by user ID if authenticated. For now, returning all or filtering by query
  const { userId } = req.query;
  let result = data.bookings;
  if(userId) {
     result = result.filter(b => b.userId === userId);
  }
  res.json(result);
});

// 7. Create Booking
app.post('/api/bookings', (req, res) => {
  const data = readData();
  const newBooking = req.body;
  
  const id = 'BKG' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000);
  
  const bookingToAdd = {
    ...newBooking,
    id,
    status: 'pending',
    dateAdded: new Date().toISOString()
  };
  
  data.bookings.push(bookingToAdd);
  writeData(data);
  
  res.status(201).json(bookingToAdd);
});

// 8. Update Booking Status
app.patch('/api/bookings/:id', (req, res) => {
  const data = readData();
  const { status } = req.body;
  const bookingIndex = data.bookings.findIndex(b => b.id === req.params.id);
  
  if (bookingIndex !== -1) {
    data.bookings[bookingIndex].status = status;
    writeData(data);
    res.json(data.bookings[bookingIndex]);
  } else {
    res.status(404).json({ message: 'Booking not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend Server running on port ${PORT}`);
});
