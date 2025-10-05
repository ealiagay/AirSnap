import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;        // el HTML lo construyes en otro módulo y lo pasas aquí
  text?: string;       // opcional: versión solo texto
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: {
    filename: string;
    path?: string;              // o usa "content" si generas el archivo en memoria
    content?: string | Buffer;
    contentType?: string;
  }[];
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>('EMAIL_HOST');
    const port = Number(this.config.get<string>('EMAIL_PORT') ?? 587);
    const secure = this.config.get<string>('EMAIL_SECURE') === 'true' ? true : false;
    const user = this.config.get<string>('EMAIL_USER');
    const pass = this.config.get<string>('EMAIL_PASS');

    if (!host || !port || !user || !pass) {
      throw new Error('Faltan variables SMTP: EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS');
    }

    this.from = this.config.get<string>('EMAIL_FROM') ?? user;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
  }

  /** Envía correo con el HTML que le pases desde otro módulo */
  async send(options: SendEmailOptions) {
    const mail = {
      from: this.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      cc: options.cc,
      bcc: options.bcc,
      attachments: options.attachments,
    };

    try {
      const info = await this.transporter.sendMail(mail);
      this.logger.log(`Email enviado a ${Array.isArray(options.to) ? options.to.join(', ') : options.to} | messageId=${info.messageId}`);
      return { ok: true, messageId: info.messageId };
    } catch (err: any) {
      this.logger.error(`Error enviando email: ${err?.message || err}`);
      throw err;
    }
  }
}
