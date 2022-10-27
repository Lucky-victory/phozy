export type RESPONSE_ERROR = {
    message: string | { value?: string; message?: string; param?: string }[];
};
export enum STORAGE_KEYS {
    TOKEN = 'token',
    TOKEN_EXPIRATION_TIME = 'token_expiration_time',
    TOKEN_EXPIRATION = 'token_expiration',
    USER = 'user',
}
