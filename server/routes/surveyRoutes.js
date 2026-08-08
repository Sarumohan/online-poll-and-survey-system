const express = require('express');
const router = express.Router();
const Survey = require('../models/Survey');
const Response = require('../models/Response');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/surveys/my
// @desc    Get logged in user's surveys with response stats
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const surveys = await Survey.find({ creator: req.user._id }).sort({ createdAt: -1 });
    
    // Attach response counts
    const surveyListWithCounts = await Promise.all(
      surveys.map(async (survey) => {
        const responseCount = await Response.countDocuments({ survey: survey._id });
        return {
          ...survey.toObject(),
          responseCount,
        };
      })
    );

    return res.json(surveyListWithCounts);
  } catch (error) {
    console.error('Fetch user surveys error:', error);
    return res.status(500).json({ message: 'Failed to fetch surveys.' });
  }
});

// @route   POST /api/surveys
// @desc    Create a new survey
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, questions, status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Survey title is required.' });
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Survey must contain at least one question.' });
    }

    const newSurvey = await Survey.create({
      title,
      description: description || '',
      creator: req.user._id,
      questions,
      status: status || 'active',
    });

    return res.status(201).json(newSurvey);
  } catch (error) {
    console.error('Create survey error:', error);
    return res.status(500).json({ message: error.message || 'Failed to create survey.' });
  }
});

// @route   GET /api/surveys/:id
// @desc    Get single survey details by ID (Public for taking, creator for editing)
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id).populate('creator', 'name email');
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found.' });
    }
    return res.json(survey);
  } catch (error) {
    console.error('Get survey error:', error);
    return res.status(500).json({ message: 'Invalid survey ID or server error.' });
  }
});

// @route   PUT /api/surveys/:id
// @desc    Update an existing survey
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);

    if (!survey) {
      return res.status(404).json({ message: 'Survey not found.' });
    }

    if (survey.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this survey.' });
    }

    const { title, description, questions, status } = req.body;
    if (title) survey.title = title;
    if (description !== undefined) survey.description = description;
    if (questions) survey.questions = questions;
    if (status) survey.status = status;

    const updatedSurvey = await survey.save();
    return res.json(updatedSurvey);
  } catch (error) {
    console.error('Update survey error:', error);
    return res.status(500).json({ message: 'Failed to update survey.' });
  }
});

// @route   PATCH /api/surveys/:id/status
// @desc    Toggle survey active/closed status
// @access  Private
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);

    if (!survey) {
      return res.status(404).json({ message: 'Survey not found.' });
    }

    if (survey.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this survey.' });
    }

    const { status } = req.body;
    if (['active', 'closed', 'draft'].includes(status)) {
      survey.status = status;
      await survey.save();
      return res.json(survey);
    } else {
      return res.status(400).json({ message: 'Invalid status value.' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update survey status.' });
  }
});

// @route   DELETE /api/surveys/:id
// @desc    Delete a survey and its responses
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);

    if (!survey) {
      return res.status(404).json({ message: 'Survey not found.' });
    }

    if (survey.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this survey.' });
    }

    await Survey.findByIdAndDelete(req.params.id);
    await Response.deleteMany({ survey: req.params.id });

    return res.json({ message: 'Survey and associated responses deleted successfully.' });
  } catch (error) {
    console.error('Delete survey error:', error);
    return res.status(500).json({ message: 'Failed to delete survey.' });
  }
});

module.exports = router;
