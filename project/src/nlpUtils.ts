import { pipeline } from '@xenova/transformers';

export const generateQuestions = async (text: string): Promise<string[]> => {
  try {
    console.log('Generating questions for text:', text); // Debugging line

    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const questions: string[] = [];

    // Question patterns for different types of content
    const patterns = {
      what: (concept: string) => `What is the significance of ${concept}?`,
      explain: (concept: string) => `Explain the concept of ${concept}.`,
      how: (concept: string) => `How does ${concept} work?`,
      compare: (concepts: string[]) => `Compare and contrast ${concepts[0]} and ${concepts[1]}.`,
      describe: (concept: string) => `Describe the process of ${concept}.`,
    };

    // Load the NER pipeline
    console.log('Loading NER pipeline...'); // Debugging line
    const ner = await pipeline('ner', {
      model: 'Xenova/bert-base-NER', // Specify a valid model
    });
    console.log('NER pipeline loaded successfully'); // Debugging line

    // Extract entities
    console.log('Extracting entities...'); // Debugging line
    const entities = await ner(text);
    console.log('Entities extracted:', entities); // Debugging line

    // Group entities by sentence
    const uniqueEntities = new Set(
      entities
        .filter((e: any) => e.score > 0.8)
        .map((e: any) => e.word)
    );

    // Generate questions based on entities and patterns
    const entityArray = Array.from(uniqueEntities);
    for (let i = 0; i < Math.min(entityArray.length, 5); i++) {
      const entity = entityArray[i];
      const pattern = Object.values(patterns)[i % Object.keys(patterns).length];

      if (typeof pattern === 'function') {
        if (pattern.length === 1) {
          questions.push(pattern(entity));
        } else if (i < entityArray.length - 1) {
          questions.push(pattern([entity, entityArray[i + 1]]));
        }
      }
    }

    // Ensure we have at least 5 questions
    while (questions.length < 5 && sentences.length > 0) {
      const sentence = sentences.pop()?.trim();
      if (sentence) {
        questions.push(`Explain the following concept: "${sentence}"`);
      }
    }

    console.log('Generated Questions:', questions); // Debugging line
    return questions;
  } catch (error) {
    console.error('Error in generateQuestions:', error); // Debugging line
    throw new Error(`Failed to generate questions: ${error.message}`);
  }
};