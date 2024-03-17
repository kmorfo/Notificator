import { ApiProperty } from "@nestjs/swagger";
import { Application } from "src/applications/entities/application.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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
        minLength: 1,
        uniqueItems: true
    })
    @Column('text', { unique: true })
    name: string;

    @ApiProperty({
        description: 'Indicates if the project is active in the system'
    })
    @Column('bool', { default: true })
    isActive: boolean;

    @OneToMany(
        () => Application,
        (application) => application.project,
        { onDelete: 'CASCADE' }
    )
    applications?: Application[]

    @ManyToOne(
        () => User,
        (user) => user.projects,
        { onDelete: 'CASCADE' }
    )
    user: User
}
