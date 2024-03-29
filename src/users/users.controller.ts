import { Controller, Get, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UsersService } from "./users.service";
import { Request, Response } from 'express'
import { JwtAuthGuard } from "src/authentication/auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { PrismaService } from "src/prisma.service";
import * as fs from 'fs'

@Controller('users')
export class UsersController {
	constructor(private readonly userService: UsersService, private readonly prisma: PrismaService) { }

	@Get()
	@UseGuards(JwtAuthGuard)
	async getAllUsers(@Req() request: Request, @Res() response: Response): Promise<any> {
		try {
			const result = await this.userService.getAllUser();
			return response.status(200).json({
				status: 'Ok!',
				message: 'Successfully fetch data!',
				result: result
			})
		} catch (err) {
			return response.status(500).json({
				status: 'Ok!',
				message: 'Internal Server Error!'
			})
		}
	}

	@Post('upload')
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(@UploadedFile() file: Express.Multer.File) {
		console.log(file);
		const savedFile = await this.prisma.image.create({
			data: {
				image: file.originalname,
			}
		})
		fs.writeFileSync(`./uploads/${file.originalname}`, file.buffer)
		console.log(savedFile);
		return savedFile
	}
}
