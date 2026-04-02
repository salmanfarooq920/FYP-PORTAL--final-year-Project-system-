import { AppError } from '../middleware/errorHandler.js';

// Stub AI reports and proxy to FastAPI when AI_SERVICE_URL is set
const reportsStore = new Map();

export const evaluateIdea = async (req, res, next) => {
  try {
    const { title, description } = req.body || {};
    const url = process.env.AI_SERVICE_URL;
    if (url) {
      try {
        const response = await fetch(`${url}/evaluate-idea`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description }),
        });
        const data = await response.json().catch(() => ({}));
        return res.json({ success: true, data: data });
      } catch (err) {
        return res.status(502).json({ success: false, message: 'AI service unavailable' });
      }
    }
    // Stub response
    res.json({
      success: true,
      data: {
        uniquenessScore: 0.75,
        feedback: 'Stub feedback. Configure AI_SERVICE_URL for real evaluation.',
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getReports = async (req, res, next) => {
  try {
    const projectId = req.query.projectId;
    const key = projectId || req.user.id;
    const list = reportsStore.get(key) || [];
    res.json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
};

export const saveReport = async (req, res, next) => {
  try {
    const { projectId, ...report } = req.body;
    const key = projectId || req.user.id;
    const list = reportsStore.get(key) || [];
    list.push({ ...report, id: `r-${Date.now()}`, createdAt: new Date() });
    reportsStore.set(key, list);
    res.status(201).json({ success: true, data: list[list.length - 1] });
  } catch (error) {
    next(error);
  }
};
