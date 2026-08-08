const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
    trim: true,
  },
  questionType: {
    type: String,
    enum: ['mcq', 'rating', 'text'],
    required: true,
    default: 'mcq',
  },
  options: [
    {
      optionText: { type: String, trim: true },
      nextQuestionIndex: { type: Number, default: null }, // Simple logic branching per option
    },
  ],
  maxRating: {
    type: Number,
    default: 5, // 5 or 10
  },
  isRequired: {
    type: Boolean,
    default: true,
  },
});

const surveySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Survey title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'draft'],
      default: 'active',
    },
    questions: [questionSchema],
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Survey', surveySchema);
