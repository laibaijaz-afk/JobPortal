const express = require('express');
const router = express.Router();
const {
  applyToJob,
  getCandidateApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/', protect, authorize('candidate'), applyToJob);
router.get('/user', protect, authorize('candidate'), getCandidateApplications);
router.get('/job/:jobId', protect, authorize('employer'), getJobApplications);
router.put('/:id/status', protect, authorize('employer'), updateApplicationStatus);
router.delete('/:id', protect, authorize('candidate'), withdrawApplication);

module.exports = router;
