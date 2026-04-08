/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { StaffEntity, type EmploymentStatus } from './entities/staff.entity';
import {
  StaffResponse,
  StaffListResponse,
  StaffDetailResponse,
} from './types/staff-response.type';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(StaffEntity)
    private readonly staffRepository: Repository<StaffEntity>,
  ) {}

  async create(dto: CreateStaffDto): Promise<StaffDetailResponse> {
    const existingEmail = await this.staffRepository.findOne({
      where: { email: dto.email },
    });

    if (existingEmail !== null) {
      throw new ConflictException(`Email "${dto.email}" is already in use`);
    }

    // Check if phone already exists
    const existingPhone = await this.staffRepository.findOne({
      where: { phone: dto.phone },
    });

    if (existingPhone !== null) {
      throw new ConflictException(`Phone "${dto.phone}" is already in use`);
    }

    const status: EmploymentStatus = dto.employmentStatus ?? 'active';

    const entity = this.staffRepository.create({
      branchId: dto.branchId,
      name: dto.name,
      role: dto.role,
      phone: dto.phone,
      email: dto.email,
      employmentStatus: status,
    });

    const saved = await this.staffRepository.save(entity);
    const staffData: StaffResponse = this.toResponse(saved);
    return {
      data: staffData,
    };
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<StaffListResponse> {
    if (page < 1 || limit < 1) {
      throw new BadRequestException('Page and limit must be greater than 0');
    }

    const skip = (page - 1) * limit;

    const [staff, total] = await this.staffRepository.findAndCount({
      skip,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    const mappedData: StaffResponse[] = staff.map((member: StaffEntity) =>
      this.toResponse(member),
    );

    const response: StaffListResponse = {
      data: mappedData,
      total: Number(total),
      page,
      limit,
    };
    return response;
  }

  async findOne(id: string): Promise<StaffDetailResponse> {
    const staff = await this.staffRepository.findOne({ where: { id } });

    if (staff === null) {
      throw new NotFoundException(`Staff with ID ${id} not found`);
    }

    const staffData: StaffResponse = this.toResponse(staff);
    return {
      data: staffData,
    };
  }

  async findByBranch(branchId: string): Promise<StaffListResponse> {
    const [staff, total] = await this.staffRepository.findAndCount({
      where: { branchId },
      order: {
        name: 'ASC',
      },
    });

    const mappedData: StaffResponse[] = staff.map((member: StaffEntity) =>
      this.toResponse(member),
    );

    const response: StaffListResponse = {
      data: mappedData,
      total: Number(total),
      page: 1,
      limit: Number(total),
    };
    return response;
  }

  async update(id: string, dto: UpdateStaffDto): Promise<StaffDetailResponse> {
    const staff = await this.staffRepository.findOne({ where: { id } });

    if (staff === null) {
      throw new NotFoundException(`Staff with ID ${id} not found`);
    }

    // Check if new email is already in use
    if (
      dto.email !== undefined &&
      dto.email !== null &&
      dto.email !== staff.email
    ) {
      const existingEmail = await this.staffRepository.findOne({
        where: { email: dto.email },
      });

      if (existingEmail !== null) {
        throw new ConflictException(`Email "${dto.email}" is already in use`);
      }
    }

    // Check if new phone is already in use
    if (
      dto.phone !== undefined &&
      dto.phone !== null &&
      dto.phone !== staff.phone
    ) {
      const existingPhone = await this.staffRepository.findOne({
        where: { phone: dto.phone },
      });

      if (existingPhone !== null) {
        throw new ConflictException(`Phone "${dto.phone}" is already in use`);
      }
    }

    // Update only provided fields
    if (dto.name !== undefined && dto.name !== null) {
      staff.name = dto.name;
    }
    if (dto.role !== undefined && dto.role !== null) {
      staff.role = dto.role;
    }
    if (dto.phone !== undefined && dto.phone !== null) {
      staff.phone = dto.phone;
    }
    if (dto.email !== undefined && dto.email !== null) {
      staff.email = dto.email;
    }
    if (dto.employmentStatus !== undefined && dto.employmentStatus !== null) {
      staff.employmentStatus = dto.employmentStatus;
    }

    const updated = await this.staffRepository.save(staff);

    const staffData: StaffResponse = this.toResponse(updated);
    return {
      data: staffData,
    };
  }

  async delete(id: string): Promise<void> {
    const staff = await this.staffRepository.findOne({ where: { id } });

    if (staff === null) {
      throw new NotFoundException(`Staff with ID ${id} not found`);
    }

    await this.staffRepository.remove(staff);
  }

  async findActiveByBranch(branchId: string): Promise<StaffListResponse> {
    const [staff, total] = await this.staffRepository.findAndCount({
      where: { branchId, employmentStatus: 'active' },
      order: {
        name: 'ASC',
      },
    });

    const mappedData: StaffResponse[] = staff.map((member: StaffEntity) =>
      this.toResponse(member),
    );

    const response: StaffListResponse = {
      data: mappedData,
      total: Number(total),
      page: 1,
      limit: Number(total),
    };
    return response;
  }

  private toResponse(entity: StaffEntity): StaffResponse {
    const response: StaffResponse = {
      id: entity.id,
      branchId: entity.branchId,
      name: entity.name,
      role: entity.role,
      phone: entity.phone,
      email: entity.email,
      employmentStatus: entity.employmentStatus,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
    return response;
  }
}
