import axios from "axios";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { prompt } = req.body; // prompt 변수를 req.body로부터 올바르게 추출

    try {
      // Create a thread
      const emptyThread = await openai.beta.threads.create();
      console.log(emptyThread);

      // Add a message
      const threadMessages = await openai.beta.threads.messages.create(emptyThread.id, {
        role: "user",
        content: prompt || "서울에 경매 몇개야?",
      });
      console.log(threadMessages);

      // Run the thread
      let run = await openai.beta.threads.runs.create(emptyThread.id, {
        assistant_id: "asst_N9dWiBBasMOGax6OkL22r7w1",
      });
      console.log(run);

      // Runqueued
      // Get run's status
      run = await openai.beta.threads.runs.retrieve(emptyThread.id, run.id);
      console.log(run);

      // Run in_progress
      let runStep = await openai.beta.threads.runs.steps.list(emptyThread.id, run.id);
      console.log("runStep 1", runStep.data);

      // 1초 대기
      await new Promise((resolve) => setTimeout(resolve, 10000));
      if (runStep) {
        runStep = await openai.beta.threads.runs.steps.list(emptyThread.id, run.id);
        console.log("runStep 2", runStep.data);
      }

      run = await openai.beta.threads.runs.retrieve(emptyThread.id, run.id);
      console.log(run);
      await new Promise((resolve) => setTimeout(resolve, 10000));
      if (run.status !== "complete") {
        run = await openai.beta.threads.runs.retrieve(emptyThread.id, run.id);
        console.log(run);
      }

      const getThreadMessages = await openai.beta.threads.messages.list(emptyThread.id);
      console.log(getThreadMessages.data);

      res.status(200).json(getThreadMessages.data);
    } catch (error) {
      console.error("Error:", error.response.data); // 오류 로깅 개선
      res
        .status(500)
        .json({ message: "Error communicating with OpenAI API", error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
