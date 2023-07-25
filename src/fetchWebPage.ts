import { load } from "cheerio"
import axios from "axios"

/**
 * @param url URL of the page
 * @param limit Limit of the length of the content. Default is 3000.
 * @returns 
 */
export async function fetchWebPage(url: string, limit = 3000) {
  const res = await axios.get(url)
  const html = res.data
  if (typeof html !== "string") {
    return "Content cannot be retrieved."
  }
  let $ = load(html)
  const ampLink = $('link[rel="amphtml"]').attr("href")
  if (ampLink) {
    try {
      const ampRes = await axios.get(ampLink)
      const ampHtml = ampRes.data
      $ = load(ampHtml)
      if (typeof ampHtml !== "string") {
        return "Content cannot be retrieved."
      }
      $ = load(ampHtml)
    } catch (e) { 
      // pass
    }
  }

  $("script").remove()
  $("noscript").remove()
  $("style").remove()
  $("iframe").remove()
  $("link").remove()
  $("meta").remove()
  $("select").remove()
  $("input").remove()
  $("button").remove()
  $("form").remove()
  $("svg").remove()
  $("video").remove()
  $("audio").remove()

  return $.text().replace(/ +/g, " ").replace(/\n/g, " ").slice(0, limit)
}