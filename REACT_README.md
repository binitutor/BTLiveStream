# BT Live Stream - React Version

This is a React conversion of the BT Live Stream peer-to-peer video call platform.

## Project Structure

```
src/
├── index.js              # React entry point
├── index.css             # Global styles
├── App.js                # Main app component with state management
└── components/
    ├── Navigation.js     # Navigation bar with user status
    ├── Hero.js           # Hero section with video preview & controls
    ├── Features.js       # Features overview section
    ├── Dashboard.js      # Live call analytics with Chart.js
    ├── Auth.js           # Authentication forms (signup/login)
    ├── Sessions.js       # Session management & data table
    ├── Support.js        # Support center section
    └── Footer.js         # Footer component
```

## Features

- **React Hooks**: Uses `useState` and `useEffect` for state management
- **Video Streaming**: WebRTC-based camera and microphone access
- **Authentication**: Form-based signup/login with localStorage persistence
- **Fullscreen Preview**: Toggle fullscreen mode for video preview
- **Live Analytics**: Chart.js integration for real-time metrics
- **Session Management**: Create, join, and manage video sessions
- **SweetAlert2**: Modern alert notifications for user feedback
- **Bootstrap 5**: Responsive UI framework

## Installation

```bash
npm install
```

## Running the Project

```bash
npm start
```

The app will open at `http://localhost:3000`

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Runs tests

## Component Highlights

### Hero.js
- **Video Stream Management**: Handles camera/microphone access
- **Fullscreen Toggle**: Switch to fullscreen video preview
- **Session Controls**: Start, end, and toggle media
- **Real-time UI Updates**: Button states reflect stream status

### Auth.js
- **Form Validation**: Email and password validation
- **LocalStorage**: Persists user authentication
- **Signup/Login**: API integration ready
- **Session Management**: Auto-logout available

### Dashboard.js
- **Chart.js Integration**: Displays engagement and bandwidth metrics
- **Responsive Design**: Charts adapt to screen size
- **Custom Styling**: Matches brand colors and design

### Sessions.js
- **Session CRUD**: Create, read, and join sessions
- **Room Management**: Join sessions with room ID
- **Data Display**: Table of scheduled sessions with status

## API Integration

The app expects the following API endpoints (when backend is running):

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/sessions` - Create new session
- `GET /api/sessions` - Fetch user sessions

Configure the API base URL in each component's `API_BASE_URL` constant.

## Browser Requirements

- Modern browser with WebRTC support (Chrome, Firefox, Safari, Edge)
- Camera and microphone permissions required for video features

## Customization

- **Colors**: Edit CSS variables in `src/index.css` (--primary, --secondary, etc.)
- **API Endpoint**: Update `API_BASE_URL` in components for your backend
- **Charts**: Modify chart data and options in `Dashboard.js`
- **Bootstrap Theme**: Customize Bootstrap classes in components

## Dependencies

- `react` - UI framework
- `react-dom` - React DOM rendering
- `bootstrap` - CSS framework
- `chart.js` - Chart library
- `react-chartjs-2` - React wrapper for Chart.js
- `sweetalert2` - Alert notifications

## Notes

- WebRTC features require HTTPS in production (except localhost)
- Camera/microphone permissions are browser-dependent
- LocalStorage is used for simple auth persistence (use proper auth tokens in production)
- Chart data is static; connect to real API for live data
