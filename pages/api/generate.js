import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);


const generateAction = async (req, res) => {
  // Run first prompt
  const basePromptPrefix = `Suggest the skeleton of a SOAP progress note based on the provided chief complaint. The SOAP note should 
  include a subjective section that contains pertinent positive and negatives, with space for a user indicate presence of that sign or
   symptom. In the subjective section, the note should inquire about the timeline of symptoms and any relevant follow up questions based
   on the complaint, and provide a list of associated symptoms to ask about, each of them in brackets. Family history, social history, travel history should
   only be collected if its relevant. The subjective assessment should 
   also clearly point out red flag symptoms that should be documented. for example:
    chief complaint: headache

    Subjective:

    Subjective:
    -Chief complaint: headache 
    -Duration of headache: [duration] 
    -Time of day when headache worsens: [time] 
    -Location of headache: [location] 
    -Pain description: [description] 
    -Pain intensity on a 1-10 scale: [number]
    -Associated symptoms: [nausea], [vomiting], [dizziness], [light sensitivity], [sound sensitivity], [vision changes], [neck pain], [difficulty concentrating] 
    -Medications: [medications] 
    -Past treatments/therapies: [treatment or therapy] 
    -Red flag features: [thunderclap], [blurred vision], [morning headache], [headache wakes patient up], [headache worse with valsalva], [recent head trauma] 
    -Medical history: [medical conditions], [allergies], [medications] 
    -Family history: [medical conditions] 
    -Social history: [lifestyle], [diet], [exercise], [sleep], [alcohol], [tobacco], [drugs], [occupation], [stress levels]
    chief complaint:`

  console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.8,
    max_tokens: 1000,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  const secondPrompt = 
  `
  Take the following chief complaint and subjective section of a SOAP note and suggest a skeleton template for the objective part that includes vitals, 
  each physical exam maneuver with options for positive and negative findings, and any other maneuvers for a particular chief complaint. only include exams relevant to the chief complaint.
For example, for a chief complaint of headache: 
  objective:
  -Vitals: [BP], [HR], [RR], [Temp]
  - Cranial nerve exam: [no deficit] [deficit in cranial nerve #]
  -HEENT: [neck range of motion-normal] [neck tenderness-absent] [pupils-equal, round, reactive to light and accommodation] [ocular movements-intact] [fundoscopy-normal]
  -Motor: [upper extremity strength-5/5] [lower extremity strength-5/5]
  -Reflexes: [upper extremity-2+] [lower extremity-2+]
  -Cerebellar: [Rhomberg-negative] [Finger to Nose-intact]
  -Gait: [normal]
   
  Chief Complaint: ${req.body.userInput}

  Subjective: ${basePromptOutput.text}\n`

  const secondPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${secondPrompt}`,
    // I set a higher temperature for this one. Up to you!
    temperature: 0.80,
		// I also increase max_tokens.
    max_tokens: 1250,
  });
  
  // Get the output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();
// combine the two prompt outputs separated by a newline
  // Send over the Prompt #2's output to our UI instead of Prompt #1's.
  // concat the two prompts
    const combinedPromptOutput = `${basePromptOutput.text}\n${secondPromptOutput.text}`
  res.status(200).json({ output:combinedPromptOutput }); 

};

export default generateAction;