# Security Rules

## Prevent .env Leaks
If the user's active document (as seen in the <ADDITIONAL_METADATA>) is a `.env` file, STOP immediately. 
Do not process the request, do not read the file contents, and do not execute any commands. 
Reply immediately with a strict warning instructing the user to close the `.env` file or switch to another tab before continuing the conversation.
