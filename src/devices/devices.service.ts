import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ApplicationsService } from 'src/applications/applications.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { Device } from './entities/device.entity';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { User } from 'src/users/entities/user.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class DevicesService {
  private readonly logger = new Logger('DevicesService');

  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    private readonly applicationsService: ApplicationsService
  ) { }

  async create(createDeviceDto: CreateDeviceDto): Promise<Device | undefined> {
    try {
      const application = await this.applicationsService.findOneByAppId(createDeviceDto.applicationId);
      let device = await this.deviceRepository.create(createDeviceDto);

      device.application = application;
      device = await this.deviceRepository.save(device);
      device.application = null

      return device;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  // findAll() {
  //   return `This action returns all devices`;
  // }

  async findOne(term: string) {
    let device: Device;

    if (isUUID(term))
      device = await this.deviceRepository.findOne({ where: { id: term } })
    else
      device = await this.deviceRepository.findOne({ where: { token: term } })

    if (!device) throw new NotFoundException(`Application with ${term} not found`);

    const applicationID = device.application?.applicationId
    device.application = null
    return { device, applicationID };
  }

  async _findOneById(id: string): Promise<Device | undefined> {
    let device: Device = await this.deviceRepository.findOne({ where: { id: id } })

    if (!device) throw new NotFoundException(`Application with ${id} not found`);

    return device;
  }

  async update(id: string, updateDeviceDto: UpdateDeviceDto): Promise<Device | undefined> {
    const device = await this._findOneById(id);
    try {
      await this.deviceRepository
        .createQueryBuilder()
        .update(device)
        .set({ ...updateDeviceDto })
        .where({ id: id })
        .execute();

      //Returned application with new data 
      const updatedDevice = await this._findOneById(id);
      updatedDevice.application = null
      return updatedDevice;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string): Promise<string | undefined> {
    //I dont delete the device, only set isActive to false
    const device = await this._findOneById(id);
    device.isActive = false;
    this.deviceRepository.save(device);
    return `Device with id ${id} was disabled`;
  }

  private handleDBExceptions(error: any): never {
    console.log(error);
    this.logger.error(error);
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
