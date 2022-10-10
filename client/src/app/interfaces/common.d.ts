export interface IResponseResult{
    message: string;
    data?:unknown[]|unknown
}
export interface IResponseError{
    message: string | { value?: string,message?:string,param?:string }[];

}