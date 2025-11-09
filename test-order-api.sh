#!/bin/bash

# Test the service order API endpoint
echo "Testing FuseFoundry email notifications..."
echo "Making API request to service order endpoint..."

curl -X POST https://fusefoundry.dev/api/service-order \
  -H "Content-Type: application/json" \
  -d '{
    "service": {
      "id": "health-check",
      "title": "Website Health Check - TEST ORDER",
      "price": "$497",
      "description": "Test order for email functionality"
    },
    "requirements": {
      "website": "https://fusefoundry.dev",
      "email": "hello@fusefoundry.dev",
      "phone": "+1 (555) 123-4567",
      "businessConcerns": "Testing email notification system",
      "preferredConsultationTime": "Anytime",
      "additionalNotes": "This is a test order to verify email notifications are working"
    }
  }'

echo ""
echo "Check your hello@fusefoundry.dev inbox for:"
echo "1. Customer confirmation email"
echo "2. Team notification email"
