import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        
        // Required parameters
        const cityId = searchParams.get('cityId');
        const checkInDate = searchParams.get('checkInDate');
        const checkOutDate = searchParams.get('checkOutDate');
        
        // Optional parameters with defaults
        const maxResult = searchParams.get('maxResult') || '30';
        const sortBy = searchParams.get('sortBy') || 'Recommended';
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const discountOnly = searchParams.get('discountOnly') === 'true';
        const minStarRating = searchParams.get('minStarRating');
        const minReviewScore = searchParams.get('minReviewScore');

        if (!cityId || !checkInDate || !checkOutDate) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        const apiUrl = process.env.AGODA_API_URL;
        const apiKey = process.env.AGODA_API_KEY;
        const siteId = process.env.AGODA_SITE_ID;

        if (!apiUrl || !apiKey || !siteId) {
            console.error("❌ Missing API credentials");
            return NextResponse.json({ error: 'Missing API credentials' }, { status: 500 });
        }

        const authHeader = `${siteId}:${apiKey}`;

        const requestBody: any = {
            criteria: {
                additional: {
                    currency: 'IDR',
                    language: 'id-id',
                    maxResult: Number(maxResult),
                    sortBy: sortBy,
                    discountOnly: discountOnly,
                    occupancy: { numberOfAdult: 2, numberOfChildren: 0 },
                },
                checkInDate,
                checkOutDate,
                cityId: Number(cityId),
            },
        };

        // Add optional filters if they exist
        if (minPrice || maxPrice) {
            requestBody.criteria.additional.dailyRate = {};
            if (minPrice) requestBody.criteria.additional.dailyRate.minimum = Number(minPrice);
            if (maxPrice) requestBody.criteria.additional.dailyRate.maximum = Number(maxPrice);
        }

        if (minStarRating) {
            requestBody.criteria.additional.minimumStarRating = Number(minStarRating);
        }

        if (minReviewScore) {
            requestBody.criteria.additional.minimumReviewScore = Number(minReviewScore);
        }

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip,deflate',
                Authorization: authHeader,
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Error response from Agoda API:", errorText);
            return NextResponse.json({ 
                error: 'Failed to fetch data from Agoda', 
                details: errorText 
            }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("❌ Internal Server Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}