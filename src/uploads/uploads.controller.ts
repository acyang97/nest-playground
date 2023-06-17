import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { S3Upload } from 'src/schemas/S3Upload.schema';
import { GetAllImagesResponse } from './uploads.interface';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFromReact(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
      }),
    )
    file: Express.Multer.File,
    @Body() data: { caption: string },
  ): Promise<S3Upload> {
    console.log('endpoint reached');
    console.log('caption', data.caption);
    console.log('file', file);
    return this.uploadsService.uploadSingleFile(file, data.caption);
  }

  @Get('all')
  async getAllImages(): Promise<GetAllImagesResponse> {
    return this.uploadsService.getAllImages();
  }

  @Get(':id')
  findOne(@Param('id') id: string): string {
    return `This action returns a #${id} cat`;
  }
}
