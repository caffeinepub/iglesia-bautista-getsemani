import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Iter "mo:core/Iter";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Migration "migration";

(with migration = Migration.run)
actor {
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

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Members
  let members = Map.empty<Nat, Member>();
  var nextMemberId = 1;

  public shared ({ caller }) func addMember(name : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add members");
    };
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

  public query ({ caller }) func getMembers() : async [Member] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can get members");
    };
    members.values().toArray();
  };

  public query ({ caller }) func getMember(id : Nat) : async ?Member {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update members");
    };
    members.get(id);
  };

  public shared ({ caller }) func updateMember(id : Nat, name : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update members");
    };
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

  public shared ({ caller }) func deleteMember(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete members");
    };
    if (not members.containsKey(id)) { return false };
    // Check donations for member
    let memberDonations = donations.filter(
      func(_, d) {
        d.memberId == id;
      }
    );
    if (memberDonations.size() > 0) {
      Runtime.trap("Cannot delete member, donations exist");
    };
    members.remove(id);
    true;
  };

  // Donations
  let donations = Map.empty<Nat, Donation>();
  var nextDonationId = 1;

  public shared ({ caller }) func addDonation(memberId : Nat, amount : Float, date : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add donations");
    };
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

  public shared ({ caller }) func deleteDonation(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete donations");
    };
    if (not donations.containsKey(id)) { return false };
    donations.remove(id);
    true;
  };

  public query ({ caller }) func getDonationsByMember(memberId : Nat) : async [Donation] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view donations");
    };
    donations.values().toArray().filter(func(d) { d.memberId == memberId });
  };

  public query ({ caller }) func getAllDonations() : async [Donation] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view donations");
    };
    donations.values().toArray();
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };
};
