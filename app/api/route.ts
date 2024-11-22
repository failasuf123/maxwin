export async function GET(request: Request) {
    const data = {
        id: "",
        name: "sendy",
    }

    return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
    })
}
