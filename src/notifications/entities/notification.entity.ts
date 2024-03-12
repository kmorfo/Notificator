import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('notifications')
export class Notification {
    @ApiProperty({
        example: '02aff58c-95a2-4acd-ac3c-14f894247679',
        uniqueItems: true,
        description: 'Notification ID'
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Notification title',
        example: 'Title',
        minLength: 2
    })
    @Column({ type: 'text', nullable: false })
    title: string;

    @ApiProperty({
        description: 'Notification body',
        example: 'This is de body of the notification',
        minLength: 2
    })
    @Column({ type: 'longtext', nullable: false })
    body: string;

    
}
