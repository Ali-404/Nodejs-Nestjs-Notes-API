import { IsNotEmpty, IsString } from "class-validator";

export class NotesDto{
    title?: string;
    
    @IsString()
    @IsNotEmpty()
    content: string;
}
