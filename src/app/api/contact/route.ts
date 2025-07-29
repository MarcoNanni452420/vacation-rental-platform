import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = contactSchema.parse(body)
    
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // use false for port 587, true for port 465
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASSWORD || ''
      },
      tls: {
        rejectUnauthorized: true
      }
    })

    // Email HTML template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background-color: #ffffff; padding: 30px; border: 1px solid #e9ecef; }
            .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; }
            h1 { color: #212529; margin: 0 0 20px 0; }
            .field { margin-bottom: 20px; }
            .label { font-weight: bold; color: #495057; }
            .value { margin-top: 5px; }
            .message { background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin-top: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Nuova richiesta da Trastevere Luxury Homes</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Nome:</div>
                <div class="value">${validatedData.name}</div>
              </div>
              
              <div class="field">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${validatedData.email}">${validatedData.email}</a></div>
              </div>
              
              <div class="field">
                <div class="label">Messaggio:</div>
                <div class="message">${validatedData.message.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
            <div class="footer">
              <p>Questo messaggio è stato inviato dal form di contatto del sito Trastevere Luxury Homes</p>
            </div>
          </div>
        </body>
      </html>
    `

    // Send email
    const mailOptions = {
      from: `"Trastevere Luxury Homes" <${process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@trastivereiluxury.com'}>`,
      to: 'marco.nanni92@gmail.com',
      subject: `Nuova richiesta da ${validatedData.name}`,
      text: `Nome: ${validatedData.name}\nEmail: ${validatedData.email}\n\nMessaggio:\n${validatedData.message}`,
      html: htmlContent,
      replyTo: validatedData.email
    }

    // Verify connection configuration
    await transporter.verify()
    
    // Send the email
    await transporter.sendMail(mailOptions)

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}