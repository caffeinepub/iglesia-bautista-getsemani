import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Iter "mo:core/Iter";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

persistent actor {
  type Member = {
    id : Nat;
    name : Text;
    notes : Text;
    createdAt : Int;
  };

  type Donation = {
    id : Nat;
    memberId : Nat;
    amount : Float;
    date : Text;
    createdAt : Int;
  };

  public type UserProfile = {
    name : Text;
  };

  // Keep authorization state for upgrade compatibility
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Members
  let members = Map.empty<Nat, Member>();
  var nextMemberId = 1;

  public shared func addMember(name : Text) : async Nat {
    let id = nextMemberId;
    let member : Member = {
      id;
      name;
      notes = "";
      createdAt = Time.now();
    };
    members.add(id, member);
    nextMemberId += 1;
    id;
  };

  public query func getMembers() : async [Member] {
    members.values().toArray();
  };

  public query func getMember(id : Nat) : async ?Member {
    members.get(id);
  };

  public shared func updateMember(id : Nat, name : Text) : async Bool {
    switch (members.get(id)) {
      case (null) { false };
      case (?existing) {
        let updated : Member = {
          existing with
          name;
        };
        members.add(id, updated);
        true;
      };
    };
  };

  public shared func deleteMember(id : Nat) : async Bool {
    if (not members.containsKey(id)) { return false };
    let memberDonations = donations.filter(
      func(_, d) {
        d.memberId == id;
      }
    );
    if (memberDonations.size() > 0) {
      return false;
    };
    members.remove(id);
    true;
  };

  // Donations
  let donations = Map.empty<Nat, Donation>();
  var nextDonationId = 1;

  public shared func addDonation(memberId : Nat, amount : Float, date : Text) : async Nat {
    let id = nextDonationId;
    nextDonationId += 1;
    let donation : Donation = {
      id;
      memberId;
      amount;
      date;
      createdAt = Time.now();
    };
    donations.add(id, donation);
    id;
  };

  public shared func deleteDonation(id : Nat) : async Bool {
    if (not donations.containsKey(id)) { return false };
    donations.remove(id);
    true;
  };

  public query func getDonationsByMember(memberId : Nat) : async [Donation] {
    donations.values().toArray().filter(func(d) { d.memberId == memberId });
  };

  public query func getAllDonations() : async [Donation] {
    donations.values().toArray();
  };

  public query func getUserProfile(user : Principal) : async ?UserProfile {
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };
};
