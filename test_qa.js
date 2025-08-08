// Test locale per la pipeline QA di @xenova/transformers
import { pipeline } from '@xenova/transformers';

async function testQA() {
    const qa = await pipeline('question-answering', 'Xenova/distilbert-base-uncased-distilled-squad');
    const question = 'Che ho bevuto oggi?';
    const context = 'Ciao ehy Ciao Oggi ho bevuto una limonata';
    console.log('Tipo context:', typeof context);
    console.log('Context:', context);
    const result = await qa({ question, context });
    console.log('Risposta:', result.answer);
}

testQA();
