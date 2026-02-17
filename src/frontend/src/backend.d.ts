import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PositionData {
    lat: number;
    long: number;
    altitude: number;
    timestamp: bigint;
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
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearAllTrackHistories(): Promise<void>;
    getAllTrackHistories(): Promise<Array<[string, Array<PositionData>]>>;
    getApiUrl(): Promise<string>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getTrackHistory(aircraftId: string): Promise<Array<PositionData> | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    processAircraftData(blobData: Array<Uint8Array>): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setApiUrl(url: string): Promise<void>;
}
