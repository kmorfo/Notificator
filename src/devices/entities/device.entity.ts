import { ApiProperty } from "@nestjs/swagger";
import { Application } from "src/applications/entities/application.entity";
import { Channel } from "src/channels/entities/channel.entity";
import { Message } from "src/messages/entities/message.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('devices')
export class Device {
    @ApiProperty({
        example: '02aff58c-95a2-4acd-ac3c-14f894247679',
        uniqueItems: true,
        description: 'Device ID'
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Device token for this App',
        example: 'g4e56s6vsdrb6e56',
        minLength: 2
    })
    @Column('text')
    token: string;

    @ApiProperty({
        description: 'App SHA',
        example: 'DA:39:A3:EE:5E:6B:4B:0D:32:55:BF:EF:95:60:18:90:AF:D8:07:09',
        minLength: 2
    })
    @Column('text')
    sha: string;

    @ApiProperty({
        description: 'ApplicationId',
        example: 'com.example.appname',
        minLength: 2
    })
    @Column('text')
    applicationId: string;

    @ApiProperty({
        description: 'Indicates if the device is active in the system'
    })
    @Column('bool', { default: true })
    isActive: boolean;

    @ManyToMany(() => Message)
    @JoinTable()
    messages?: Message[]

    @ManyToOne(
        () => Application,
        (application) => application.devices,
        { onDelete: 'CASCADE' }
    )
    application: Application

    @ManyToMany(() => Channel)
    @JoinTable()
    channels?: Channel[]
}
