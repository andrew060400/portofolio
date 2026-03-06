const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('c:\\xampp\\htdocs\\portofolio\\ATS Andrew Irawan.pdf');

// Fix: The pdf module is the default export when required this way
pdf.default ? pdf.default(dataBuffer).then(processData) : pdf(dataBuffer).then(processData);

function processData(data) {
    fs.writeFileSync('c:\\xampp\\htdocs\\portofolio\\ats_content.txt', data.text);
    console.log('PDF parsed successfully.');
}
