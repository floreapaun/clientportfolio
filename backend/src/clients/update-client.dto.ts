import { IsString, IsNotEmpty} from 'class-validator';

export class UpdateClientDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  readonly link: string;

  @IsString()
  @IsNotEmpty()
  readonly status: string;
}
