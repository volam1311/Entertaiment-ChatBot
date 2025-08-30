import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import z from 'zod';
dotenv.config();
//-------------------------------Load OpenAI model------------------------------------------//
const client = new OpenAI({
   apiKey: process.env.OPEN_AI_KEY,
});

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

// app.get('/', (req: Request, res: Response) => {
//    res.send();
// });
// app.get('/api/hello', (req: Request, res: Response) => {
//    res.json({ message: 'Hello World' });
// });

let lastResponseID: string | null = null;
// conversationID -> lastResponseId
// conv1 -> 100
// conv2 -> 200
// Replace all this using Map
const conversations = new Map<string, string>();

// The chat schema is created to check the valid of the data and assign the id for the chat
const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required')
      .max(1000, 'Prompt is too long(max 1000 characters).'),
   conversationId: z.uuid(),
});

//----------------------------------Prompt Receiver------------------------------------------------//
app.post('/api/chat', async (req: Request, res: Response) => {
   const parseResult = chatSchema.safeParse(req.body);
   if (!parseResult.success) {
      res.status(400).json(z.formatError(parseResult.error));
      return;
   }
   const { prompt, conversationID } = req.body;
   const response = await client.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
      temperature: 0.3,
      max_output_tokens: 1000,
      previous_response_id: conversations.get(conversationID),
   });
   // lastResponseID = response.id;
   conversations.set(conversationID, response.id);
   res.json({ message: response.output_text });
});

app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
