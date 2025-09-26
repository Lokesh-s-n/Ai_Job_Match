// db.jobs.insertMany([
//   {
//     title: "Full Stack Developer",
//     company: "TechCorp",
//     location: "Remote",
//     skillsRequired: ["JavaScript", "React", "Node.js", "MongoDB"],
//     jobType: "Full-time"
//   },
//   {
//     title: "Data Engineer",
//     company: "DataWorks",
//     location: "Bangalore",
//     skillsRequired: ["Python", "SQL", "Airflow", "AWS"],
//     jobType: "Contract"
//   },
//   {
//     title: "Frontend Developer",
//     company: "Designly",
//     location: "Mumbai",
//     skillsRequired: ["HTML", "CSS", "JavaScript", "React"],
//     jobType: "Internship"
//   }
// ])
// seedJobs.js
// seedJobs.js
import { MongoClient } from "mongodb";

const uri = "mongodb+srv://lokeshsnatikar_db_user:hvEJb7ukgDtZlVMu@cluster0.g9zr3tc.mongodb.net/ai-job-match";
const client = new MongoClient(uri);

const jobs = [
  {
    title: "Full Stack Developer",
    company: "TechCorp",
    location: "Remote",
    skillsRequired: ["JavaScript", "React", "Node.js", "MongoDB"],
    jobType: "Full-time",
  },
  {
    title: "Data Engineer",
    company: "DataWorks",
    location: "Bangalore",
    skillsRequired: ["Python", "SQL", "Airflow", "AWS"],
    jobType: "Contract",
  },
  {
    title: "Frontend Developer",
    company: "Designly",
    location: "Mumbai",
    skillsRequired: ["HTML", "CSS", "JavaScript", "React"],
    jobType: "Internship",
  },
  {
    title: "Backend Developer",
    company: "CodeBase",
    location: "Hyderabad",
    skillsRequired: ["Node.js", "Express", "MongoDB", "Docker"],
    jobType: "Full-time",
  },
  {
    title: "Machine Learning Engineer",
    company: "AI Innovations",
    location: "Remote",
    skillsRequired: ["Python", "TensorFlow", "PyTorch", "NLP"],
    jobType: "Full-time",
  },
  {
    title: "Cloud Architect",
    company: "CloudNet",
    location: "Pune",
    skillsRequired: ["AWS", "Azure", "GCP", "Kubernetes"],
    jobType: "Contract",
  },
  {
    title: "DevOps Engineer",
    company: "Opsify",
    location: "Chennai",
    skillsRequired: ["CI/CD", "Docker", "Kubernetes", "Linux"],
    jobType: "Full-time",
  },
  {
    title: "Cybersecurity Analyst",
    company: "SecureIT",
    location: "Delhi",
    skillsRequired: ["Network Security", "Penetration Testing", "SIEM", "Linux"],
    jobType: "Full-time",
  },
  {
    title: "Mobile App Developer",
    company: "Appify",
    location: "Remote",
    skillsRequired: ["Flutter", "Dart", "Firebase"],
    jobType: "Internship",
  },
  {
    title: "UI/UX Designer",
    company: "DesignPro",
    location: "Bangalore",
    skillsRequired: ["Figma", "Adobe XD", "Wireframing", "Prototyping"],
    jobType: "Full-time",
  },
];

async function run() {
  try {
    await client.connect();
    const db = client.db("ai-job-match");
    const collection = db.collection("jobs");

    await collection.deleteMany({}); // clear old jobs
    await collection.insertMany(jobs);

    console.log("✅ Jobs seeded successfully!");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
