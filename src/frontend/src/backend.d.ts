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
