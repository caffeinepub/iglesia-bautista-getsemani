/* eslint-disable */

// @ts-nocheck

import { IDL } from '@icp-sdk/core/candid';

export const Donation = IDL.Record({
  'id' : IDL.Nat,
  'memberId' : IDL.Nat,
  'date' : IDL.Text,
  'createdAt' : IDL.Int,
  'amount' : IDL.Float64,
});
export const Member = IDL.Record({
  'id' : IDL.Nat,
  'name' : IDL.Text,
  'createdAt' : IDL.Int,
  'notes' : IDL.Text,
});

export const idlService = IDL.Service({
  'addDonation' : IDL.Func([IDL.Nat, IDL.Float64, IDL.Text], [IDL.Nat], []),
  'addMember' : IDL.Func([IDL.Text], [IDL.Nat], []),
  'deleteDonation' : IDL.Func([IDL.Nat], [IDL.Bool], []),
  'deleteMember' : IDL.Func([IDL.Nat], [IDL.Bool], []),
  'getAllDonations' : IDL.Func([], [IDL.Vec(Donation)], ['query']),
  'getDonationsByMember' : IDL.Func([IDL.Nat], [IDL.Vec(Donation)], ['query']),
  'getMember' : IDL.Func([IDL.Nat], [IDL.Opt(Member)], ['query']),
  'getMembers' : IDL.Func([], [IDL.Vec(Member)], ['query']),
  'updateMember' : IDL.Func([IDL.Nat, IDL.Text], [IDL.Bool], []),
});

export const idlInitArgs = [];

export const idlFactory = ({ IDL }) => {
  const Donation = IDL.Record({
    'id' : IDL.Nat,
    'memberId' : IDL.Nat,
    'date' : IDL.Text,
    'createdAt' : IDL.Int,
    'amount' : IDL.Float64,
  });
  const Member = IDL.Record({
    'id' : IDL.Nat,
    'name' : IDL.Text,
    'createdAt' : IDL.Int,
    'notes' : IDL.Text,
  });
  
  return IDL.Service({
    'addDonation' : IDL.Func([IDL.Nat, IDL.Float64, IDL.Text], [IDL.Nat], []),
    'addMember' : IDL.Func([IDL.Text], [IDL.Nat], []),
    'deleteDonation' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'deleteMember' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'getAllDonations' : IDL.Func([], [IDL.Vec(Donation)], ['query']),
    'getDonationsByMember' : IDL.Func([IDL.Nat], [IDL.Vec(Donation)], ['query']),
    'getMember' : IDL.Func([IDL.Nat], [IDL.Opt(Member)], ['query']),
    'getMembers' : IDL.Func([], [IDL.Vec(Member)], ['query']),
    'updateMember' : IDL.Func([IDL.Nat, IDL.Text], [IDL.Bool], []),
  });
};

export const init = ({ IDL }) => { return []; };
