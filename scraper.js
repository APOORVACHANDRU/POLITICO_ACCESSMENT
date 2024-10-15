import axios from 'axios'
import * as cheerio from 'cheerio'

const url = 'https://www.europarl.europa.eu/meps/en/full-list/all'

// Function to fetch HTML of the page
async function fetchPage(url) {
  try {
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    console.error(`Error fetching the page: ${error}`)
    throw error
  }
}

// Function to parse the MEP data
function parseMEPs(html) {
  const $ = cheerio.load(html)
  const meps = []

  // Traverse the DOM to extract MEP data
  $('.erpl_member-list-item').each((i, element) => {
    const name = $(element).find('.erpl_title-h4').text().trim()
    const lastName = name.split(' ').slice(-1).join(' ')  // Extract the last Name
    const partyGroup = $(element).find('a > div > div:nth-child(3) > span:nth-child(1)').text().trim()
    const country = $(element).find('a > div > div:nth-child(3) > span:nth-child(3)').text().trim()
    const relativeProfileUrl = $(element).find('.erpl_member-list-item-content').attr('href')
    const imageUrl = $(element).find('a > div > div.erpl_image-frame.mb-2 > span > img').attr('src') || ''

    if (!name) {
      console.warn(`MEP at index ${i} has no name. Skipping.`)
      return
    }
    if (!relativeProfileUrl) {
      console.warn(`MEP "${name}" is missing a profile URL.`)
    }
    if (!imageUrl) {
      console.warn(`MEP "${name}" is missing an image URL.`)
    }

    let formattedName = name.toUpperCase()
    formattedName = formattedName.replace(' ', '_').replace(' ', '+')
    const profileUrl  = relativeProfileUrl ? `${relativeProfileUrl}/${formattedName}/home`: ''
    // Push structured MEP data to array
    meps.push({
      name,
      lastName,
      partyGroup,
      country,
      url: profileUrl,
      image: imageUrl,
    })
  })
  return meps
}

export const scrapeEULegislators = async () => {
  // @TODO: implement a scraper for MEPs

  const html = await fetchPage(url)
  const meps = parseMEPs(html)
  console.log(meps.length)

  return meps
}
