import { scrapeEULegislators } from '../scraper.js'

test('legislators', async () => {
  const legislators = await scrapeEULegislators()

  expect(Array.isArray(legislators)).toBeTruthy()
  expect(legislators.length).toBe(719) // This number can fluctuate, feel free to update the test if it's the case.

  const first = legislators[0]

  // The first MEP retrieved may change, so feel free to update the test if that happens.
  expect(first.name).toBe('Mika AALTOLA')
  expect(first.lastName).toBe('AALTOLA')
  expect(first.partyGroup).toBe('Group of the European People\'s Party (Christian Democrats)')
  expect(first.country).toBe('Finland')
  expect(first.url).toBe('https://www.europarl.europa.eu/meps/en/256810/MIKA_AALTOLA/home') // We want the complete URL
  expect(first.image).toBe('https://www.europarl.europa.eu/mepphoto/256810.jpg')
})
