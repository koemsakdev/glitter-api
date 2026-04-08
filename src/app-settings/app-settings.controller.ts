import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
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

  @Get('group/:settingGroup/key/:settingKey')
  @ApiOperation({ summary: 'Get application setting by group and key' })
  @ApiResponse({ status: 200, description: 'Application setting found' })
  async findByGroupAndKey(
    @Param('settingGroup') settingGroup: string,
    @Param('settingKey') settingKey: string,
  ): Promise<AppSettingResponse> {
    return this.appSettingsService.findByGroupAndKey(settingGroup, settingKey);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get application setting by ID' })
  @ApiResponse({ status: 200, description: 'Application setting found' })
  async findOne(@Param('id') id: string): Promise<AppSettingResponse> {
    return this.appSettingsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an application setting' })
  @ApiResponse({ status: 200, description: 'Application setting updated' })
  async update(
    @Param('id') id: string,
    @Body() dto: CreateAppSettingDto,
  ): Promise<AppSettingResponse> {
    return this.appSettingsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an application setting' })
  @ApiResponse({ status: 204, description: 'Application setting deleted' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.appSettingsService.delete(id);
  }
}
