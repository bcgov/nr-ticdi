import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateTenantAddrDto } from "./dto/create-tenantAddr.dto";
import { TenantAddr } from "./entities/tenantAddr.entity";

@Injectable()
export class TenantAddrService {
  constructor(
    @InjectRepository(TenantAddr)
    private tenantAddrRepository: Repository<TenantAddr>
  ) {}

  async create(tenantAddr: CreateTenantAddrDto): Promise<TenantAddr> {
    const newTenantAddr = this.tenantAddrRepository.create(tenantAddr);
    await this.tenantAddrRepository.save(newTenantAddr);
    return newTenantAddr;
  }

  async findAll(): Promise<TenantAddr[]> {
    return this.tenantAddrRepository.find();
  }

  async findOne(id: number): Promise<TenantAddr> {
    return this.tenantAddrRepository.findOneOrFail(id);
  }

  async remove(id: number): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.tenantAddrRepository.delete(id);
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
