/* eslint-disable */

// @ts-nocheck

import type { ActorMethod } from '@icp-sdk/core/agent';
import type { IDL } from '@icp-sdk/core/candid';

export interface Donation {
  'id' : bigint,
  'memberId' : bigint,
  'date' : string,
  'createdAt' : bigint,
  'amount' : number,
}
export interface Member {
  'id' : bigint,
  'name' : string,
  'createdAt' : bigint,
  'notes' : string,
}
export interface _SERVICE {
  'addDonation' : ActorMethod<[bigint, number, string], bigint>,
  'addMember' : ActorMethod<[string], bigint>,
  'deleteDonation' : ActorMethod<[bigint], boolean>,
  'deleteMember' : ActorMethod<[bigint], boolean>,
  'getAllDonations' : ActorMethod<[], Array<Donation>>,
  'getDonationsByMember' : ActorMethod<[bigint], Array<Donation>>,
  'getMember' : ActorMethod<[bigint], [] | [Member]>,
  'getMembers' : ActorMethod<[], Array<Member>>,
  'updateMember' : ActorMethod<[bigint, string], boolean>,
}
export declare const idlService: IDL.ServiceClass;
export declare const idlInitArgs: IDL.Type[];
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
