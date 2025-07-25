export type ROLE = "HOST" | "USER" //Definiamo la possibilità di due ruoli

//Nel Front Espongo Questo
export type User = {
    id:number
    email:string
    name: string
    role:ROLE
    //che richiamiamo dinamicamente qui
}

//Interno Espongo Questo
export type UserDb = User & {
    password: string
}