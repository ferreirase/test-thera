import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @ApiProperty({ description: 'The unique identifier of the user' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The username of the user' })
  @Column({ unique: true })
  username: string;

  @ApiProperty({ description: 'The password of the user' })
  @Column()
  password: string;
}
