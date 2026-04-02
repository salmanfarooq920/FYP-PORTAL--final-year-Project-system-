import { uploadFile } from '../services/fileStorage.js';
import { AppError } from '../middleware/errorHandler.js';

// In-memory store for file metadata (MongoDB stores the actual data)
const fileMetaStore = new Map();
let fileIdCounter = 1;

export const upload = async (req, res, next) => {
  try {
    if (!req.file) return next(new AppError('No file uploaded', 400));
    const { projectId, milestoneId } = req.body || {};
    const result = await uploadFile(req.file.buffer, req.file.originalname, projectId ? `projects/${projectId}` : 'uploads');
    const id = `file-${fileIdCounter++}`;
    fileMetaStore.set(id, {
      id,
      url: result.url,
      filename: req.file.originalname,
      projectId: projectId || null,
      milestoneId: milestoneId || null,
      uploadedBy: req.user.id,
      createdAt: new Date(),
    });
    res.status(201).json({ success: true, data: fileMetaStore.get(id) });
  } catch (error) {
    next(error);
  }
};

export const list = async (req, res, next) => {
  try {
    const { projectId } = req.query;
    const list = Array.from(fileMetaStore.values()).filter(
      (f) => f.uploadedBy === req.user.id && (projectId == null || f.projectId === projectId)
    );
    res.json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
};

export const getUrl = async (req, res, next) => {
  try {
    const meta = fileMetaStore.get(req.params.id);
    if (!meta) return next(new AppError('File not found', 404));
    res.json({ success: true, data: { url: meta.url } });
  } catch (error) {
    next(error);
  }
};
