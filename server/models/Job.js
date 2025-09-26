// import mongoose from 'mongoose';

// const jobSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   company: { type: String, required: true },
//   location: { type: String, required: true },
//   skillsRequired: [{ type: String, required: true }],
//   jobType: { type: String, enum: ['remote', 'onsite', 'any'], default: 'any' },
// }, {
//   timestamps: true
// });

// const Job = mongoose.model('Job', jobSchema);
// export default Job;
import mongoose from 'mongoose';

// Job Schema
const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    skillsRequired: [{ type: String, required: true }],
    jobType: { type: String, enum: ['remote', 'onsite', 'any'], default: 'any' },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

// Create Job model
const Job = mongoose.model('Job', jobSchema);

export default Job;
