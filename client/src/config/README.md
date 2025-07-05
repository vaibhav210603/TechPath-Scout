# API Configuration

This directory contains the centralized API configuration for the TechPath Scout application.

## Usage

### Switching Environments

To switch between local and deployed environments, edit `api.js`:

```javascript
// Change this line in api.js
const ENVIRONMENT = 'local'; // Options: 'local' or 'deployed'
```

### Available Environments

- **local**: `http://localhost:8000` (for development)
- **deployed**: `https://techpath-scout-server.vercel.app` (for production)

### API Endpoints

The configuration automatically generates the following endpoints:

- `GENERATE`: Content generation endpoint
- `CHAT`: AI chat functionality endpoint  
- `CREATE_ORDER`: Payment order creation endpoint
- `QUESTIONS_1`: First question set (static asset)
- `QUESTIONS_2`: Second question set (static asset)

### Usage in Components

```javascript
import { API_ENDPOINTS } from '../config/api';

// Use the centralized endpoints
const response = await fetch(API_ENDPOINTS.GENERATE, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
```

### Benefits

- ✅ Single point of configuration
- ✅ Easy environment switching
- ✅ Consistent API URLs across the app
- ✅ No need to update multiple files
- ✅ Debugging information in console

### Debugging

The configuration logs the current setup to the console when the app loads. Check the browser console to see:

```javascript
API Configuration: {
  environment: 'local',
  baseUrl: 'http://localhost:8000',
  endpoints: { ... }
}
``` 