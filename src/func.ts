import { ChatCompletionFunctions } from "openai"
import { search } from "./google-search"
import { fetchWebPage } from "./fetchWebPage"

export const functions: ChatCompletionFunctions[] = [
  {
    name: "fetchWebPage",
    description: "Fetch the content of a web page.",
    parameters: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "URL of the page",
        },
      },
      required: ["url"],
    },
  },
  {
    name: "searchWeb",
    description: "Search the web. Returns a list of results.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query",
        }
      },
      required: ["query"],
    }
  }
]

async function searchWeb(query: string) {
  const result = await search(query)
  return result.items.slice(0, 3).map((item) => {
    return `${item.title}\n${item.link}`
  }).join("\n\n")
}

export async function callFunc(name: string, args: any) {
  if (typeof args !== "object") {
    throw new Error("args are not object")
  }
  if (name === "fetchWebPage") {
    if (typeof args.url !== "string") {
      throw new Error("url is not string")
    }
    return fetchWebPage(args.url)
  } else if (name === "searchWeb") {
    const { query } = args
    if (typeof query !== "string") {
      throw new Error("query is not string")
    }
    return searchWeb(query)
  } else {
    throw new Error("invalid function name")
  }
}