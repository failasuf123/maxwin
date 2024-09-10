
const cityPlaceholder:string[] = [
    "Nusa Penida, Bali",
    "Jakarta",
    "Batu, Malang",
    "Jogjakarta",
    "Denpasar, Bali",
    "Purwokerto",
    "Bandung",
    "Dieng, Wonosobo",
    "Semarang",
    "Lombok"
  ]

const AI_PROMPT="Generate Travel Plan for Location: {location}, for {totaldays} Days for {traveler} with a {budget} budget. Give me a Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, Rating, Time travel each of the location for {totaldays2} days with each day plan with best time to visit in JSON format."

export {cityPlaceholder, AI_PROMPT}
