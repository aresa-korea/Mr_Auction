import axios from "axios";

export default async function handler(req, res) {
  const response = await axios.get("https://api.openai.com/v1/engines", {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
    },
  });
  console.log(response.data);
}
