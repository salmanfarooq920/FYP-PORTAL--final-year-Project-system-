import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'approved', 'rejected'],
      default: 'draft',
    },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', default: null },
    supervisor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    attachmentUrl: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
