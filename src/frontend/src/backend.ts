/* eslint-disable */

// @ts-nocheck

import { Actor, HttpAgent, type HttpAgentOptions, type ActorConfig, type Agent, type ActorSubclass } from "@icp-sdk/core/agent";
import { idlFactory, type _SERVICE } from "./declarations/backend.did";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;

export class ExternalBlob {
    _blob?: Uint8Array<ArrayBuffer> | null;
    directURL: string;
    onProgress?: (percentage: number) => void = undefined;
    private constructor(directURL: string, blob: Uint8Array<ArrayBuffer> | null){
        if (blob) {
            this._blob = blob;
        }
        this.directURL = directURL;
    }
    static fromURL(url: string): ExternalBlob {
        return new ExternalBlob(url, null);
    }
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob {
        const url = URL.createObjectURL(new Blob([
            new Uint8Array(blob)
        ], {
            type: 'application/octet-stream'
        }));
        return new ExternalBlob(url, blob);
    }
    public async getBytes(): Promise<Uint8Array<ArrayBuffer>> {
        if (this._blob) {
            return this._blob;
        }
        const response = await fetch(this.directURL);
        const blob = await response.blob();
        this._blob = new Uint8Array(await blob.arrayBuffer());
        return this._blob;
    }
    public getDirectURL(): string {
        return this.directURL;
    }
    public withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob {
        this.onProgress = onProgress;
        return this;
    }
}
export interface Member {
    id: bigint;
    name: string;
    createdAt: bigint;
    notes: string;
}
export interface Donation {
    id: bigint;
    memberId: bigint;
    date: string;
    createdAt: bigint;
    amount: number;
}
export interface backendInterface {
    addDonation(memberId: bigint, amount: number, date: string): Promise<bigint>;
    addMember(name: string): Promise<bigint>;
    deleteDonation(id: bigint): Promise<boolean>;
    deleteMember(id: bigint): Promise<boolean>;
    getAllDonations(): Promise<Array<Donation>>;
    getDonationsByMember(memberId: bigint): Promise<Array<Donation>>;
    getMember(id: bigint): Promise<Member | null>;
    getMembers(): Promise<Array<Member>>;
    updateMember(id: bigint, name: string): Promise<boolean>;
}
export class Backend implements backendInterface {
    constructor(private actor: ActorSubclass<_SERVICE>, private _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>, private _downloadFile: (file: Uint8Array) => Promise<ExternalBlob>, private processError?: (error: unknown) => never){}
    async addDonation(arg0: bigint, arg1: number, arg2: string): Promise<bigint> {
        if (this.processError) {
            try {
                return await this.actor.addDonation(arg0, arg1, arg2);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        }
        return await this.actor.addDonation(arg0, arg1, arg2);
    }
    async addMember(arg0: string): Promise<bigint> {
        if (this.processError) {
            try {
                return await this.actor.addMember(arg0);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        }
        return await this.actor.addMember(arg0);
    }
    async deleteDonation(arg0: bigint): Promise<boolean> {
        if (this.processError) {
            try {
                return await this.actor.deleteDonation(arg0);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        }
        return await this.actor.deleteDonation(arg0);
    }
    async deleteMember(arg0: bigint): Promise<boolean> {
        if (this.processError) {
            try {
                return await this.actor.deleteMember(arg0);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        }
        return await this.actor.deleteMember(arg0);
    }
    async getAllDonations(): Promise<Array<Donation>> {
        if (this.processError) {
            try {
                return await this.actor.getAllDonations();
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        }
        return await this.actor.getAllDonations();
    }
    async getDonationsByMember(arg0: bigint): Promise<Array<Donation>> {
        if (this.processError) {
            try {
                return await this.actor.getDonationsByMember(arg0);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        }
        return await this.actor.getDonationsByMember(arg0);
    }
    async getMember(arg0: bigint): Promise<Member | null> {
        if (this.processError) {
            try {
                const result = await this.actor.getMember(arg0);
                return result.length === 0 ? null : result[0];
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        }
        const result = await this.actor.getMember(arg0);
        return result.length === 0 ? null : result[0];
    }
    async getMembers(): Promise<Array<Member>> {
        if (this.processError) {
            try {
                return await this.actor.getMembers();
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        }
        return await this.actor.getMembers();
    }
    async updateMember(arg0: bigint, arg1: string): Promise<boolean> {
        if (this.processError) {
            try {
                return await this.actor.updateMember(arg0, arg1);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        }
        return await this.actor.updateMember(arg0, arg1);
    }
}
export interface CreateActorOptions {
    agent?: Agent;
    agentOptions?: HttpAgentOptions;
    actorOptions?: ActorConfig;
    processError?: (error: unknown) => never;
}
export function createActor(canisterId: string, _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>, _downloadFile: (file: Uint8Array) => Promise<ExternalBlob>, options: CreateActorOptions = {}): Backend {
    const agent = options.agent || HttpAgent.createSync({
        ...options.agentOptions
    });
    if (options.agent && options.agentOptions) {
        console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
    }
    const actor = Actor.createActor<_SERVICE>(idlFactory, {
        agent,
        canisterId: canisterId,
        ...options.actorOptions
    });
    return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
