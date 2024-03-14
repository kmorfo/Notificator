import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
    name: string;

    @ApiProperty({
        description: 'Body for the message',
        example: 'This is the body',
        minLength: 1
    })
    @Column( 'text')
    body: string;
}
