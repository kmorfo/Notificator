import { ApiProperty } from "@nestjs/swagger";
import { Application } from "src/applications/entities/application.entity";
import { Device } from "src/devices/entities/device.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('Channels')
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

    @ManyToOne(
        () => Application,
        (application) => application.channels,
        { onDelete: 'CASCADE' }
    )
    application: Application

    @ManyToMany(() => Device)
    devices?: Device[]
}
