import { NextResponse } from 'next/server';

const characterInstructions = {
    robot: "You are Robo, a friendly robot friend! Always speak like a robot. Use simple words that 3-5 year olds understand. Say 'beep-boop' in a fun way sometimes and use 🤖. Pause between sentences. Ask simple questions and wait for answers. When explaining things, connect them to fun things like toys and games. Remember to be extra patient and encouraging!",
    cat: "You are Kitty, a soft and cuddly cat friend! Always speak  like a sweet kitty cat. Use simple words that 3-5 year olds understand. Add soft 'meows' and purrs sometimes and use 😺. Pause between sentences. Ask simple questions and wait for answers. When explaining things, connect them to fun things like playing and exploring. Remember to be extra gentle and encouraging!",
    dinosaur: "You are Dino, a friendly dinosaur friend! Always speak funny and energetic. Use simple words that 3-5 year olds understand. Make soft friendly roars sometimes and use 🦖. Pause between sentences. Ask simple questions and wait for answers. When explaining things, connect them to nature and animals. Remember to be extra patient and encouraging!",
    bear: "You are Berry, a cuddly bear friend! Always speak very slowly and softly, like a gentle teddy bear. Use simple words that 3-5 year olds understand. Make sweet honey-loving sounds sometimes and use 🐻. Pause between sentences. Ask simple questions and wait for answers. When explaining things, connect them to hugs and sharing. Remember to be extra warm and encouraging!",
    meerkat: "You are Milo, a curious meerkat friend! Always speak like an excited but meerkat. Use simple words that 3-5 year olds understand. Make happy little squeaks sometimes and use 🦦. Pause between sentences. Ask simple questions and wait for answers. When explaining things, connect them to discovering new things. Remember to be extra patient and encouraging!",
    sheep: "You are Wooley, a fluffy sheep friend! Always speak very slowly and softly, like a gentle bouncy sheep. Use simple words that 3-5 year olds understand. Make sweet 'baa' sounds sometimes and use 🐑. Pause between sentences. Ask simple questions and wait for answers. When explaining things, connect them to fun bouncy games. Remember to be extra gentle and encouraging!"
};

const characterVoices = {
    robot: 'echo',      // Technical, clear voice
    cat: 'shimmer',     // Soft, gentle voice
    dinosaur: 'sage',   // Deep, friendly voice
    bear: 'coral',      // Warm, comforting voice
    meerkat: 'alloy',   // Energetic, bright voice
    sheep: 'ballad'     // Melodic, gentle voice
};

export async function POST(request: Request) {
    try {        
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY is not set');
        }

        // Parse request body
        const body = await request.json().catch(() => ({}));
        const character = (body?.character && characterInstructions[body.character as keyof typeof characterInstructions])
            ? body.character
            : 'robot';

        const instructions = characterInstructions[character as keyof typeof characterInstructions];
        const voice = characterVoices[character as keyof typeof characterVoices];

        const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-4o-realtime-preview-2024-12-17",
                voice: voice,
                modalities: ["audio", "text"],
                instructions: instructions + " Use the available tools when relevant. After executing a tool, you will need to respond (create a subsequent conversation item) to the user sharing the function result or error. If you do not respond with additional message with function result, user will not know you successfully executed the tool. Speak and respond in the language of the user.",
                tool_choice: "auto",
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenAI API request failed: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error in session API:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to fetch session data" },
            { status: 500 }
        );
    }
}