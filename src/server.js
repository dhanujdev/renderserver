import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { v4 as uuid } from 'uuid';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import winston from 'winston';

import { parsePDF } from './pdfParser.js';
import { generatePDF } from './pdfGenerator.js';
import { saveResume, getResume, updateResume } from './storage.js';

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' })
  ]
});

const __dirname = dirname(fileURLToPath(import.meta.url));
const filesDir = join(__dirname, '..', 'files');
const upload = multer({ dest: filesDir });

const app = express();
app.use(cors());
app.use(express.json());
app.use('/files', express.static(filesDir));

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  logger.error('Error:', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Internal server error' });
};

/* Health  */
app.get('/healthz', (_, res) => res.send('ok'));

/* 1️⃣ Upload PDF */
app.post('/upload-resume', upload.single('file'), async (req, res, next) => {
  try {
    const { originalname, path } = req.file;
    const { title = 'untitled' } = req.body;

    const raw_text = await parsePDF(path);
    const id = uuid();

    await saveResume(id, { id, name: title, raw_text });
    logger.info('Resume uploaded', { id, title });
    res.json({ id, resume_text: raw_text });
  } catch (error) {
    next(error);
  }
});

/* 2️⃣ Save structured resume */
app.post('/analyze-resume', async (req, res, next) => {
  try {
    const { id, structured_json } = req.body;
    await updateResume(id, { structured: structured_json });
    logger.info('Resume analyzed', { id });
    res.json({ saved: true });
  } catch (error) {
    next(error);
  }
});

/* 3️⃣ Fetch resume */
app.get('/resume/:id', async (req, res, next) => {
  try {
    const resume = await getResume(req.params.id);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.json(resume);
  } catch (error) {
    next(error);
  }
});

/* 4️⃣ Generate tailored PDF */
app.post('/generate-pdf', async (req, res, next) => {
  try {
    const { id, tailored_text } = req.body;
    const filename = await generatePDF(tailored_text, filesDir);
    logger.info('PDF generated', { id, filename });
    res.json({ download_link: `${req.protocol}://${req.get('host')}/files/${filename}` });
  } catch (error) {
    next(error);
  }
});

// Apply error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
  console.log(`✔ Resume Tailor backend on ${PORT}`);
});
