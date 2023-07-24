import axios from "axios"

type SearchResponsePartial = {
  items: {
    kind: string,
    title:string,
    htmlTitle: string,
    link: string,
    displayLink: string,
    snippet: string,
    htmlSnippet: string,
    cacheId: string,
    formattedUrl: string,
    htmlFormattedUrl: string,
  }[]
}

export async function search(query: string) {
  const url = "https://customsearch.googleapis.com/customsearch/v1"
  const { data } = await axios.get<SearchResponsePartial>(url, {
    params: {
      cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
      key: process.env.GOOGLE_SEARCH_API_KEY,
      q: query,
    }
  })
  return data
}