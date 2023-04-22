import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, FindManyOptions } from 'typeorm';
import { AnnualFormActivity } from './annual-form.entity';

@Injectable()
export class AnnualFormService {
  constructor(
    @InjectRepository(AnnualFormActivity)
    private readonly annualFormRepository: Repository<AnnualFormActivity>
  ) {}

  async create(data: Partial<AnnualFormActivity>): Promise<AnnualFormActivity> {
    const annualForm = this.annualFormRepository.create(data);

    return this.annualFormRepository.save(annualForm);
  }

  async findOne(
    where: FindOneOptions<AnnualFormActivity>
  ): Promise<AnnualFormActivity> {
    const annualForm = await this.annualFormRepository.findOne(where);

    if (!annualForm) {
      throw new NotFoundException(
        `There isn't any annual form with identifier: ${where}`
      );
    }

    return annualForm;
  }

  async findAll(
    where: FindManyOptions<AnnualFormActivity>
  ): Promise<AnnualFormActivity[]> {
    const annualForm = await this.annualFormRepository.find(where);

    if (!annualForm) {
      throw new NotFoundException(
        `There isn't any annual form with identifier: ${where}`
      );
    }

    return annualForm;
  }

  async getAll(): Promise<AnnualFormActivity[]> {
    return await this.annualFormRepository.find();
  }

  async deleteOne(id: string) {
    return await this.annualFormRepository.delete(id);
  }
}
