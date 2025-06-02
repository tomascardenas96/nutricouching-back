import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Res,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { TokenGuard } from 'src/auth/guard/token.guard';
import { PlanAccessGuard } from './guard/planAccessGuard.guard';
import { Response } from 'express';
import { ActiveUser } from 'src/common/decorators/Active-user.decorator';
import { User } from 'src/user/entity/user.entity';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Get('all')
  getAllPlans() {
    return this.planService.getAllPlans();
  }

  @Get()
  @UseGuards(TokenGuard)
  getAllPlansWhenUserIsLoggedIn(@ActiveUser() user: User) {
    return this.planService.getAllPlansWhenUserIsLoggedIn(user);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/plans',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}-${file.originalname}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.includes('pdf')) {
          return cb(new Error('Only pdf files are allowed!'), false);
        }

        cb(null, true);
      },
    }),
  )
  createPlan(
    @UploadedFile() file: Express.Multer.File,
    @Body() plan: CreatePlanDto,
  ) {
    const file_name = file.filename;
    return this.planService.createPlan(plan, file_name);
  }

  @Get(':planId/download')
  @UseGuards(TokenGuard, PlanAccessGuard)
  downloadPlan(@Param('planId') planId: string, @Res() res: Response) {
    return this.planService.downloadPlan(planId, res);
  }

  @Post(':planId/purchase')
  @UseGuards(TokenGuard)
  purchasePlan(@Param('planId') planId: string, @ActiveUser() user: User) {
    return this.planService.purchasePlan(planId, user);
  }

  @Delete(':planId')
  @UseGuards(TokenGuard)
  deletePlan(@Param('planId') planId: string) {
    return this.planService.deletePlan(planId);
  }

  @Patch(':planId')
  @UseGuards(TokenGuard)
  updatePlan(
    @Param('planId') planId: string,
    @Body() updatePlan: UpdatePlanDto,
  ) {
    return this.planService.updatePlan(planId, updatePlan);
  }
}
