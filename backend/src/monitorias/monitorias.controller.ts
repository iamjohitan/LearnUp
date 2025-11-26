import { Controller, Post, Body, Param, Get, Req, UseGuards } from '@nestjs/common';
import { MonitoriasService } from './monitorias.service';
import { CreateMonitoriaDto } from './dto/create-monitoria.dto';
import { UpdateMonitoriaDto } from './dto/update-monitoria.dto';
import { group } from 'console';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('monitorias')
export class MonitoriasController {
    constructor(private readonly monitoriasService: MonitoriasService){}

    @Post(':groupId/create')
    @UseGuards(AuthGuard)
    create(
        @Param('groupId') groupId: string,
        @Body() dto: CreateMonitoriaDto,
        @Req() req
    ){
        return this.monitoriasService.create(groupId, dto, req.user.id)
    }

    @Get(':groupId')
    list(@Param('groupId') groupId: string){
        return this.monitoriasService.list(groupId)
    }

    @Post(':groupId/chat/send')
    @UseGuards(AuthGuard)
    send(
        @Param('groupId') groupId: string,
        @Body('message') message: string,
        @Req() req
    ){
        return this.monitoriasService.sendMessage(groupId, req.user.id, message)
    }

    @Get(':groupId/chat')
    getChat(@Param('groupId') groupId: string){
        return this.monitoriasService.listMessages(groupId)
    }

    @Post(':groupId/:monitoriaId/update')
    @UseGuards(AuthGuard)
    update(
        @Param('groupId') groupId: string,
        @Param('monitoriaId') monitoriaId: string,
        @Body() dto: UpdateMonitoriaDto,
        @Req() req  
    ){
        return this.monitoriasService.update(groupId, monitoriaId, dto, req.user.id)
    }

    @Post('groupId/:monitoriaId/delete')
    @UseGuards(AuthGuard)
    delete(
        @Param('groupId') groupId: string,
        @Param('monitoriaId') monitoriaId: string,
        @Req() req  
    ){
        return this.monitoriasService.delete(groupId, monitoriaId, req.user.id)
    }

    @Get(':groupId/log')
    logs(@Param('groupId') groupId: string){
        return this.monitoriasService.getLogs(groupId)
    }



}
    