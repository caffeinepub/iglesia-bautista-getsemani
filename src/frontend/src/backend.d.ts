import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
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
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addDonation(memberId: bigint, amount: number, date: string): Promise<bigint>;
    addMember(name: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteDonation(id: bigint): Promise<boolean>;
    deleteMember(id: bigint): Promise<boolean>;
    getAllDonations(): Promise<Array<Donation>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDonationsByMember(memberId: bigint): Promise<Array<Donation>>;
    getMember(id: bigint): Promise<Member | null>;
    getMembers(): Promise<Array<Member>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateMember(id: bigint, name: string): Promise<boolean>;
}
