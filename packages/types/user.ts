export type ROLE = "HOST" | "USER" //Definiamo la possibilità di due ruoli

export interface User {
    id:number
    email:string
    name?: string
    role:ROLE
    //che richiamiamo dinamicamente qui
}