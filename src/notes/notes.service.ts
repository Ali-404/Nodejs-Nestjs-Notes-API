import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class NotesService {

    constructor(private readonly _prismaService: PrismaService){}

    async getNotes() {
        return await this._prismaService.note.findMany();
    }

    async getNoteById(id: number){
        try {
            return await this._prismaService.note.findUniqueOrThrow({where: {id}})
        }catch(e){
            if (e instanceof PrismaClientKnownRequestError)
                if (e.code == "P2025")
                    throw new ForbiddenException(`there is no notes with id ${id} !`)
            throw e
        }
    }

    async addNote(content: string ,title?: string ){
        return await this._prismaService.note.create({
            data: {title, content}
        })
    }

    async removeNote(id: number){
        // remove by id
        return await this._prismaService.note.delete({where: {id}})
    }


    async updateNoteTitle(id: number, newTitle?: string|undefined){
        console.log(newTitle)
        return await this._prismaService.note.update({where: {id},data: {
            title: newTitle ?? null,
        }})
    }

    async updateNoteContent(id: number, newContent: string){
        return await this._prismaService.note.update({where: {id}, data: {content: newContent}})
    }
}