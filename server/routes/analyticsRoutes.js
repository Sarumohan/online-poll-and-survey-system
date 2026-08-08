const express = require('express');
const router = express.Router();
const Survey = require('../models/Survey');
const Response = require('../models/Response');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/analytics/:surveyId
// @desc    Get aggregated real-time analytics for a survey
// @access  Private (Creator only)
router.get('/:surveyId', protect, async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.surveyId);

    if (!survey) {
      return res.status(404).json({ message: 'Survey not found.' });
    }

    if (survey.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access analytics for this survey.' });
    }

    const responses = await Response.find({ survey: req.params.surveyId });
    const totalResponses = responses.length;

    // Process question-by-question analytics
    const questionAnalytics = survey.questions.map((question) => {
      const qIdStr = question._id.toString();

      if (question.questionType === 'mcq') {
        // Option counts initialization
        const optionCounts = {};
        question.options.forEach((opt) => {
          optionCounts[opt.optionText] = 0;
        });

        responses.forEach((resp) => {
          const ans = resp.answers.find((a) => a.questionId.toString() === qIdStr);
          if (ans && ans.answerValue) {
            if (optionCounts[ans.answerValue] !== undefined) {
              optionCounts[ans.answerValue] += 1;
            } else {
              optionCounts[ans.answerValue] = 1;
            }
          }
        });

        const breakdown = Object.keys(optionCounts).map((optionText) => ({
          optionText,
          count: optionCounts[optionText],
          percentage:
            totalResponses > 0
              ? Math.round((optionCounts[optionText] / totalResponses) * 100)
              : 0,
        }));

        return {
          questionId: question._id,
          questionText: question.questionText,
          questionType: 'mcq',
          breakdown,
        };
      } else if (question.questionType === 'rating') {
        const maxRating = question.maxRating || 5;
        const ratingCounts = {};
        for (let i = 1; i <= maxRating; i++) {
          ratingCounts[i] = 0;
        }

        let totalScore = 0;
        let ratingResponseCount = 0;

        responses.forEach((resp) => {
          const ans = resp.answers.find((a) => a.questionId.toString() === qIdStr);
          if (ans && ans.answerValue !== undefined) {
            const num = Number(ans.answerValue);
            if (!isNaN(num) && num >= 1 && num <= maxRating) {
              ratingCounts[num] = (ratingCounts[num] || 0) + 1;
              totalScore += num;
              ratingResponseCount++;
            }
          }
        });

        const averageRating =
          ratingResponseCount > 0 ? (totalScore / ratingResponseCount).toFixed(2) : 0;

        const breakdown = Object.keys(ratingCounts).map((ratingScore) => ({
          ratingScore: Number(ratingScore),
          count: ratingCounts[ratingScore],
          percentage:
            totalResponses > 0
              ? Math.round((ratingCounts[ratingScore] / totalResponses) * 100)
              : 0,
        }));

        return {
          questionId: question._id,
          questionText: question.questionText,
          questionType: 'rating',
          maxRating,
          averageRating: Number(averageRating),
          breakdown,
        };
      } else if (question.questionType === 'text') {
        const textResponses = [];
        responses.forEach((resp) => {
          const ans = resp.answers.find((a) => a.questionId.toString() === qIdStr);
          if (ans && ans.answerValue && String(ans.answerValue).trim() !== '') {
            textResponses.push({
              text: String(ans.answerValue).trim(),
              submittedAt: resp.submittedAt,
            });
          }
        });

        return {
          questionId: question._id,
          questionText: question.questionText,
          questionType: 'text',
          responses: textResponses,
        };
      }
    });

    return res.json({
      survey: {
        _id: survey._id,
        title: survey.title,
        description: survey.description,
        status: survey.status,
        createdAt: survey.createdAt,
      },
      totalResponses,
      questionAnalytics,
    });
  } catch (error) {
    console.error('Analytics aggregation error:', error);
    return res.status(500).json({ message: 'Failed to generate analytics report.' });
  }
});

module.exports = router;
