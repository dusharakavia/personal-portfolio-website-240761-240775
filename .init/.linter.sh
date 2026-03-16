#!/bin/bash
cd /tmp/kavia/workspace/code-generation/personal-portfolio-website-240761-240775/frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

