import { ApiProperty } from "@nestjs/swagger";
import { Application } from "src/applications/entities/application.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('projects')
export class Project {
    @ApiProperty({
        example: '02aff58c-95a2-4acd-ac3c-14f894247679',
        uniqueItems: true,
        description: 'Project ID'
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Name of Firebase Project',
        example: 'firebaseProject',
        minLength: 1
    })
    @Column('text')
    name: string;

    @OneToMany(
        () => Application,
        (application) => application.project,
        { onDelete: 'CASCADE' }
    )
    applications?: Application[]

}
