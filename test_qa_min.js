// Test minimo per la pipeline QA Xenova
import { pipeline } from '@xenova/transformers';

async function testQA() {
    // Usa il modello compatibile Xenova per QA
    const qa = await pipeline('question-answering', 'Xenova/distilbert-base-uncased-finetuned-squad');
    const question = 'Che ho bevuto oggi?';
    const context = 'Ciao ehy Ciao Oggi ho bevuto una limonata';
    console.log('Tipo context:', typeof context);
    console.log('Context:', context);
    const result = await qa({ question, context });
    console.log('Risposta:', result.answer);
}

testQA();
