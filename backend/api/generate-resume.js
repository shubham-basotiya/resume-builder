const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

//  Helper function to embed font
const embedFont = async (pdfDoc, fontName) => {
  try {
    return await pdfDoc.embedFont(StandardFonts[fontName]);
  } catch (error) {
    console.warn(`Font "${fontName}" not found, using Helvetica`);
    return await pdfDoc.embedFont(StandardFonts.Helvetica);
  }
};

//  Modified modifyPdf function (adjust file access)
const modifyPdf = async (data) => {
  try {
    const pdfBytes = await fs.readFile(`${__dirname}/../CV FORMAT.pdf`);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const font = await embedFont(pdfDoc, 'Helvetica');

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
      '<<GCC_EXP>>': { x: 420, y: 180, value: data.gccExperience },
      '<<SIGNATURE>>': { x: 420, y: 125, value: data.signature },
    };

    for (const tag in replacements) {
      const { x, y, value } = replacements[tag];
      firstPage.drawText(value, {
        x,
        y,
        font,
        size: 11,
        color: rgb(0, 0, 0),
      });
    }

    const modifiedPdfBytes = await pdfDoc.save();
    return modifiedPdfBytes;
  } catch (error) {
    console.error('Error modifying PDF:', error);
    throw error;
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); //  Method Not Allowed
  }

  try {
    const userData = req.body;
    const pdfBytes = await modifyPdf(userData);

    const filename = `${userData.firstName}_${userData.lastName}_Resume.pdf`; //  Construct filename

    //  Set headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`); //  Force download
    res.status(200).send(Buffer.from(pdfBytes));

  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating PDF');
  }
}