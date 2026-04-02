import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, default: 'global' },
    siteName: { type: String, default: 'FYPConnect', trim: true },
    academicYear: { type: String, default: '2026', trim: true },
    semester: { type: String, enum: ['Spring', 'Fall'], default: 'Spring' },
    proposalDeadline: { type: String, default: '2026-02-28' },
    midTermDemoStart: { type: String, default: '2026-04-15' },
    midTermDemoEnd: { type: String, default: '2026-04-18' },
    finalReportDeadline: { type: String, default: '2026-06-15' },
    exhibitionStart: { type: String, default: '2026-06-20' },
    exhibitionEnd: { type: String, default: '2026-06-22' },
    maxGroupSize: { type: Number, default: 3, min: 1, max: 10 },
    allowProposalEdit: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Settings', settingsSchema);
