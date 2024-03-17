import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Channel } from "src/channels/entities/channel.entity";
import { Device } from "src/devices/entities/device.entity";
import { Message } from "src/messages/entities/message.entity";
import { Project } from "src/projects/entities/project.entity";
import { User } from "src/users/entities/user.entity";


@Entity('applications')
export class Application {
    @ApiProperty({
        example: '02aff58c-95a2-4acd-ac3c-14f894247679',
        uniqueItems: true,
        description: 'Company ID'
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'ApplicationId',
        example: 'com.example.appname',
        minLength: 2,
        uniqueItems: true
    })
    @Column('text', { unique: true })
    applicationId: string;

    @ApiProperty({
        description: 'App SHA',
        example: 'DA:39:A3:EE:5E:6B:4B:0D:32:55:BF:EF:95:60:18:90:AF:D8:07:09',
        minLength: 2
    })
    @Column('text', { array: true, default: [] })
    validSHA: string[];

    @ApiProperty({
        description: 'Full name of application',
        example: 'CienciasOcultasApp',
        minLength: 2
    })
    @Column('text')
    name: string;

    @ApiProperty({
        description: 'Indicates if the application is active in the system'
    })
    @Column('bool', { default: true })
    isActive: boolean;

    @OneToMany(
        () => Channel,
        (channel) => channel.application,
        { onDelete: 'CASCADE' }
    )
    channels?: Channel[]

    @ManyToMany(() => Message)
    @JoinTable()
    messages?: Message[]

    @ManyToOne(
        () => Project,
        (project) => project.applications,
        { onDelete: 'CASCADE' }
    )
    project: Project

    @OneToMany(
        () => Device,
        (device) => device.application,
        { onDelete: 'CASCADE' }
    )
    devices?: Device[]

    @ManyToMany(() => User)
    @JoinTable()
    users: User[]
}
