import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    supervisor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
  },
  { timestamps: true }
);

export default mongoose.model('Group', groupSchema);
