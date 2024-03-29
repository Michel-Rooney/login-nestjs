import {
	Controller,
	Get,
	Post,
	Req,
	Res,
	UploadedFile,
	UseGuards,
	UseInterceptors,
	Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/authentication/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaService } from 'src/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Controller('users')
export class UsersController {
	constructor(
		private readonly userService: UsersService,
		private readonly prisma: PrismaService,
	) { }

	@Get()
	@UseGuards(JwtAuthGuard)
	async getAllUsers(
		@Req() request: Request,
		@Res() response: Response,
	): Promise<any> {
		try {
			const result = await this.userService.getAllUser();
			return response.status(200).json({
				status: 'Ok!',
				message: 'Successfully fetch data!',
				result: result,
			});
		} catch (err) {
			return response.status(500).json({
				status: 'Ok!',
				message: 'Internal Server Error!',
			});
		}
	}

	@Post('upload')
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(@UploadedFile() file: Express.Multer.File) {
		const pathUpload = `./uploads/${file.originalname}`;

		const savedFile = await this.prisma.image.create({
			data: {
				image: pathUpload,
			},
		});
		fs.writeFileSync(pathUpload, file.buffer);
		return savedFile;
	}

	@Get(':imageName')
	async getImage(@Res() res: Response, @Param('imageName') imageName: string) {
		try {
			const imagePath = path.join(__dirname, '../..', 'uploads', imageName);
			console.log(imagePath);
			const imageStream = fs.createReadStream(imagePath);

			res.setHeader('Content-Type', 'image/png');
			imageStream.pipe(res);
		} catch (error) {
			res.status(404).send('Imagem não encontrada');
		}
	}
}
