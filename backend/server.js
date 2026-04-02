import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

// Routes will be added as we build
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import projectRoutes from './routes/projects.js';
import milestoneRoutes from './routes/milestones.js';
import chatRoutes from './routes/chat.js';
import fileRoutes from './routes/files.js';
import aiRoutes from './routes/ai.js';
import announcementRoutes from './routes/announcements.js';
import settingsRoutes from './routes/settings.js';

import { setupSocket } from './services/socketService.js';

await connectDB();

const app = express();
const httpServer = createServer(app);

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/api/health', (req, res) => res.json({ success: true, message: 'FYP PORTAL API' }));

setupSocket(httpServer);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
