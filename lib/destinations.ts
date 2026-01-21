export interface Destination {
  id: string
  title: string
  location: string
  description: string
  price: number
  rating: number
  badge: string
  image: string
  safetyScore: number
  safetyData: {
    neighborhood: string[]
    medical: string[]
    essentials: string[]
    health: string[]
    weather: string[]
    tips: string[]
  }
}

export const destinations: Destination[] = [
  {
    id: "orlando",
    title: "Orlando Family Magic",
    location: "Orlando, Florida",
    description: "Theme parks, water parks, endless fun",
    price: 899,
    rating: 4.8,
    badge: "Popular with families",
    image: "/orlando-theme-park-castle-family-vacation.jpg",
    safetyScore: 4.8,
    safetyData: {
      neighborhood: [
        "Very safe for families with young children",
        "Well-lit tourist area with high foot traffic",
        "Safe to walk during day and evening",
        "Low crime rate compared to national average",
      ],
      medical: [
        "Children's Hospital: 12 min drive",
        "24-hour pharmacy: 5 min walk",
        "Urgent care clinic: 8 min drive",
        "Pediatric specialists available",
      ],
      essentials: [
        "Playgrounds: 6 within 10 min walk",
        "Kid-friendly restaurants: 23 nearby",
        "Grocery store with baby supplies: 4 min drive",
        "Indoor play areas (rainy day backup): 3 locations",
      ],
      health: [
        "No special vaccines required",
        "No current travel advisories",
        "Standard US health insurance accepted",
        "Drinking water: Safe from tap",
      ],
      weather: [
        "June-November: Hurricane season (low risk in Orlando)",
        "Best months for families: March-May, September-November",
        "Average temperature: 72-92°F year-round",
      ],
      tips: [
        "Tipping: 15-20% at restaurants expected",
        "Peak times: Avoid theme parks 10am-2pm",
        "Transportation: Uber/Lyft readily available",
      ],
    },
  },
  {
    id: "san-diego",
    title: "San Diego Beach Escape",
    location: "San Diego, California",
    description: "Beaches, zoo, perfect weather",
    price: 1299,
    rating: 4.9,
    badge: "Great for toddlers",
    image: "/san-diego-beach-family-vacation-waterfront.jpg",
    safetyScore: 4.9,
    safetyData: {
      neighborhood: [
        "Exceptionally safe coastal community",
        "Family-oriented beach neighborhoods",
        "Active lifeguard presence at all beaches",
        "Well-patrolled tourist areas",
      ],
      medical: [
        "Rady Children's Hospital: 15 min drive",
        "Beach emergency stations: Every 500m",
        "24-hour pharmacy: 3 min drive",
        "Pediatric urgent care: 10 min drive",
      ],
      essentials: [
        "Beach playgrounds: 8 locations",
        "Family restaurants: 40+ nearby",
        "Baby supply stores: Multiple options",
        "Indoor activities: Aquarium, museums, play centers",
      ],
      health: [
        "No vaccines required",
        "Excellent air quality",
        "Sun protection essential (high UV)",
        "Safe drinking water throughout",
      ],
      weather: [
        "Year-round mild climate (60-80°F)",
        "Rarely rains (average 10 days/year)",
        "Best for families: Any time of year",
      ],
      tips: [
        "Zoo tip: Arrive at opening for cooler temps",
        "Beach parking: Arrive before 10am on weekends",
        "Many restaurants offer kids-eat-free deals",
      ],
    },
  },
  {
    id: "maui",
    title: "Maui Paradise",
    location: "Maui, Hawaii",
    description: "Beaches, snorkeling, volcano",
    price: 2199,
    rating: 4.5,
    badge: "Adventure & relaxation",
    image: "/maui-hawaii-beach-palm-trees-family-vacation.jpg",
    safetyScore: 4.5,
    safetyData: {
      neighborhood: [
        "Resort areas very safe for families",
        "Low crime rate island-wide",
        "Friendly local community",
        "Well-maintained tourist infrastructure",
      ],
      medical: [
        "Maui Memorial Medical Center: 20 min",
        "Urgent care clinics in major areas",
        "Pharmacies in all resort towns",
        "Air evacuation available if needed",
      ],
      essentials: [
        "Beach parks with facilities: 12 locations",
        "Family-friendly luaus: 5 options",
        "Grocery stores: Well-stocked (prices higher)",
        "Baby gear rentals widely available",
      ],
      health: [
        "No vaccines required",
        "Be aware of jellyfish season (8 days after full moon)",
        "Strong sun - SPF 50+ recommended",
        "Safe tap water throughout island",
      ],
      weather: [
        "Year-round warm (70-85°F)",
        "Rainy season: November-March (brief showers)",
        "Best for families: April-October",
      ],
      tips: [
        "Road to Hana: Not recommended for toddlers",
        "Book activities 2+ weeks ahead",
        "Rent a car - essential for exploring",
      ],
    },
  },
  {
    id: "washington-dc",
    title: "DC Discovery Tour",
    location: "Washington DC",
    description: "Museums, monuments, history",
    price: 799,
    rating: 4.6,
    badge: "Educational",
    image: "/washington-dc-monuments-capitol-family-vacation.jpg",
    safetyScore: 4.6,
    safetyData: {
      neighborhood: [
        "National Mall area very safe",
        "Heavy security presence near monuments",
        "Tourist areas well-patrolled",
        "Avoid some neighborhoods after dark",
      ],
      medical: [
        "Children's National Hospital: 10 min",
        "Multiple urgent care options",
        "Pharmacies throughout the city",
        "Excellent healthcare infrastructure",
      ],
      essentials: [
        "FREE museums: 19 Smithsonian locations",
        "Kid-friendly tours available",
        "Parks and playgrounds: National Mall area",
        "Indoor options: Perfect for weather backup",
      ],
      health: [
        "No vaccines required",
        "No travel advisories",
        "All standard US healthcare accepted",
        "Safe drinking water",
      ],
      weather: [
        "Hot summers (80-95°F), cold winters (30-50°F)",
        "Best for families: Spring (April-May), Fall (Sept-Oct)",
        "Cherry blossoms: Late March-Early April",
      ],
      tips: [
        "Most museums free - arrive early",
        "Metro is family-friendly transportation",
        "Book monument tours in advance online",
      ],
    },
  },
  {
    id: "new-york",
    title: "NYC Family Adventure",
    location: "New York City",
    description: "Shows, museums, Central Park",
    price: 1499,
    rating: 4.4,
    badge: "For older kids",
    image: "/new-york-city-times-square-skyline-family-vacation.jpg",
    safetyScore: 4.4,
    safetyData: {
      neighborhood: [
        "Tourist areas (Times Square, Central Park) very safe",
        "Strong police presence in Manhattan",
        "Stay aware of surroundings in crowded areas",
        "Generally safe during day and evening",
      ],
      medical: [
        "NYU Langone Pediatrics: Multiple locations",
        "Urgent care clinics: Every few blocks",
        "24-hour pharmacies: Numerous options",
        "World-class pediatric specialists",
      ],
      essentials: [
        "Central Park playgrounds: 21 total",
        "Family-friendly restaurants: Endless options",
        "Grocery delivery widely available",
        "Indoor activities: Museums, shows, arcades",
      ],
      health: [
        "No vaccines required",
        "Air quality varies - check daily",
        "All US insurance accepted",
        "Safe tap water (excellent quality)",
      ],
      weather: [
        "Hot summers (75-90°F), cold winters (25-40°F)",
        "Best for families: May-June, September-October",
        "Holiday season: Magical but crowded",
      ],
      tips: [
        "Book Broadway shows for kids in advance",
        "Subway is stroller-friendly at some stations",
        "Many museums have free hours - check schedules",
      ],
    },
  },
  {
    id: "yellowstone",
    title: "Yellowstone National Park",
    location: "Yellowstone, Wyoming",
    description: "Nature, wildlife, adventure",
    price: 1099,
    rating: 4.7,
    badge: "Outdoor families",
    image: "/yellowstone-national-park-geyser-nature-family-vac.jpg",
    safetyScore: 4.7,
    safetyData: {
      neighborhood: [
        "Very safe within park boundaries",
        "Rangers available throughout park",
        "Follow wildlife safety guidelines strictly",
        "Stay on boardwalks near thermal features",
      ],
      medical: [
        "Park medical clinics: 3 locations (summer)",
        "Nearest hospital: 60+ min drive",
        "Emergency helicopter evacuation available",
        "Bring any essential medications",
      ],
      essentials: [
        "Junior Ranger programs for kids",
        "Picnic areas: 50+ locations",
        "General stores in park villages",
        "Visitor centers with family activities",
      ],
      health: [
        "No vaccines required",
        "Altitude adjustment may be needed (7,000+ ft)",
        "Bring bear spray (can rent in park)",
        "Water from park sources needs treatment",
      ],
      weather: [
        "Summer (June-Aug): 70-80°F days, 40°F nights",
        "Snow possible any month",
        "Best for families: July-August",
      ],
      tips: [
        "Book lodging 6+ months in advance",
        "Wildlife most active at dawn/dusk",
        "Bring layers - weather changes quickly",
      ],
    },
  },
]

export function getDestination(id: string): Destination | undefined {
  return destinations.find((d) => d.id === id)
}
