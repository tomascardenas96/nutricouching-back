import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SpecialtyService } from './specialty.service';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';
import { TokenGuard } from 'src/auth/guard/token.guard';

@Controller('specialty')
export class SpecialtyController {
  constructor(private readonly specialtyService: SpecialtyService) { }

  @UseGuards(TokenGuard)
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

  @Get('professional/:professionalId')
  getSpecialtiesByProfessional(
    @Param('professionalId') professionalId: string,
  ) {
    return this.specialtyService.getSpecialtiesByProfessional(professionalId);
  }

  @UseGuards(TokenGuard)
  @Post('/list')
  verifyAndCreateSpecialtiesByArray(
    @Body() createSpecialtyDto: CreateSpecialtyDto[],
  ) {
    return this.specialtyService.verifyAndCreateSpecialtiesByArray(
      createSpecialtyDto,
    );
  }

  @UseGuards(TokenGuard)
  @Post(':specialtyId/professional/:professionalId')
  assignSpecialtyToAProfessional(
    @Param('specialtyId') specialtyId: string,
    @Param('professionalId') professionalId: string,
  ) {
    return this.specialtyService.assignSpecialtyToAProfessional(
      professionalId,
      specialtyId,
    );
  }

  @UseGuards(TokenGuard)
  @Patch('unlink/:specialtyId/professional/:professionalId')
  unassignSpecialtyOfProfessional(
    @Param('specialtyId') specialtyId: string,
    @Param('professionalId') professionalId: string,
  ) {
    return this.specialtyService.unassignSpecialtyOfProfessional(
      professionalId,
      specialtyId,
    );
  }

  @UseGuards(TokenGuard)
  @Patch(':specialtyId')
  modifySpecialty(
    @Param('specialtyId') specialtyId: string,
    @Body() updateSpecialtyDto: UpdateSpecialtyDto,
  ) {
    return this.specialtyService.modifySpecialty(
      specialtyId,
      updateSpecialtyDto,
    );
  }

  @UseGuards(TokenGuard)
  @Delete(':specialtyId')
  remove(@Param('specialtyId') specialtyId: string) {
    return this.specialtyService.deleteSpecialty(specialtyId);
  }
}
