/**
 * Map a detail route to the navigation section it belongs to, so the sidebar
 * highlights the correct menu item.
 *
 * Booking and creative detail pages live under `/campaigns/<channel>/booking/…`
 * and `/campaigns/<channel>/creative/…`, but they belong to the Bookings and
 * Creatives sections respectively — not Campaigns. Remapping their path lets the
 * existing prefix-matching light up the right parent/subitem.
 */
export function navSectionPath(pathname: string): string {
  if (!pathname) return pathname;

  const booking = pathname.match(/^\/campaigns\/([^/]+)\/booking(?:\/|$)/);
  if (booking) return `/bookings/${booking[1]}`;

  const creative = pathname.match(/^\/campaigns\/([^/]+)\/creative(?:\/|$)/);
  if (creative) return `/creatives/${creative[1]}`;

  return pathname;
}
