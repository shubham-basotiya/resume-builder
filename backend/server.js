// backend/server.js
const express = require('express');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs').promises;
const cors = require('cors'); //  For cross-origin requests
const app = express();
app.use(cors());
app.use(express.json());

async function modifyPdf(templatePath, data, outputPath) {
  try {
    const pdfBytes = await fs.readFile(templatePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0]; // Assuming all replacements are on the first page

    //  Helper function to embed font (simplified)
    const embedFont = async (fontName) => {
      try {
        return await pdfDoc.embedFont(StandardFonts[fontName]);
      } catch (error) {
        console.warn(`Font "${fontName}" not found, using Helvetica`);
        return await pdfDoc.embedFont(StandardFonts.Helvetica);
      }
    };

    const font = await embedFont('Helvetica'); //  Default font

    //  This is where the magic (and complexity) happens
    //  YOU WILL NEED TO CAREFULLY DETERMINE THE X, Y COORDINATES
    //  for each piece of text in your template.  This is VERY manual.
    //  PDF editors often show coordinates.  Libraries exist to parse PDFs
    //  to get this data, but they are complex.

    //  REPLACE WITH YOUR ACTUAL COORDINATES
    const replacements = {
      '<<TRADE>>': { x: 328.32, y: 686, value: data.trade },
      '<<FIRST_NAME>><<LAST_NAME>>': { x: 328.32, y: 610, value: data.firstName + ' ' + data.lastName },
      '<<FATHERS_NAME>>': { x: 328.32, y: 586, value: data.fathersName },
      '<<DOB>>': { x: 328.32, y: 560, value: data.dob },
      '<<MARITAL_STATUS>>': { x: 328.32, y: 535, value: data.maritalStatus },
      '<<RELIGION>>': { x: 328.32, y: 510, value: data.religion },
      '<<EDU>>': { x: 328.32, y: 433, value: data.education },
      '<<ADDRESS>>': { x: 328.32, y: 407, value: data.address },
      '<<CONTACT_PERSON>>': { x: 347, y: 382.50, value: data.contact },
      '<<PP_NO>>': { x: 43, y: 300, value: data.passportNumber },
      '<<PLACE_OF_ISSUE>>': { x: 161, y: 300, value: data.placeOfIssue },
      '<<DOI>>': { x: 270, y: 300, value: data.dateOfIssue },
      '<<DOE>>': { x: 392, y: 300, value: data.dateOfExpiry },
      '<<PP_TYPE>>': { x: 505, y: 300, value: data.ppType },
      '<<DESIGNATION>>': { x: 267, y: 202, value: data.designation },
      '<<IND_EXP>>': { x: 420, y: 202, value: data.indiaExperience },
      '<<ABR_DESIGNATION>>': { x: 267, y: 180, value: data.abrDesignation },
      '<<GCC_EXP>>': { x: 420 , y: 180 , value: data.gccExperience },
      '<<SIGNATURE>>': { x: 420 , y: 125 , value: data.signature },
    };

    for (const tag in replacements) {
      const { x, y, value } = replacements[tag];
      firstPage.drawText(value, {
        x,
        y,
        font,
        size: 11, //  Adjust as needed
        color: rgb(0, 0, 0), //  Black
      });
    }

    const modifiedPdfBytes = await pdfDoc.save();
    await fs.writeFile(outputPath, modifiedPdfBytes);  //  For debugging/saving

    return modifiedPdfBytes;
  } catch (error) {
    console.error('Error modifying PDF:', error);
    throw error;    
  }
}

app.post('/generate-resume', async (req, res) => {
  try {
    const userData = req.body;
    const pdfBytes = await modifyPdf('CV FORMAT2.pdf', userData, 'output.pdf'); //  Template path
    res.contentType('application/pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    res.status(500).send('Error generating PDF');
  }
});

app.listen(5000, () => console.log('Server started on port 5000'));