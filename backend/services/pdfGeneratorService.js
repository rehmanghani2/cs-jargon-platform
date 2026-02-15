const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

class PDFGeneratorService {
    
    // Generate Certificate PDF
    static async generateCertificatePDF(certificate) {
        return new Promise(async (resolve, reject) => {
            try {
                const doc = new PDFDocument({
                    size: 'A4',
                    layout: 'landscape',
                    margins: { top: 50, bottom: 50, left: 50, right: 50 }
                });

                const fileName = `certificate-${certificate.certificateId}.pdf`;
                const filePath = path.join(__dirname, '../uploads/certificates', fileName);
                
                // Ensure directory exists
                const dir = path.dirname(filePath);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }

                const writeStream = fs.createWriteStream(filePath);
                doc.pipe(writeStream);

                // Certificate design based on type
                await this.designCertificate(doc, certificate);

                doc.end();

                writeStream.on('finish', () => {
                    resolve({
                        fileName,
                        filePath,
                        url: `/uploads/certificates/${fileName}`
                    });
                });

                writeStream.on('error', reject);

            } catch (error) {
                reject(error);
            }
        });
    }

    // Design certificate based on type
    static async designCertificate(doc, certificate) {
        const pageWidth = doc.page.width;
        const pageHeight = doc.page.height;
        const centerX = pageWidth / 2;

        // Background color based on type
        const colors = {
            completion: { primary: '#1a5f7a', secondary: '#2e8bc0', accent: '#145374' },
            appreciation: { primary: '#7b2d8e', secondary: '#9c27b0', accent: '#6a1b9a' },
            character: { primary: '#1b5e20', secondary: '#2e7d32', accent: '#1b5e20' },
            achievement: { primary: '#e65100', secondary: '#ff6d00', accent: '#bf360c' },
            participation: { primary: '#37474f', secondary: '#546e7a', accent: '#263238' }
        };

        const color = colors[certificate.type] || colors.completion;

        // Border
        doc.rect(20, 20, pageWidth - 40, pageHeight - 40)
           .lineWidth(3)
           .stroke(color.primary);
        
        doc.rect(30, 30, pageWidth - 60, pageHeight - 60)
           .lineWidth(1)
           .stroke(color.secondary);

        // Decorative corners
        this.drawCornerDecoration(doc, 25, 25, color.accent);
        this.drawCornerDecoration(doc, pageWidth - 25, 25, color.accent, 90);
        this.drawCornerDecoration(doc, pageWidth - 25, pageHeight - 25, color.accent, 180);
        this.drawCornerDecoration(doc, 25, pageHeight - 25, color.accent, 270);

        // Header with logo placeholder
        doc.fontSize(14)
           .fillColor(color.primary)
           .text('CS JARGON PLATFORM', centerX - 100, 60, { width: 200, align: 'center' });

        doc.fontSize(10)
           .fillColor('#666666')
           .text('PAF-IAST', centerX - 100, 78, { width: 200, align: 'center' });

        // Certificate title
        const titles = {
            completion: 'CERTIFICATE OF COMPLETION',
            appreciation: 'CERTIFICATE OF APPRECIATION',
            character: 'CHARACTER CERTIFICATE',
            achievement: 'CERTIFICATE OF ACHIEVEMENT',
            participation: 'CERTIFICATE OF PARTICIPATION'
        };

        doc.fontSize(28)
           .fillColor(color.primary)
           .text(titles[certificate.type], 50, 120, { width: pageWidth - 100, align: 'center' });

        // Decorative line
        doc.moveTo(centerX - 150, 160)
           .lineTo(centerX + 150, 160)
           .lineWidth(2)
           .stroke(color.secondary);

        // "This is to certify that"
        doc.fontSize(14)
           .fillColor('#333333')
           .text('This is to certify that', 50, 185, { width: pageWidth - 100, align: 'center' });

        // Recipient name
        doc.fontSize(32)
           .fillColor(color.primary)
           .font('Helvetica-Bold')
           .text(certificate.recipientName, 50, 210, { width: pageWidth - 100, align: 'center' });

        // Underline for name
        const nameWidth = doc.widthOfString(certificate.recipientName);
        doc.moveTo(centerX - nameWidth/2 - 20, 250)
           .lineTo(centerX + nameWidth/2 + 20, 250)
           .lineWidth(1)
           .stroke(color.secondary);

        // Certificate description
        doc.font('Helvetica')
           .fontSize(12)
           .fillColor('#333333')
           .text(certificate.description, 80, 270, { 
               width: pageWidth - 160, 
               align: 'center',
               lineGap: 5
           });

        // Performance details for completion certificates
        if (certificate.type === 'completion' && certificate.performanceData) {
            const perfData = certificate.performanceData;
            
            doc.fontSize(11)
               .fillColor('#555555');

            let yPos = 320;
            
            if (perfData.courseName) {
                doc.text(`Course: ${perfData.courseName}`, 80, yPos, { width: pageWidth - 160, align: 'center' });
                yPos += 18;
            }
            
            if (perfData.level) {
                doc.text(`Level: ${perfData.level}`, 80, yPos, { width: pageWidth - 160, align: 'center' });
                yPos += 18;
            }
            
            if (perfData.finalGrade) {
                doc.text(`Grade Achieved: ${perfData.finalGrade} (${perfData.percentage}%)`, 80, yPos, { width: pageWidth - 160, align: 'center' });
                yPos += 18;
            }
            
            if (perfData.duration) {
                doc.text(`Duration: ${perfData.duration}`, 80, yPos, { width: pageWidth - 160, align: 'center' });
            }
        }

        // Character qualities for character certificates
        if (certificate.type === 'character' && certificate.performanceData?.qualities) {
            const qualities = certificate.performanceData.qualities;
            doc.fontSize(11)
               .fillColor('#555555')
               .text(`Demonstrated qualities: ${qualities.join(', ')}`, 80, 320, { 
                   width: pageWidth - 160, 
                   align: 'center' 
               });
        }

        // Issue date
        const issueDate = new Date(certificate.issuedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        doc.fontSize(10)
           .fillColor('#666666')
           .text(`Issued on: ${issueDate}`, 50, 400, { width: pageWidth - 100, align: 'center' });

        // Certificate ID
        doc.fontSize(9)
           .fillColor('#888888')
           .text(`Certificate ID: ${certificate.certificateId}`, 50, 420, { width: pageWidth - 100, align: 'center' });

        // Signature section
        doc.moveTo(120, 480)
           .lineTo(280, 480)
           .stroke('#333333');
        
        doc.fontSize(10)
           .fillColor('#333333')
           .text(certificate.issuedBy?.name || 'Academic Director', 120, 485, { width: 160, align: 'center' })
           .fontSize(9)
           .fillColor('#666666')
           .text(certificate.issuedBy?.title || 'Director', 120, 500, { width: 160, align: 'center' });

        // QR Code placeholder position
        doc.moveTo(pageWidth - 280, 480)
           .lineTo(pageWidth - 120, 480)
           .stroke('#333333');
        
        doc.fontSize(10)
           .fillColor('#333333')
           .text('Verify Online', pageWidth - 280, 485, { width: 160, align: 'center' })
           .fontSize(8)
           .fillColor('#666666')
           .text(certificate.verificationUrl || 'csjargon.com/verify', pageWidth - 280, 500, { width: 160, align: 'center' });

        // Generate and add QR code
        try {
            const qrCodeData = await QRCode.toDataURL(certificate.verificationUrl || `${process.env.FRONTEND_URL}/verify/${certificate.certificateId}`);
            doc.image(qrCodeData, pageWidth - 230, 430, { width: 60, height: 60 });
        } catch (qrError) {
            console.error('QR Code generation failed:', qrError);
        }

        // Footer
        doc.fontSize(8)
           .fillColor('#999999')
           .text('This certificate is electronically generated and can be verified at the URL above.', 
                 50, pageHeight - 45, { width: pageWidth - 100, align: 'center' });
    }

    // Draw corner decorations
    static drawCornerDecoration(doc, x, y, color, rotation = 0) {
        doc.save();
        doc.translate(x, y);
        doc.rotate(rotation);
        
        doc.path('M 0 0 L 30 0 L 30 5 L 5 5 L 5 30 L 0 30 Z')
           .fill(color);
        
        doc.restore();
    }

    // Generate Recommendation Letter PDF
    static async generateRecommendationPDF(letter) {
        return new Promise(async (resolve, reject) => {
            try {
                const doc = new PDFDocument({
                    size: 'A4',
                    margins: { top: 72, bottom: 72, left: 72, right: 72 }
                });

                const fileName = `recommendation-${letter.letterId}.pdf`;
                const filePath = path.join(__dirname, '../uploads/recommendations', fileName);
                
                // Ensure directory exists
                const dir = path.dirname(filePath);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }

                const writeStream = fs.createWriteStream(filePath);
                doc.pipe(writeStream);

                await this.designRecommendationLetter(doc, letter);

                doc.end();

                writeStream.on('finish', () => {
                    resolve({
                        fileName,
                        filePath,
                        url: `/uploads/recommendations/${fileName}`
                    });
                });

                writeStream.on('error', reject);

            } catch (error) {
                reject(error);
            }
        });
    }

    // Design recommendation letter
    static async designRecommendationLetter(doc, letter) {
        const pageWidth = doc.page.width;
        const margins = doc.page.margins;
        const contentWidth = pageWidth - margins.left - margins.right;

        // Letterhead
        doc.fontSize(16)
           .fillColor('#1a5f7a')
           .font('Helvetica-Bold')
           .text('CS JARGON PLATFORM', margins.left, margins.top, { width: contentWidth, align: 'center' });

        doc.fontSize(10)
           .fillColor('#666666')
           .font('Helvetica')
           .text('PAF-IAST | Mobile-Assisted Language Learning', margins.left, margins.top + 22, { width: contentWidth, align: 'center' });

        // Horizontal line
        doc.moveTo(margins.left, margins.top + 45)
           .lineTo(pageWidth - margins.right, margins.top + 45)
           .lineWidth(1)
           .stroke('#1a5f7a');

        // Date
        const issueDate = new Date(letter.issuedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        doc.fontSize(11)
           .fillColor('#333333')
           .text(issueDate, margins.left, margins.top + 70, { width: contentWidth, align: 'right' });

        // Letter ID
        doc.fontSize(9)
           .fillColor('#888888')
           .text(`Ref: ${letter.letterId}`, margins.left, margins.top + 85, { width: contentWidth, align: 'right' });

        // Salutation
        doc.fontSize(11)
           .fillColor('#333333')
           .text(letter.addressedTo || 'To Whom It May Concern,', margins.left, margins.top + 120);

        // Letter content
        let yPosition = margins.top + 150;
        const lineHeight = 16;

        // Introduction
        if (letter.content?.introduction) {
            doc.fontSize(11)
               .fillColor('#333333')
               .text(letter.content.introduction, margins.left, yPosition, {
                   width: contentWidth,
                   align: 'justify',
                   lineGap: 4
               });
            yPosition = doc.y + 15;
        }

        // Body paragraphs
        if (letter.content?.bodyParagraphs) {
            for (const paragraph of letter.content.bodyParagraphs) {
                doc.text(paragraph, margins.left, yPosition, {
                    width: contentWidth,
                    align: 'justify',
                    lineGap: 4
                });
                yPosition = doc.y + 15;
            }
        }

        // Performance highlights box
        if (letter.performanceSummary) {
            yPosition = doc.y + 10;
            
            doc.rect(margins.left, yPosition, contentWidth, 100)
               .fillAndStroke('#f5f5f5', '#e0e0e0');

            doc.fontSize(10)
               .fillColor('#1a5f7a')
               .font('Helvetica-Bold')
               .text('Performance Highlights', margins.left + 15, yPosition + 10);

            doc.font('Helvetica')
               .fontSize(9)
               .fillColor('#333333');

            const perf = letter.performanceSummary;
            const col1X = margins.left + 15;
            const col2X = margins.left + contentWidth/2;
            let perfY = yPosition + 30;

            if (perf.coursesCompleted?.length) {
                doc.text(`• Courses Completed: ${perf.coursesCompleted.length}`, col1X, perfY);
            }
            if (perf.quizAverage) {
                doc.text(`• Quiz Average: ${perf.quizAverage}%`, col2X, perfY);
            }
            perfY += 15;

            if (perf.totalJargonsMastered) {
                doc.text(`• Jargons Mastered: ${perf.totalJargonsMastered}`, col1X, perfY);
            }
            if (perf.assignmentAverage) {
                doc.text(`• Assignment Average: ${perf.assignmentAverage}%`, col2X, perfY);
            }
            perfY += 15;

            if (perf.streakRecord) {
                doc.text(`• Longest Learning Streak: ${perf.streakRecord} days`, col1X, perfY);
            }
            if (perf.badgesEarned) {
                doc.text(`• Badges Earned: ${perf.badgesEarned}`, col2X, perfY);
            }
            perfY += 15;

            if (perf.totalTimeSpent) {
                doc.text(`• Total Learning Time: ${Math.round(perf.totalTimeSpent)} hours`, col1X, perfY);
            }
            if (perf.peerReviewsCompleted) {
                doc.text(`• Peer Reviews: ${perf.peerReviewsCompleted}`, col2X, perfY);
            }

            yPosition = yPosition + 115;
        }

        // Skills section
        if (letter.content?.skills?.length > 0) {
            doc.fontSize(11)
               .fillColor('#333333')
               .text(`Based on their performance, ${letter.recipientDetails?.fullName?.split(' ')[0] || 'the student'} has demonstrated proficiency in:`, margins.left, yPosition, {
                   width: contentWidth
               });
            
            yPosition = doc.y + 10;

            letter.content.skills.forEach(skill => {
                doc.fontSize(10)
                   .text(`• ${skill}`, margins.left + 20, yPosition);
                yPosition = doc.y + 3;
            });

            yPosition += 10;
        }

        // Conclusion
        if (letter.content?.conclusion) {
            doc.fontSize(11)
               .text(letter.content.conclusion, margins.left, yPosition, {
                   width: contentWidth,
                   align: 'justify',
                   lineGap: 4
               });
            yPosition = doc.y + 20;
        }

        // Closing
        doc.text(letter.content?.closing || 'Sincerely,', margins.left, yPosition);
        yPosition = doc.y + 40;

        // Signature
        doc.fontSize(11)
           .font('Helvetica-Bold')
           .text(letter.issuedBy?.name || 'Academic Director', margins.left, yPosition);
        
        doc.font('Helvetica')
           .fontSize(10)
           .fillColor('#666666')
           .text(letter.issuedBy?.title || 'Director', margins.left, doc.y + 3)
           .text(letter.issuedBy?.institution || 'CS Jargon Platform, PAF-IAST', margins.left, doc.y + 3);

        // Footer with verification info
        const footerY = doc.page.height - margins.bottom - 30;
        
        doc.moveTo(margins.left, footerY - 10)
           .lineTo(pageWidth - margins.right, footerY - 10)
           .lineWidth(0.5)
           .stroke('#cccccc');

        doc.fontSize(8)
           .fillColor('#888888')
           .text(`This letter can be verified online at: ${letter.verificationUrl}`, 
                 margins.left, footerY, { width: contentWidth - 70, align: 'left' });

        // QR code in footer
        try {
            const qrCodeData = await QRCode.toDataURL(letter.verificationUrl);
            doc.image(qrCodeData, pageWidth - margins.right - 50, footerY - 15, { width: 40, height: 40 });
        } catch (qrError) {
            console.error('QR Code generation failed:', qrError);
        }
    }
}

module.exports = PDFGeneratorService;