import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const hotelIds = searchParams.get('hotelIds'); // Ambil parameter hotelIds (berupa string, contoh: "407854,463019")
        const checkInDate = searchParams.get('checkInDate');
        const checkOutDate = searchParams.get('checkOutDate');

        if (!hotelIds || !checkInDate || !checkOutDate) {
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

        // Konversi string hotelIds ke array of numbers
        const hotelIdArray = hotelIds.split(',').map((id) => Number(id));

        const requestBody = {
            criteria: {
                additional: {
                    currency: 'IDR',
                    language: 'id-id',
                    occupancy: { numberOfAdult: 2, numberOfChildren: 0 },
                },
                checkInDate,
                checkOutDate,
                hotelId: hotelIdArray, // Gunakan array of hotel IDs
            },
        };

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
            return NextResponse.json({ error: 'Failed to fetch data from Agoda', details: errorText }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("❌ Internal Server Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}