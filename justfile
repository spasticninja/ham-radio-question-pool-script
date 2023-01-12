convert-pdf:
  pdftotext 'Technician Pool and Syllabus 2022-2026 Public Release Errata March 7 2022.pdf'
  node convertToJSON.js './Technician Pool and Syllabus 2022-2026 Public Release Errata March 7 2022.txt'