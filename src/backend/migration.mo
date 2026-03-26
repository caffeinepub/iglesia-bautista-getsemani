import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
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

  type UserProfile = {
    name : Text;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    members : Map.Map<Nat, Member>;
    nextMemberId : Nat;
    donations : Map.Map<Nat, Donation>;
    nextDonationId : Nat;
  };

  public func run(old : NewActor) : NewActor {
    old;
  };
};
