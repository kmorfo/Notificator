import { ApiProperty } from "@nestjs/swagger";
import { Application } from "src/applications/entities/application.entity";
import { Channel } from "src/channels/entities/channel.entity";
import { Device } from "src/devices/entities/device.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('messages')
export class Message {
    @ApiProperty({
        example: '02aff58c-95a2-4acd-ac3c-14f894247679',
        uniqueItems: true,
        description: 'Device ID'
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Title for the message',
        example: 'This is the title',
        minLength: 1
    })
    @Column('text')
    title: string;

    @ApiProperty({
        description: 'Body for the message',
        example: 'This is the body',
        minLength: 1
    })
    @Column('text')
    body: string;

    @ApiProperty({
        description: 'Autocreated date'
    })
    @CreateDateColumn()
    created_at: Date;

    @ManyToMany(() => Device)
    devices?: Device[]

    @ManyToOne(
        () => Application,
        (application) => application.messages,
        { onDelete: 'CASCADE' }
    )
    application: Application

    @ManyToOne(
        () => Channel,
        (channel) => channel.messages,
        { onDelete: 'CASCADE' }
    )
    channel: Channel

    @ManyToOne(
        () => User,
        (user) => user.messages,
        { onDelete: 'CASCADE' }
    )
    user: User


}
