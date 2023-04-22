import { Module } from '@nestjs/common';
import { AnnualFormController } from './annual-form.controller';
import { AnnualFormService } from './annual-form.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnualFormActivity } from './annual-form.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AnnualFormActivity])],
  controllers: [AnnualFormController],
  providers: [AnnualFormService],
})
export class AnnualFormModule {}
