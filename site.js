export const SITE = {
  url: "https://finds.billsworkshopcompany.com",
  amazonTag: "billsworkshop-20",
  etsyShop: "https://www.etsy.com/shop/BillsWorkshopCompany",
  digitalTools: "https://billsworkshopcompany.com"
};

/*
  Per-guide Amazon tracking IDs.

  With one tag on every link, the Associates reports cannot say which guide
  earned a sale. One tracking ID per guide makes the Earnings and Ordered Items
  reports break down by guide.

  OFF until each ID exists in Associates Central. Amazon only credits tags that
  belong to the account. A link carrying a tag that was never created there is
  a link that earns nothing, and nothing on the site would show it.

  To turn it on:
  1. Associates Central → Account Settings → Manage Your Tracking IDs.
  2. Create each ID below. Amazon tracking IDs are unique across all of
     Amazon, so if one is taken, pick another and change it here.
  3. Set PER_GUIDE_TRACKING to true.

  A guide missing from this map, or any guide while the flag is off, uses
  SITE.amazonTag. The amzn.to "Shop my list" links are not affected: a
  shortlink carries the tag it was created with.
*/
export const PER_GUIDE_TRACKING = true;

export const TRACKING_IDS = {
  "travel-essentials": "bwffatravel-20",
  "hotel-room-essentials": "bwffahotel-20",
  "flight-attendant-dog-gifts": "bwffadog-20",
  "student-pilot-gifts": "bwfstudentpilot-20",
  "first-solo-flight-gifts": "bwffirstsolo-20",
  "checkride-prep-gifts": "bwfcheckride-20",
  "new-private-pilot-gifts": "bwfnewpilot-20",
  "dog-lover-gifts": "bwfdoglover-20",
  "elementary-classroom-essentials": "bwfclassroom-20",
  "retro-classroom-decor": "bwfretroclass-20",
  "first-apartment-tools": "bwfapartment-20",
  "holiday-gifts": "bwfholiday-20",
  "pen-pal-starter-kit": "bwfpenpal-20",
  "adventure-travel-essentials": "bwfadventure-20",
  "cozy-fall-finds": "bwfcozyfall-20",
  "whimsical-kitchen-finds": "bwfkitchen-20"
};

/** The Amazon tag for a guide's product links. */
export function amazonTagFor(guideKey, { perGuide = PER_GUIDE_TRACKING } = {}) {
  if (!perGuide) return SITE.amazonTag;
  return TRACKING_IDS[guideKey] ?? SITE.amazonTag;
}
