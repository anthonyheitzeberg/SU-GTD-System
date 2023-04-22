import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AnnualFormService } from './annual-form.service';
import { AnnualFormActivity } from '@su-gtd/api-interfaces';
import { Colleges } from '@su-gtd/api-enums';

@Controller('annual-form')
export class AnnualFormController {
  constructor(private readonly annualFormService: AnnualFormService) {}

  @Get('/activities')
  getAll() {
    return this.annualFormService.getAll();
  }

  @Get('/activity/:id')
  getOne(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<AnnualFormActivity> {
    return this.annualFormService.findOne({ where: { id } });
  }

  @Get('/:college/:year')
  getByYearAndCollege(
    @Param('college') college: Colleges,
    @Param('year') year: number
  ) {
    return this.annualFormService.findAll({
      where: {
        year,
        college,
      },
      order: {
        guidanceServiceType: 'ASC',
      },
    });
  }

  @Get('/:annualFormIdentifier')
  getActivitiesByAcronym(
    @Param('annualFormIdentifier') annualFormIdentifier: string
  ) {
    return this.annualFormService.findAll({
      where: {
        annualFormIdentifier,
      },
    });
  }

  @Post('/activity')
  saveActivity(@Body() annualFormActivity: AnnualFormActivity) {
    return this.annualFormService.create(annualFormActivity);
  }

  @Delete('/activity/:id')
  removeActivity(@Param('id') id: string) {
    return this.annualFormService.deleteOne(id);
  }
}
