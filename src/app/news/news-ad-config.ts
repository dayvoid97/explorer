/*
 * Ad slots for the /news front page. Each placement has its own AdSense unit so
 * AdSense's "By ad unit" report compares them directly. Plain module (no
 * 'use client') so the server page and the client ad components can both read it.
 *
 * Paste each unit's data-ad-slot below. While a slot is empty its placement
 * renders nothing, and the page lays out as if it were not there.
 */
export const NEWS_AD_CLIENT = 'ca-pub-8441965953327461'
export const NEWS_RAIL_AD_SLOT = '5794294214' // fg-news-desktop-rail (Responsive, pinned to 300×600)
export const NEWS_ROW_AD_SLOT = '7406758780' // fg-news-mobile (Responsive)
// Phones and tablets: a row after the lead story, then every N briefs.
export const NEWS_ROW_AD_EVERY = 8
