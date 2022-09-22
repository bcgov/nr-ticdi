import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateTicdijsonDto } from "./dto/create-ticdijson.dto";
import { Ticdijson } from "./entities/ticdijson.entity";

@Injectable()
export class TicdijsonService {
  constructor(
    @InjectRepository(Ticdijson)
    private ticdijsonRepository: Repository<Ticdijson>
  ) {}

  async create(user: CreateTicdijsonDto): Promise<Ticdijson> {
    const newUser = this.ticdijsonRepository.create(user);
    await this.ticdijsonRepository.save(newUser);
    return newUser;
  }

  async findAll(): Promise<Ticdijson[]> {
    return this.ticdijsonRepository.find();
  }

  async findOne(id: number): Promise<Ticdijson> {
    return this.ticdijsonRepository.findOneOrFail(id);
  }

  async remove(id: number): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.ticdijsonRepository.delete(id);
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
