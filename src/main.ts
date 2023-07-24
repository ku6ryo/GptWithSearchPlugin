import "dotenv/config"
import readline from "readline"
import { GptMessage, callGpt } from "./gpt"
import { callFunc, functions } from "./func"

enum Assinee {
  User = "user",
  Assistant = "assistant",
  Function = "function",
}

;(async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  let assignee = Assinee.User
  let functionCall: any = null
  let messages = [] as GptMessage[]
  while (true) {
    if (assignee === Assinee.User) {
      const text = await new Promise<string>((resolve) => {
        rl.question("Your input: ", function(input) {
          resolve(input)
        })
      })
      messages.push({ role: "user", content: text } as GptMessage)
      assignee = Assinee.Assistant
    } else if (assignee === Assinee.Function) {
      if (!functionCall) {
        throw new Error("functionCall is null")
      }
      const { name, arguments: args } = functionCall
      if (!name || !args) {
        throw new Error("invalid function_call")
      }
      const res = await callFunc(name, JSON.parse(args))
      messages.push({ role: "function", name, content: res } as GptMessage)
      functionCall = null
      assignee = Assinee.Assistant
    } else if (assignee === Assinee.Assistant) {
      const message = await callGpt(messages, functions)
      if (!message) {
        throw new Error("no message")
      }
      if (message.function_call) {
        functionCall = message.function_call
        assignee = Assinee.Function
      } else {
        messages.push({ role: "assistant", content: message?.content || "" } as GptMessage)
        assignee = Assinee.User
      }
    } else {
      throw new Error("invalid assignee")
    }
    console.log(messages[messages.length - 1].content)
  }
})()