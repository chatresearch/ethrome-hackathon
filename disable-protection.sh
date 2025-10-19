#!/bin/bash

# Vercel API endpoint to disable deployment protection
PROJECT_ID="prj_POMt7180SCbRiwNp79momD1tgaHY"
TEAM_ID="team_H7LMnlR3JU8vbsk8uCS9MF6t"

echo "Disabling deployment protection on ai-roast-generator..."

curl -X DELETE "https://api.vercel.com/v9/projects/$PROJECT_ID/protection" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  2>&1 | jq '.'

echo "Done"
