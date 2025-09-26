import { CohereClientV2 } from "cohere-ai";
import dotenv from "dotenv";
import Job from "../models/Job.js";
import { cosineSim } from "../utils/similarity.js";

dotenv.config();

const cohere = new CohereClientV2({
  token: process.env.COHERE_API_KEY,
});

// 📥 Get all jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

// 📝 Create job
export const createJob = async (req, res) => {
  try {
    const { title, company, location, skillsRequired, jobType } = req.body;
    const job = await Job.create({ title, company, location, skillsRequired, jobType });
    res.status(201).json(job);
  } catch (err) {
    console.error("Error creating job:", err);
    res.status(500).json({ message: "Failed to create job" });
  }
};

// ❌ Delete job
export const deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Job deleted" });
  } catch (err) {
    console.error("Error deleting job:", err);
    res.status(500).json({ message: "Failed to delete job" });
  }
};

// 🔍 Recommend jobs
export const recommendJobs = async (req, res) => {
  try {
    const user = req.user;

    if (!user) return res.status(401).json({ message: "Not authorized" });
    if (!user.skills || user.skills.length === 0)
      return res.status(400).json({ message: "Missing user skills for recommendation" });
    if (user.experience === undefined || user.experience === null)
      return res.status(400).json({ message: "Missing user experience for recommendation" });

    // Expand skills
    const skillSynonyms = {
      "data engineering": ["etl", "pipelines", "big data"],
      aws: ["cloud", "s3"],
      airflow: ["workflow orchestration"],
    };

    const expandedSkills = user.skills.flatMap(
      (skill) => [skill, ...(skillSynonyms[skill.toLowerCase()] || [])]
    );

    const queryText = `Skills: ${expandedSkills.join(", ")}. Experience: ${user.experience} years. Preferences: ${user.jobType || "any"}.`;

    // Fetch jobs
    const jobs = await Job.find();
    if (jobs.length === 0) return res.status(404).json({ message: "No jobs available" });

    const jobDescriptions = jobs.map(
      (job) => `${job.title} at ${job.company} in ${job.location}. Skills: ${job.skillsRequired.join(", ")}. Type: ${job.jobType}.`
    );

    // Embed query + jobs
    const [queryRes, jobRes] = await Promise.all([
      cohere.embed({
        model: "embed-english-v3.0",
        inputType: "search_query",
        embeddingTypes: ["float"],
        inputs: [{ content: [{ type: "text", text: queryText }] }],
      }),
      cohere.embed({
        model: "embed-english-v3.0",
        inputType: "search_document",
        embeddingTypes: ["float"],
        inputs: jobDescriptions.map((desc) => ({
          content: [{ type: "text", text: desc }],
        })),
      }),
    ]);

    const queryEmbedding = queryRes.embeddings.float[0];
    const jobEmbeddings = jobRes.embeddings.float;

    // Rank jobs
    const scoredJobs = jobs.map((job, i) => ({
      ...job.toObject(),
      score: cosineSim(queryEmbedding, jobEmbeddings[i]),
    }));

    const topMatches = scoredJobs.sort((a, b) => b.score - a.score).slice(0, 3);

    res.status(200).json({ candidate: user.username, matches: topMatches });
  } catch (err) {
    console.error("🔥 Job recommendation failed:", err.message);
    if (err.response?.body) console.error("Cohere API response:", err.response.body);
    res.status(500).json({ message: "Failed to recommend jobs" });
  }
};
