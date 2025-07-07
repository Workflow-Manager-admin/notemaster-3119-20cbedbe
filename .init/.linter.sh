#!/bin/bash
cd /home/kavia/workspace/code-generation/notemaster-3119-20cbedbe/notes_app_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

