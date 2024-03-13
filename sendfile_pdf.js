function sendFileByIdToResponder(e) {
  var formResponse = e.response;
  var respondentEmail = formResponse.getRespondentEmail();
  
  var fileId = 'file_id'; // ID file PDF di Google Drive
  
  var file = DriveApp.getFileById(fileId);
  
  // Kirim email ke responder dengan tautan file PDF
  var subject = 'File PDF untuk Anda';
  var message = 'Berikut adalah file PDF yang diminta.\n\nSilakan unduh melalui tautan berikut:\n' + file.getUrl();
    
  MailApp.sendEmail({
    to: respondentEmail,
    subject: subject,
    body: message,
    attachments: [file.getAs(MimeType.PDF)]
  });
}
