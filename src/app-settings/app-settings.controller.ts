import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateAppSettingDto } from './dto/create-app-setting.dto';
import { AppSettingsService } from './app-settings.service';
import { AppSettingResponse } from './types/app-setting-response.type';

@ApiTags('App Settings')
@Controller('app-settings')
export class AppSettingsController {
  constructor(private readonly appSettingsService: AppSettingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create application setting' })
  @ApiResponse({ status: 201, description: 'Application setting created' })
  async create(@Body() dto: CreateAppSettingDto): Promise<AppSettingResponse> {
    return this.appSettingsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all application settings' })
  @ApiResponse({ status: 200, description: 'List application settings' })
  async findAll(): Promise<AppSettingResponse[]> {
    return this.appSettingsService.findAll();
  }
}
