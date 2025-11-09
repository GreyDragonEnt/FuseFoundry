#!/bin/bash

echo "Testing email to orders@fusefoundry.dev..."
echo "Making API request to test email system..."

curl -X POST http://localhost:3001/api/service-order \
  -H "Content-Type: application/json" \
  -d '{
    "service": {
      "id": "email-test",
      "title": "Email Test to orders@fusefoundry.dev",
      "price": "$1.00",
      "description": "Testing email delivery to orders@fusefoundry.dev"
    },
    "requirements": {
      "website": "https://fusefoundry.dev",
      "email": "orders@fusefoundry.dev",
      "phone": "+1234567890",
      "additionalNotes": "Testing email delivery to orders@fusefoundry.dev"
    }
  }' \
  && echo -e "\n\nEmail test completed. Check terminal for results."
