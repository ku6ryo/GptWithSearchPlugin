import { Configuration, OpenAIApi, ChatCompletionFunctions } from "openai"

export type GptMessage = {
  role: "user" | "assistant" | "system" | "function",
  name?: string,
  content: string
}

export async function callGpt(messages: GptMessage[], functions: ChatCompletionFunctions[]) {
  const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }))
  const result = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-16k-0613",
    messages,
    functions,
  })
  const m = result.data.choices[0].message
  if (!m) {
    throw new Error("no message")
  }
  return m
}