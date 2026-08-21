import type { TargetGroup } from '@/components/ui/target-select';

/**
 * The online target-group catalogue — ONE list, used by every surface that
 * targets a booking (the booking detail pages and the booking wizards), so
 * the wizard can never drift to an older targeting UI than the form it
 * results in. Groups are what production lists; suggestions are the demo
 * values offered as you type.
 */
export const onlineTargetGroups: TargetGroup[] = [
  { value: 'search-keyword', label: 'Search Keyword', description: 'Shoppers searching these terms', suggestions: ['cola', 'cola zero sugar', 'energy drink', 'iced tea', 'sparkling water', 'soda multipack'] },
  { value: 'single-category', label: 'Single Category', description: 'One category, without children', suggestions: ['Beverages', 'Snacks', 'Dairy', 'Frozen foods', 'Health & Beauty'] },
  { value: 'category-child', label: 'Category — incl child categories', description: 'A category and everything under it', suggestions: ['Beverages', 'Snacks', 'Household', 'Baby & Child'] },
  { value: 'brand', label: 'Brand', description: 'Shoppers viewing these brands', suggestions: ['Coca-Cola', 'Fanta', 'Sprite', 'Knorr', 'Unilever'] },
  { value: 'interest', label: 'Interest', description: 'Behavioural interest segments', suggestions: ['Health-focused shoppers', 'Households with kids', 'Premium buyers', 'Bargain hunters'] },
  { value: 'page-type', label: 'Page Type', description: 'Where on the storefront the ad shows', suggestions: ['Homepage', 'Category page', 'Search results', 'Product page', 'Checkout'] },
  { value: 'city', label: 'City', description: 'Delivery city', suggestions: ['Amsterdam', 'Rotterdam', 'Utrecht', 'The Hague', 'Eindhoven'] },
  { value: 'city-group', label: 'City group', description: 'Named sets of cities', suggestions: ['Randstad', 'North', 'South'] },
  { value: 'zipcodes', label: 'Multicountry zipcodes', description: 'Postal code lists across countries', suggestions: [] },
  { value: 'app-version', label: 'App Version', description: 'Minimum or exact app versions', suggestions: ['≥ 8.0', '≥ 9.0', 'Latest only'] },
  { value: 'delivery-mode', label: 'Delivery Mode', description: 'Home delivery vs pickup', suggestions: ['Home delivery', 'Pickup'] },
  { value: 'availability', label: 'Product availability', description: 'Only where the product is in stock', suggestions: ['In stock', 'In stock incl. next day'] },
];
