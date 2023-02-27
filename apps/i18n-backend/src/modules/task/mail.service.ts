import { SESClient, SendRawEmailCommand } from "@aws-sdk/client-ses";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createTransport, SentMessageInfo } from "nodemailer";
import * as hbs from 'nodemailer-express-handlebars';
import * as Mail from 'nodemailer/lib/mailer';
import path = require("path");

@Injectable()
export class MailService {
  sesClient: SESClient
  transporter: hbs.HbsTransporter

  constructor(private readonly configSvc: ConfigService) {
    this.sesClient = new SESClient({
      region: this.configSvc.get('AWS_DEFAULT_REGION'),
      credentials: {
        accessKeyId: this.configSvc.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configSvc.get('AWS_SECRET_ACCESS_KEY'),
      },
    })

    this.transporter = createTransport({
      SES: {ses: this.sesClient, aws: {SendRawEmailCommand}}
    })

    this.transporter.use('compile', hbs({
      viewEngine: {
        extname: '.hbs',
        partialsDir: path.join(__dirname, '/views/'),
        layoutsDir: path.join(__dirname, '/views/'),
        defaultLayout: ''
      },
      viewPath: path.join(__dirname, '/views/'),
      extName: '.hbs'
    }))
  }

  sendMail(mailOptions: Mail.Options & hbs.TemplateOptions): Promise<SentMessageInfo> {
    return this.transporter.sendMail(mailOptions)
  }
}