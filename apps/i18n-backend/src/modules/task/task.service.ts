import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Raw } from 'typeorm';
import { Definition } from '../definition/entities/definition.entity';
import { Translation } from '../translation/entities/translation.entity';
import { subMinutes } from 'date-fns'

enum Task {
  EmailNotification = 'email-notification'
}

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectRepository(Translation)
    private readonly translation: Repository<Translation>,
    @InjectRepository(Definition)
    private readonly definition: Repository<Definition>,
  ) {}

  @Cron('45 * * * * *', { name: Task.EmailNotification })
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
      this.logger.debug('Send email to translators ' + translatorsPerProductId[productId].join(', ') + 'saying they must translate new words for product #' + productId)
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
      this.logger.debug('Send email to validators ' + validatorsPerProductIds[productId].join(', ') + 'saying they must validate translations for product #' + productId)
    }
  }
}
