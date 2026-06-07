export default async function handler(req, res) {
    if(req.method !== "POST"){
        return res.status(405).json({error: "Method not allowed :("});
    }

    const {messages} = req.body;

    const apiKey = process.env.AI_API_KEY;

    if(!apiKey) {
        return res.status(500).json({error: "API Key Missing !"});
    }

    try {
        const apiURL = "https://ai.hackclub.com/proxy/v1/chat/completions";
        const response = await fetch(apiURL, {
            method:"POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
            },
            body: JSON.stringify({
                model: "qwen/qwen3-32b",
                messages: messages
            }),
        });;

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({error: "failed to communicate with ai api"});
    }
}