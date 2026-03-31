import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAppSettingDto } from './dto/create-app-setting.dto';
import { AppSettingEntity } from './entities/app-setting.entity';
import { AppSettingResponse } from './types/app-setting-response.type';

@Injectable()
export class AppSettingsService {
  constructor(
    @InjectRepository(AppSettingEntity)
    private readonly appSettingRepository: Repository<AppSettingEntity>,
  ) {}

  async create(dto: CreateAppSettingDto): Promise<AppSettingResponse> {
    const existing = await this.appSettingRepository.findOne({
      where: {
        settingGroup: dto.settingGroup,
        settingKey: dto.settingKey,
      },
    });

    if (existing) {
      throw new ConflictException(
        `Setting already exists: ${dto.settingGroup}.${dto.settingKey}`,
      );
    }

    const entity = this.appSettingRepository.create({
      settingGroup: dto.settingGroup,
      settingKey: dto.settingKey,
      settingValue: dto.settingValue,
      valueType: dto.valueType,
      description: dto.description ?? null,
      isPublic: dto.isPublic,
    });

    const saved = await this.appSettingRepository.save(entity);

    return this.toResponse(saved);
  }

  async findAll(): Promise<AppSettingResponse[]> {
    const rows = await this.appSettingRepository.find({
      order: {
        settingGroup: 'ASC',
        settingKey: 'ASC',
      },
    });

    return rows.map((row: AppSettingEntity) => this.toResponse(row));
  }

  private toResponse(entity: AppSettingEntity): AppSettingResponse {
    return {
      id: entity.id,
      settingGroup: entity.settingGroup,
      settingKey: entity.settingKey,
      settingValue: entity.settingValue,
      valueType: entity.valueType,
      description: entity.description,
      isPublic: entity.isPublic,
      updatedAt: entity.updatedAt,
    };
  }
}
