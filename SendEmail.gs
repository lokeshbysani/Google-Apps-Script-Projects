function sendThankYouEmail(e) {
  // Get the email address and other form response data from the event object
  var responses = e.values; // Array of form responses
  var emailAddress = responses[1];
  var name = responses[0]; 

  // Compose the email
  var subject = 'Thank You for Your Response!';
  var body = 'Dear ' + name + ',\n\nThank you for your response. We appreciate your feedback.\n\nBest regards,\nYour Team';
  
  // Send the email
  MailApp.sendEmail({
  to: recipient,
  subject: subject,
  htmlBody: body, });
}
