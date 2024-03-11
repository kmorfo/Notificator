import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
        description: 'Package of application',
        example: 'com.example.CienciasOcultasApp',
        minLength: 2
    })
    @Column('text')
    package: string;

    @ApiProperty({
        description: 'Full name of application',
        example: 'CienciasOcultasApp',
        minLength: 2
    })
    @Column('text')
    name: string;

    @ApiProperty({
        description: 'Full name of application',
        example: 'CienciasOcultasApp',
        minLength: 2
    })
    @Column('text')
    token: string;

}
