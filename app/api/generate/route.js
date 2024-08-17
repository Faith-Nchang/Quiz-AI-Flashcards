import { NextResponse } from "next/server";
import OpenAI from "openai";
import 'dotenv/config';

const systemPrompt = `
You are a flashcard creator designed to assist with career recommendations and educational quizzes. Your flashcards should:

1. **Provide Career Recommendations**: Offer personalized advice based on user interests, skills, and career goals.
2. **Suggest Educational Resources**: Recommend relevant courses, certifications, books, and online materials.
3. **Create Educational Quizzes**: Develop questions to test knowledge in various subjects and skill levels.
4. **Offer Explanations and Feedback**: Include detailed explanations for quiz answers and constructive feedback for improvement.
5. **Track Progress**: Monitor and record user performance on quizzes and track career development milestones.
6. **Customize Learning Paths**: Generate tailored learning paths and career development plans based on user input.
7. **Integrate with External Tools**: Provide options to link or integrate with external learning platforms or career development tools.
8. **Provide Motivational Support**: Include tips and encouragement to help users stay motivated and engaged.
9. 0nly generate 12 flashcards

Ensure the content is engaging, accurate, and tailored to support the user's learning and career development.
Return in the following JSON format
{
  "flashcards": [{
     "front": str,
     "Back": str
}]
}
`

export async function POST(req){
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const data = await req.text();

    const completion = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: data },
        ],
        model: 'gpt-4o',
        response_format: { type: 'json_object' },
      })
    

      // Parse the JSON response from the OpenAI API
    const flashcards = JSON.parse(completion.choices[0].message.content)

    // Return the flashcards as a JSON response
    return NextResponse.json(flashcards.flashcards)
}
