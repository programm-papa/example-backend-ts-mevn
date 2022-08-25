export interface Config  {
 readonly secret: string,
 readonly secretSpecial: string,
 readonly database: string,
}
export const config: Config = {
    secret: '***',
    secretSpecial: '***',
    database: 'mongodb+srv://***'
}