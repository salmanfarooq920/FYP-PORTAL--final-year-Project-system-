import Settings from '../models/Settings.js';
import { AppError } from '../middleware/errorHandler.js';

const GLOBAL_ID = 'global';

const defaultSettings = {
  id: GLOBAL_ID,
  siteName: 'FYPConnect',
  academicYear: '2026',
  semester: 'Spring',
  proposalDeadline: '2026-02-28',
  midTermDemoStart: '2026-04-15',
  midTermDemoEnd: '2026-04-18',
  finalReportDeadline: '2026-06-15',
  exhibitionStart: '2026-06-20',
  exhibitionEnd: '2026-06-22',
  maxGroupSize: 3,
  allowProposalEdit: true,
  emailNotifications: true,
};

export const get = async (req, res, next) => {
  try {
    let doc = await Settings.findOne({ id: GLOBAL_ID });
    if (!doc) {
      doc = await Settings.create(defaultSettings);
    }
    const data = doc.toObject();
    delete data._id;
    delete data.__v;
    delete data.createdAt;
    delete data.updatedAt;
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const allowed = [
      'siteName', 'academicYear', 'semester', 'proposalDeadline',
      'midTermDemoStart', 'midTermDemoEnd', 'finalReportDeadline',
      'exhibitionStart', 'exhibitionEnd', 'maxGroupSize',
      'allowProposalEdit', 'emailNotifications',
    ];
    const payload = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) payload[key] = req.body[key];
    }
    if (typeof payload.maxGroupSize === 'string') {
      payload.maxGroupSize = parseInt(payload.maxGroupSize, 10);
    }
    const doc = await Settings.findOneAndUpdate(
      { id: GLOBAL_ID },
      { $set: payload },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    const data = doc.toObject();
    delete data._id;
    delete data.__v;
    delete data.createdAt;
    delete data.updatedAt;
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
