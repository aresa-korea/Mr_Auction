import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { prompt } = req.body; // prompt 변수를 req.body로부터 올바르게 추출

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions", // API 버전을 최신으로 변경
        {
          model: "gpt-4", // OpenAI에서 권장하는 최신 모델명으로 변경
          messages: [{ role: "user", content: prompt }],
          temperature: 0.9,
          max_tokens: 2500,
          presence_penalty: 0.5,
          frequency_penalty: 0.5,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      res.status(200).json(response.data);
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
