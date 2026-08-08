const express = require('express');
const router = express.Router();
const Survey = require('../models/Survey');
const Response = require('../models/Response');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/responses
// @desc    Submit answers for a survey
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { surveyId, answers } = req.body;

    if (!surveyId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Invalid response submission data.' });
    }

    const survey = await Survey.findById(surveyId);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found.' });
    }

    if (survey.status === 'closed') {
      return res.status(400).json({ message: 'This survey is currently closed to new responses.' });
    }

    const newResponse = await Response.create({
      survey: surveyId,
      answers,
      respondentIp: req.ip || req.headers['x-forwarded-for'] || 'anonymous',
    });

    return res.status(201).json({
      message: 'Survey response submitted successfully!',
      responseId: newResponse._id,
    });
  } catch (error) {
    console.error('Submit response error:', error);
    return res.status(500).json({ message: 'Failed to submit survey response.' });
  }
});

// @route   GET /api/responses/survey/:surveyId
// @desc    Get all response entries for a specific survey (for detailed export)
// @access  Private (Creator only)
router.get('/survey/:surveyId', protect, async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.surveyId);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found.' });
    }

    if (survey.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these responses.' });
    }

    const responses = await Response.find({ survey: req.params.surveyId }).sort({ createdAt: -1 });

    return res.json({
      survey,
      responses,
    });
  } catch (error) {
    console.error('Fetch survey responses error:', error);
    return res.status(500).json({ message: 'Failed to fetch responses.' });
  }
});

module.exports = router;
