import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    milestone: { type: mongoose.Schema.Types.ObjectId, ref: 'Milestone', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileUrl: { type: String, default: null },
    status: { type: String, enum: ['pending', 'submitted', 'evaluated'], default: 'pending' },
    grade: { type: Number, default: null },
    feedback: { type: String, default: null },
    evaluatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    evaluatedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

submissionSchema.index({ project: 1, milestone: 1 }, { unique: true });
export default mongoose.model('Submission', submissionSchema);
