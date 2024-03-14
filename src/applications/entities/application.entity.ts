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
        description: 'ApplicationId',
        example: 'com.example.appname',
        minLength: 2
    })
    @Column('text')
    applicationId: string;

    @ApiProperty({
        description: 'App SHA',
        example: 'DA:39:A3:EE:5E:6B:4B:0D:32:55:BF:EF:95:60:18:90:AF:D8:07:09',
        minLength: 2
    })
    @Column('text')
    sha: string;

    @ApiProperty({
        description: 'Full name of application',
        example: 'CienciasOcultasApp',
        minLength: 2
    })
    @Column('text')
    name: string;
}
