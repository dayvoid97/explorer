export const AD_CONFIG = {
  // Your AdSense publisher ID
  CLIENT_ID: 'ca-pub-8441965953327461',

  // Ad slot IDs - create these in your AdSense account
  AD_SLOTS: {
    WINNERS_PAGE_PRIMARY: '7779271603',
    FG_WINNERS_HP: '1491551118',
    COMPANY_CARD_SKYSCRAPER: '1271920610',
    CHRONOW_VERTICAL: '3079239579',
  },

  // Ad placement settings
  PLACEMENT: {
    MIN_SPACING: 6, // Minimum wins between ads
    MAX_SPACING: 10, // Maximum wins between ads
    PROBABILITY: 0.15, // 15% chance of ad placement
    START_AFTER: 5, // Start showing ads after this many wins
  },
}

// Helper function to get all available ad slots as an array
export const getAvailableAdSlots = (): string[] => {
  return Object.values(AD_CONFIG.AD_SLOTS)
}

// Helper function to get a random ad slot
export const getRandomAdSlot = (index: number): string => {
  const slots = getAvailableAdSlots()
  return slots[index % slots.length]
}
