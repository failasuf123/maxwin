import axios from "axios"

const BASE_URL= "https://places.googleapis.com/v1/places:searchText"

const config = {
    headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY,
        'X-Goog-FieldMask': 'places.photos,places.displayName,places.id', // gunakan string, bukan array
    }
}


export const GetPlacesDetails=(data:any) => axios.post(BASE_URL, data, config)

export const PHOTO_REF_URL = `https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key=`+process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY
