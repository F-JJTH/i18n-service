import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Raw, Not, IsNull } from 'typeorm';
import { Definition } from '../definition/entities/definition.entity';
import { Translation } from '../translation/entities/translation.entity';
import { subMinutes } from 'date-fns';
import { MailService } from './mail.service';
import { App } from '@slack/bolt';
import { startOfYesterday, endOfYesterday } from 'date-fns';
import { Product } from '../product/entities/product.entity';

enum Task {
  EmailNotification = 'email-notification',
  SlackNotification = 'slack-notification',
}

enum EmailTemplate {
  Validator = 'validator',
  Translator = 'translator',
}

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  private readonly boltApp = new App({
    signingSecret: '7abd3455a06eef1d4a87ae4c77fe7abb',
    token: 'xoxb-161967681842-3413296030261-WX4CfI5CbB42XkNcT8tzmUys',
  })

  constructor(
    @InjectRepository(Translation)
    private readonly translation: Repository<Translation>,
    @InjectRepository(Definition)
    private readonly definition: Repository<Definition>,
    @InjectRepository(Product)
    private readonly product: Repository<Product>,
    private readonly mailSvc: MailService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_10AM, { name: Task.SlackNotification })
  async handleSlackNotificationCron() {
    const products = await this.product.find({
      where: {
        isSlackNotificationEnabled: true,
        slackNotificationChannelName: Not(IsNull())
      }
    })
    const conversations = await this.boltApp.client.conversations.list({limit: 1000})

    if (products.length === 0 || conversations.channels.length === 0) {
      return
    }

    products.forEach(async product => {
      const channelName = product.slackNotificationChannelName
      const channel = conversations.channels.find(c => c.name === (channelName.startsWith('#') ? channelName.substring(1): channelName))

      if (!channel) {
        return
      }

      const newDefinitionCount = await this.definition.count({
        where: {
          product: product.id,
          createdAt: Between(startOfYesterday().toISOString(), endOfYesterday().toISOString())
        }
      })

      if (newDefinitionCount === 0) {
        return
      }

      this.boltApp.client.chat.postMessage({
        channel: channel.id,
        text: `Il y a ${newDefinitionCount} nouveau${newDefinitionCount > 1 ? 'x' : ''} terme${newDefinitionCount > 1 ? 's' : ''} à traduire :slightly_smiling_face: 
        https://translate.kizeo.com`,
      })
    })
  }

  //@Cron('45 * * * * *', { name: Task.EmailNotification })
  async handleEmailNotificationCron() {
    this.logger.log('Execute scheduled job: ' + Task.EmailNotification);
    const now = new Date()
    this.handleTranslatorsEmailNotification(now)
    this.handleValidatorsEmailNotification(now)
  }

  private async handleTranslatorsEmailNotification(now: Date) {
    const definitions = await this.definition.find({
      where: {
        updatedAt: Between(subMinutes(now, 3).toISOString(), now.toISOString())
      },
      relations: ['product', 'product.authorizations']
    })
    const translatorsPerProductId = definitions.reduce((prev, curr) => {
      return {
        [curr.product.id]: [
          ...(prev[curr.product.id] || []),
          ...curr.product.authorizations.filter(a => a.translations.length).map(a => a.email)
        ]
      }
    }, {})
    for(let productId in translatorsPerProductId) {
      this.logger.debug('Send email to translators ' + translatorsPerProductId[productId].join(', ') + ' saying they must translate new words for product #' + productId)
      this.sendMail(productId, translatorsPerProductId[productId], EmailTemplate.Translator)
    }
  }

  private async handleValidatorsEmailNotification(now: Date) {
    const translations = await this.translation.find({
      where: {
        updatedAt: Between(subMinutes(now, 3).toISOString(), now.toISOString()),
        value: Raw(alias => `${alias} IS NOT NULL`)
      },
      relations: ['product', 'product.authorizations']
    })
    const validatorsPerProductIds = translations.reduce((prev, curr) => {
      return {
        [curr.product.id]: [
          ...(prev[curr.product.id] || []),
          ...curr.product.authorizations.filter(a => a.validator).map(a => a.email)
        ]
      }
    }, {})
    for(let productId in validatorsPerProductIds) {
      this.logger.debug('Send email to validators ' + validatorsPerProductIds[productId].join(', ') + ' saying they must validate translations for product #' + productId)
      this.sendMail(productId, validatorsPerProductIds[productId], EmailTemplate.Validator)
    }
  }

  private async sendMail(productId: string, emails: string[], type: EmailTemplate) {
    try {
      await this.mailSvc.sendMail({
        from: 'i18n-notification@kizeo.com',
        to: 'delhamaide@kizeo.com',
        bcc: emails,
        subject: '👀 Hola',
        template: type,
        context: {
            name: 'Name'
        }
      })
    } catch(err) {
      throw err
    }
  }
}
