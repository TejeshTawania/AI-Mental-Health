const CRISIS_PATTERNS = [
  /\b(suicide|suicidal)\b/i,
  /\bkill(ing)? myself\b/i,
  /\bend(ing)? my life\b/i,
  /\bwant(ing)? to die\b/i,
  /\bno reason to live\b/i,
  /\bself[- ]?harm\b/i,
  /\bhurt(ing)? myself\b/i,
];

function detectCrisisLanguage(message){
  if(!message || typeof message !== "string") return false;
  return CRISIS_PATTERNS.some(pattern=> pattern.test(message))
}

function getCrisisResponse(){
  return (
     "It sounds like you might be going through something really difficult right now. " +
    "I'm not able to provide crisis support, but please reach out to people who can help right away:\n\n" +
    "- **Call 14416** (available 24/7)\n" +
    
    "- If you're outside India, please search for your local crisis line or go to your nearest emergency room.\n\n" +
    "You don't have to go through this alone."
  )
}



module.exports = {detectCrisisLanguage, getCrisisResponse}