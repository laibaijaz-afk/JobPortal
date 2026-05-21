const Application = require('../models/Application');
const Job = require('../models/Job');

const applyToJob = async (req, res, next) => {
  try {
    const { jobId, resume, coverLetter } = req.body;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found.' });
    if (!job.isActive) return res.status(400).json({ message: 'This job is no longer accepting applications.' });

    const existing = await Application.findOne({ job: jobId, candidate: req.user.id });
    if (existing) return res.status(400).json({ message: 'You have already applied to this job.' });

    const application = await Application.create({
      job: jobId,
      candidate: req.user.id,
      resume,
      coverLetter,
    });

    await Job.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } });

    await application.populate([
      { path: 'job', select: 'title company location' },
      { path: 'candidate', select: 'name email' },
    ]);

    res.status(201).json({ success: true, application });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You have already applied to this job.' });
    }
    next(err);
  }
};

const getCandidateApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ candidate: req.user.id })
      .populate('job', 'title company location experience jobType salary isActive')
      .sort({ createdAt: -1 });

    res.json({ success: true, applications });
  } catch (err) {
    next(err);
  }
};

const getJobApplications = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found.' });

    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view these applications.' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('candidate', 'name email skills resumeUrl bio')
      .sort({ createdAt: -1 });

    res.json({ success: true, applications });
  } catch (err) {
    next(err);
  }
};

const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['applied', 'shortlisted', 'rejected', 'hired'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const application = await Application.findById(req.params.id).populate('job');
    if (!application) return res.status(404).json({ message: 'Application not found.' });

    if (application.job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this application.' });
    }

    application.status = status;
    await application.save();

    res.json({ success: true, application });
  } catch (err) {
    next(err);
  }
};

const withdrawApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found.' });

    if (application.candidate.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    await Job.findByIdAndUpdate(application.job, { $inc: { applicationCount: -1 } });
    await application.deleteOne();

    res.json({ success: true, message: 'Application withdrawn.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  applyToJob,
  getCandidateApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication,
};
