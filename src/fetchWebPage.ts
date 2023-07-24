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
  const $ = load(html)
  $("script").remove()
  $("style").remove()
  $("iframe").remove()
  $("link").remove()
  $("meta").remove()
  $("select").remove()
  // return $.html().slice(0, limit)
  return $.text().slice(0, limit)
}