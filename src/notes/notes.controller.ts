import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post } from "@nestjs/common";
import { NotesService } from "./notes.service";
import { NotesDto } from "./notes.dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";




@Controller()
export class NotesController{

    constructor(private readonly _notesProvider: NotesService){}

    @Get()
    async index(){
        return await this._notesProvider.getNotes();
    }

    @Post("/add")
    async add(@Body() body: NotesDto){
        return await this._notesProvider.addNote(body.content, body.title)
        
    }

    @Delete("/delete/:id")
    async delete(@Param("id") id:string){
        try {
            return  await this._notesProvider.removeNote(Number(id))
        }catch(e) {
            if (e instanceof PrismaClientKnownRequestError ){
                if (e.code == "P2025")
                    throw new ForbiddenException("Record not found !")
            }
            throw e; 
        }
        
    }
   

    @Patch("/update_title/:id")
    async updateTitle(@Param("id") id: string, @Body("title") newTitle?:string  ){
        return await this._notesProvider.updateNoteTitle(Number(id), newTitle )
    }

    @Patch("/update/:id")
    async update(@Param("id") id: string, @Body("content") newContent:string  ){
        if (!newContent){
            throw new ForbiddenException("content is required !")
        }
        return await this._notesProvider.updateNoteContent(Number(id), newContent )
    }

}