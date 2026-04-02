import Project from '../models/Project.js';
import Group from '../models/Group.js';
import { AppError } from '../middleware/errorHandler.js';

export const submitProposal = async (req, res, next) => {
  try {
    const { title, description, groupId, attachmentUrl } = req.body;
    if (!title) return next(new AppError('Title required', 400));
    
    const project = await Project.create({
      title,
      description: description || '',
      status: 'submitted',
      submittedBy: req.user.id,
      group: groupId || null,
      attachmentUrl: attachmentUrl || null,
    });
    
    if (groupId) {
      await Group.findByIdAndUpdate(groupId, { project: project._id });
    }
    
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const getMyProposals = async (req, res, next) => {
  try {
    const projects = await Project.find({ submittedBy: req.user.id })
      .populate('group', 'name')
      .populate('supervisor', 'name email')
      .sort({ updatedAt: -1 });
    res.json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
};

export const getProposalsToReview = async (req, res, next) => {
  try {
    const filter = req.user.role === 'Admin' 
      ? { status: 'submitted' } 
      : { status: 'submitted', supervisor: req.user.id };
    const projects = await Project.find(filter)
      .populate('submittedBy', 'name email')
      .populate('group', 'name')
      .sort({ updatedAt: -1 });
    res.json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
};

export const list = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const projects = await Project.find(filter)
      .populate('submittedBy', 'name email')
      .populate('supervisor', 'name email')
      .populate('group', 'name')
      .sort({ updatedAt: -1 });
    res.json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('submittedBy', 'name email')
      .populate('supervisor', 'name email')
      .populate('group', 'name');
    if (!project) return next(new AppError('Project not found', 404));
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const approveProposal = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id, 
      { status: 'approved' }, 
      { new: true }
    );
    if (!project) return next(new AppError('Project not found', 404));
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const rejectProposal = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id, 
      { status: 'rejected' }, 
      { new: true }
    );
    if (!project) return next(new AppError('Project not found', 404));
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const assignSupervisor = async (req, res, next) => {
  try {
    const { supervisorId } = req.body;
    if (!supervisorId) return next(new AppError('supervisorId required', 400));
    const project = await Project.findByIdAndUpdate(
      req.params.id, 
      { supervisor: supervisorId }, 
      { new: true }
    );
    if (!project) return next(new AppError('Project not found', 404));
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const getMyGroup = async (req, res, next) => {
  try {
    const group = await Group.findOne({ members: req.user.id })
      .populate('members', 'name email')
      .populate('supervisor', 'name email')
      .populate('project');
    if (!group) return res.json({ success: true, data: null });
    res.json({ success: true, data: group });
  } catch (error) {
    next(error);
  }
};

export const getProgress = async (req, res, next) => {
  try {
    const projects = await Project.find({ status: 'approved' })
      .populate('submittedBy', 'name email')
      .populate('group', 'name')
      .populate('supervisor', 'name');
    res.json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
};
