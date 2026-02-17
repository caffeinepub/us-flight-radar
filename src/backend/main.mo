import Blob "mo:core/Blob";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Aircraft tracking data
  var apiUrl : Text = "https://opensky-network.org/api/states/ALL";
  let trackHistoryStore = Map.empty<Text, [PositionData]>();

  public type PositionData = {
    lat : Float;
    long : Float;
    altitude : Float;
    timestamp : Int;
  };

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
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

  // Admin-only: Configure API endpoint
  public shared ({ caller }) func setApiUrl(url : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can configure API endpoints");
    };
    apiUrl := url;
  };

  // User-level: Read API configuration
  public query ({ caller }) func getApiUrl() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view API configuration");
    };
    apiUrl;
  };

  // Admin-only: Ingest aircraft data
  public shared ({ caller }) func processAircraftData(blobData : [Blob]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can process aircraft data");
    };
    for (pos in blobData.values()) {
      // Placeholder for parsing data and updating track history
    };
  };

  // User-level: Query track history for specific aircraft
  public query ({ caller }) func getTrackHistory(aircraftId : Text) : async ?[PositionData] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view track history");
    };
    trackHistoryStore.get(aircraftId);
  };

  // User-level: Query all track histories
  public query ({ caller }) func getAllTrackHistories() : async [(Text, [PositionData])] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view track histories");
    };
    Array.fromIter(trackHistoryStore.entries());
  };

  // Admin-only: Clear all tracking data
  public shared ({ caller }) func clearAllTrackHistories() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can clear track histories");
    };
    trackHistoryStore.clear();
  };
};
