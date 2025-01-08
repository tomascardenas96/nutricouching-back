import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SpecialtyService } from './specialty.service';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';

@Controller('specialty')
export class SpecialtyController {
  constructor(private readonly specialtyService: SpecialtyService) {}

  @Post()
  createSpecialty(@Body() createSpecialtyDto: CreateSpecialtyDto) {
    return this.specialtyService.createSpecialty(createSpecialtyDto);
  }

  @Get()
  findAll() {
    return this.specialtyService.findAll();
  }

  @Get('/filter')
  findByQuery(@Query('name') name: string) {
    return this.specialtyService.findByQuery(name);
  }

  @Get('service/:serviceId')
  getSpecialtiesByService(@Param('serviceId') serviceId: string) {
    return this.specialtyService.getSpecialtiesByService(serviceId);
  }

  @Post('/list')
  verifyAndCreateSpecialtiesByArray(
    @Body() createSpecialtyDto: CreateSpecialtyDto[],
  ) {
    return this.specialtyService.verifyAndCreateSpecialtiesByArray(
      createSpecialtyDto,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSpecialtyDto: UpdateSpecialtyDto,
  ) {
    return this.specialtyService.update(+id, updateSpecialtyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.specialtyService.remove(+id);
  }
}
