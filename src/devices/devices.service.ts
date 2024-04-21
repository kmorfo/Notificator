import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ApplicationsService } from 'src/applications/applications.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { Device } from './entities/device.entity';
import { ErrorHandlingService } from 'src/common/error-handling/error-handling.service';
import { isUUID } from 'class-validator';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { ChannelsService } from 'src/channels/channels.service';
import { DeviceChannelDto } from './dto/device-channel.dto';

@Injectable()
export class DevicesService {
  private readonly logger = new Logger('DevicesService');

  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    private readonly applicationsService: ApplicationsService,
    private readonly channelsService: ChannelsService,
    private readonly errorHandlingService: ErrorHandlingService,
  ) { }

  async create(createDeviceDto: CreateDeviceDto): Promise<Device | undefined> {
    try {
      const application = await this.applicationsService.findOneByAppId(createDeviceDto.applicationId);
      const defaultChannel = await this.channelsService.findOneByNameApp("default", createDeviceDto.applicationId);

      let device = await this.deviceRepository.create(createDeviceDto);

      device.channels = [defaultChannel];
      device.application = application;
      device = await this.deviceRepository.save(device);

      device.channels = []
      device.application = null

      return device;
    } catch (error) {
      this.errorHandlingService.handleDBExceptions(error);
    }
  }

  async findOne(term: string) {
    const condition = isUUID(term) ? { id: term } : { token: term };

    let device: Device = await this.deviceRepository.findOne({
      where: condition,
      relations: { application: true, channels: true },
      select: { application: { applicationId: true } }
    })

    if (!device) throw new NotFoundException(`Device with ${term} not found`);

    const applicationID = device.application?.applicationId
    // device.application = null
    return { device, applicationID };
  }

  async _findOneById(id: string): Promise<Device | undefined> {
    let device: Device = await this.deviceRepository.findOne({ where: { id: id } })

    if (!device) throw new NotFoundException(`Device with ${id} not found`);

    return device;
  }

  async getAllDeviceTokenBy(channel, applicationId): Promise<string[] | undefined> {
    const deviceTokens = await this.deviceRepository
      .createQueryBuilder('devices')
      .select(['devices.token'])
      .innerJoin('devices.application', 'application')
      .innerJoin('devices.channels', 'channel')
      .where('application.applicationId = :applicationId', { applicationId: applicationId })
      .andWhere('channel.name = :channel', { channel })
      .andWhere('devices.isActive = true')
      .getMany();

    return deviceTokens.map(device => device.token);
  }

  async update(token: string, updateDeviceDto: UpdateDeviceDto): Promise<Device | undefined> {
    try {
      const { device, applicationID } = await this.findOne(token);
      const deviceToUpdate = { ...device, ...updateDeviceDto };

      // Check for changes to device settings
      const isDataChanged = Object.keys(updateDeviceDto).some(key => deviceToUpdate[key] !== device[key]);

      if (isDataChanged) await this.deviceRepository.save(deviceToUpdate);

      return (await this.findOne(token)).device;
    } catch (error) {
      this.errorHandlingService.handleDBExceptions(error);
    }
  }

  async subscribe(token: string, deviceChannelDto: DeviceChannelDto): Promise<Device | undefined> {
    const { device, applicationID } = await this.findOne(token);

    const channelToAdd = await this.channelsService.findOneByNameApp(deviceChannelDto.channel, applicationID);

    if (channelToAdd == null)
      throw new NotFoundException(`Channel ${deviceChannelDto.channel} not found on ${applicationID}`)

    //Check if the channel already exist in the device 
    const isChannelAlreadySubscribed = device.channels.some(channel => channel.id === channelToAdd.id);

    if (isChannelAlreadySubscribed) return device

    try {
      await this.deviceRepository
        .createQueryBuilder()
        .relation(Device, "channels")
        .of(device)
        .add(channelToAdd);

      return (await this.findOne(token)).device;
    } catch (error) {
      this.errorHandlingService.handleDBExceptions(error);
    }
  }

  async unSubscribe(token: string, deviceChannelDto: DeviceChannelDto): Promise<Device | undefined> {
    if (deviceChannelDto.channel == "default") throw new UnauthorizedException("You can not unsubscribe from default channel")
    const { device, applicationID } = await this.findOne(token);

    const channelToRemove = await this.channelsService.findOneByNameApp(deviceChannelDto.channel, applicationID);

    if (channelToRemove == null)
      throw new NotFoundException(`Channel ${deviceChannelDto.channel} not found on ${applicationID}`)

    try {
      await this.deviceRepository
        .createQueryBuilder()
        .relation(Device, "channels")
        .of(device)
        .remove(channelToRemove);

      return (await this.findOne(token)).device;
    } catch (error) {
      this.errorHandlingService.handleDBExceptions(error);
    }
  }

  async remove(id: string): Promise<string | undefined> {
    //I dont delete the device, only set isActive to false
    const device = await this._findOneById(id);
    device.isActive = false;
    this.deviceRepository.save(device);
    return `Device with id ${id} was disabled`;
  }
}
