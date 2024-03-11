
import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @ApiProperty({
        example: '02aff58c-95a2-4acd-ac3c-14f894247679',
        uniqueItems: true,
        description: 'User ID'
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'test@test.es',
        uniqueItems: true,
        description: 'Email account'
    })
    @Column('text', { unique: true })
    email: string;

    @ApiProperty({
        description: 'Account password. The password must have a Uppercase, lowercase letter and a number',
        minLength: 6,
        maxLength: 50
    })
    //Set select false so that the password is not returned when doing a find if it is not manually specified
    @Column('text', { select: false })
    password: string;

    @ApiProperty({
        description: 'Full name of user',
        example: 'Pedro Garcia',
        minLength: 1
    })
    @Column('text')
    fullName: string;

    @ApiProperty({
        description: 'Indicates if the user is active in the system'
    })
    @Column('bool', { default: true })
    isActive: boolean;

    @ApiProperty({ enum: ['ADMIN', 'USER'] })
    @Column('text', { array: true, default: ['user'] })
    roles: string[];
}