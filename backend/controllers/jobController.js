const Job = require('../models/Job');
const Application = require('../models/Application');

const getAllJobs = async (req, res, next) => {
  try {
    const { keyword, location, experience, skills, jobType, page = 1, limit = 10 } = req.query;

    const query = { isActive: true };

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { company: { $regex: keyword, $options: 'i' } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (experience) {
      query.experience = experience;
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (skills) {
      const skillsArr = skills.split(',').map((s) => s.trim());
      query.skills = { $in: skillsArr.map((s) => new RegExp(s, 'i')) };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Job.countDocuments(query);

    const jobs = await Job.find(query)
      .populate('employer', 'name email company')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      jobs,
    });
  } catch (err) {
    next(err);
  }
};

const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer', 'name email company bio');
    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }
    res.json({ success: true, job });
  } catch (err) {
    next(err);
  }
};

const createJob = async (req, res, next) => {
  try {
    const { title, description, skills, location, experience, salary, jobType, company } = req.body;

    const job = await Job.create({
      title,
      description,
      skills,
      location,
      experience,
      salary,
      jobType,
      company: company || req.user.company,
      employer: req.user.id,
    });

    res.status(201).json({ success: true, job });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    next(err);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found.' });

    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to update this job.' });
    }

    const allowedFields = ['title', 'description', 'skills', 'location', 'experience', 'salary', 'jobType', 'company', 'isActive'];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const updated = await Job.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, job: updated });
  } catch (err) {
    next(err);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found.' });

    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this job.' });
    }

    await Application.deleteMany({ job: job._id });
    await job.deleteOne();

    res.json({ success: true, message: 'Job deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

const getEmployerJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ employer: req.user.id }).sort({ createdAt: -1 });

    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const count = await Application.countDocuments({ job: job._id });
        return { ...job.toObject(), applicationCount: count };
      })
    );

    res.json({ success: true, jobs: jobsWithCounts });
  } catch (err) {
    next(err);
  }
};

const getEmployerStats = async (req, res, next) => {
  try {
    const totalJobs = await Job.countDocuments({ employer: req.user.id });
    const activeJobs = await Job.countDocuments({ employer: req.user.id, isActive: true });
    const jobIds = await Job.find({ employer: req.user.id }).distinct('_id');
    const totalApplications = await Application.countDocuments({ job: { $in: jobIds } });
    const shortlisted = await Application.countDocuments({ job: { $in: jobIds }, status: 'shortlisted' });

    res.json({
      success: true,
      stats: { totalJobs, activeJobs, totalApplications, shortlisted },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllJobs, getJobById, createJob, updateJob, deleteJob, getEmployerJobs, getEmployerStats };
