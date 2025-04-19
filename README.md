# Resume Tailor Backend

A simple and efficient backend service for resume tailoring applications.

## Features

- PDF upload and parsing
- Resume text extraction
- PDF generation
- Simple file-based storage
- RESTful API endpoints

## Prerequisites

- Node.js >= 16.0.0
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd resume-tailor-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
PORT=8080
```

## Development

Start the development server:
```bash
npm run dev
```

## Production

Start the production server:
```bash
npm start
```

## API Endpoints

- `POST /upload-resume` - Upload a PDF resume
- `POST /analyze-resume` - Save structured resume data
- `GET /resume/:name` - Fetch a resume
- `POST /generate-pdf` - Generate a tailored PDF
- `GET /healthz` - Health check endpoint

## Deployment

The application can be easily deployed to any Node.js hosting platform:

1. Render:
   - Create a new Web Service
   - Connect your GitHub repository
   - Set the build command: `npm install`
   - Set the start command: `npm start`
   - Set the environment variable: `PORT=8080`

2. Heroku:
   - Create a new app
   - Connect your GitHub repository
   - Enable automatic deploys
   - The app will be automatically configured

## Error Handling

The application includes comprehensive error handling and logging. All errors are logged and appropriate HTTP status codes are returned.

## License

MIT

```bash
git clone <repo>
cd resume-tailor-backend
npm install
npm start     # ➜ http://localhost:8080
