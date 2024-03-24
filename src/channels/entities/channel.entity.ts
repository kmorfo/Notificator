import { ApiProperty } from "@nestjs/swagger";

import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Application } from "src/applications/entities/application.entity";
import { Device } from "src/devices/entities/device.entity";
import { Message } from "src/messages/entities/message.entity";

@Entity('channels')
export class Channel {
    @ApiProperty({
        example: '02aff58c-95a2-4acd-ac3c-14f894247679',
        uniqueItems: true,
        description: 'Channel ID'
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Name of Channel',
        example: 'news',
        minLength: 1
    })
    @Column('text')
    name: string;

    @ApiProperty({
        description: 'Indicates if the channel is active in the application'
    })
    @Column('bool', { nullable: true })
    isActive?: boolean;

    @ManyToOne(
        () => Application,
        (application) => application.channels,
        { onDelete: 'CASCADE' }
    )
    application: Application

    @OneToMany(
        () => Message,
        (messages) => messages.channel,
        { onDelete: 'CASCADE' }
    )
    messages?: Message[]

    @ManyToMany(() => Device)
    devices?: Device[]
}
