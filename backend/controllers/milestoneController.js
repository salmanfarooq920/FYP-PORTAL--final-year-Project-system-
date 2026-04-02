import Milestone from '../models/Milestone.js';
import Submission from '../models/Submission.js';
import Project from '../models/Project.js';
import { AppError } from '../middleware/errorHandler.js';

export const list = async (req, res, next) => {
  try {
    const milestones = await Milestone.find().sort({ deadline: 1 });
    res.json({ success: true, data: milestones });
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { title, description, deadline, weightage } = req.body;
    if (!title || !deadline || weightage == null) {
      return next(new AppError('Title, deadline and weightage required', 400));
    }
    const milestone = await Milestone.create({ 
      title, 
      description: description || '', 
      deadline, 
      weightage 
    });
    res.status(201).json({ success: true, data: milestone });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const milestone = await Milestone.findById(req.params.id);
    if (!milestone) return next(new AppError('Milestone not found', 404));
    res.json({ success: true, data: milestone });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { title, description, deadline, weightage } = req.body;
    const milestone = await Milestone.findByIdAndUpdate(
      req.params.id,
      { 
        ...(title != null && { title }), 
        ...(description != null && { description }), 
        ...(deadline != null && { deadline }), 
        ...(weightage != null && { weightage }) 
      },
      { new: true }
    );
    if (!milestone) return next(new AppError('Milestone not found', 404));
    res.json({ success: true, data: milestone });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const milestone = await Milestone.findByIdAndDelete(req.params.id);
    if (!milestone) return next(new AppError('Milestone not found', 404));
    res.json({ success: true, message: 'Milestone deleted' });
  } catch (error) {
    next(error);
  }
};

export const getForStudent = async (req, res, next) => {
  try {
    const milestones = await Milestone.find().sort({ deadline: 1 });
    const project = await Project.findOne({ submittedBy: req.user.id, status: 'approved' });
    const submissions = project
      ? await Submission.find({ project: project._id }).populate('milestone', 'title deadline weightage')
      : [];
    const submissionByMilestone = Object.fromEntries(submissions.map((s) => [s.milestone._id.toString(), s]));
    const data = milestones.map((m) => ({
      ...m.toObject(),
      submission: submissionByMilestone[m._id.toString()] || null,
    }));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getSubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ milestone: req.params.id })
      .populate('project', 'title')
      .populate('submittedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: submissions });
  } catch (error) {
    next(error);
  }
};

export const submitMilestone = async (req, res, next) => {
  try {
    const { projectId, fileUrl } = req.body;
    if (!projectId) return next(new AppError('projectId required', 400));
    
    const project = await Project.findOne({ _id: projectId, status: 'approved' });
    if (!project) return next(new AppError('Project not found or not approved', 404));
    
    let submission = await Submission.findOne({ milestone: req.params.id, project: projectId });
    if (submission) {
      submission.fileUrl = fileUrl || submission.fileUrl;
      submission.status = 'submitted';
      await submission.save();
    } else {
      submission = await Submission.create({
        milestone: req.params.id,
        project: projectId,
        submittedBy: req.user.id,
        fileUrl: fileUrl || null,
        status: 'submitted',
      });
    }
    res.status(201).json({ success: true, data: submission });
  } catch (error) {
    next(error);
  }
};

export const getSubmissionsToEvaluate = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ status: 'submitted' })
      .populate('milestone', 'title deadline weightage')
      .populate('project', 'title')
      .populate('submittedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: submissions });
  } catch (error) {
    next(error);
  }
};

export const evaluate = async (req, res, next) => {
  try {
    const { grade, feedback } = req.body;
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { 
        grade, 
        feedback, 
        status: 'evaluated', 
        evaluatedBy: req.user.id, 
        evaluatedAt: new Date() 
      },
      { new: true }
    );
    if (!submission) return next(new AppError('Submission not found', 404));
    res.json({ success: true, data: submission });
  } catch (error) {
    next(error);
  }
};
