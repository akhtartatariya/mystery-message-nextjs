import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
        let chunkText="";
        const result = await model.generateContentStream(prompt);
        for await (const chunk of result.stream) {
            chunkText +=  chunk.text();
        }
        if (!result.response) {
            return Response.json({
                success: false,
                message: "Suggest message generation failed due to an error"
            })
        }
        return Response.json({
            success: true,
            message: "Suggest message generated successfully",
            data: {
                message: chunkText
            }
        })
    } catch (error: any) {
        return Response.json({
            success: false,
            message: "Suggest message generation failed " + error.message
        }, {
            status: 500
        })
    }
}