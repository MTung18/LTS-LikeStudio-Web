export class ClientSideSecret {
    public fslB2CFunctionAppCode: string;
}

export class AppSecrets {
    public clientSideSecret: ClientSideSecret;

    constructor(init?: Partial<AppSecrets>) {
        if (init) {
            Object.assign(this, init);
        }
    }
}