const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  questionType: {
    type: String,
    enum: ['mcq', 'rating', 'text'],
    required: true,
  },
  answerValue: {
    type: mongoose.Schema.Types.Mixed, // string, number, or array
    required: true,
  },
});

const responseSchema = new mongoose.Schema(
  {
    survey: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Survey',
      required: true,
    },
    answers: [answerSchema],
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    respondentIp: {
      type: String,
      default: 'anonymous',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Response', responseSchema);
