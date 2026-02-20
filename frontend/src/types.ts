export type PlayerStatus = "online" | "standby" | "offline";

export interface Player {
  id: number;
  name: string;
  location: string;
  flag: string;
  timezone: string;
  status: PlayerStatus;
  game: string;
  ping: number | null;
  avatar: string;
}

export interface Game {
  id: number;
  title: string;
  genre: string;
  image: string;
  crossplay: boolean;
  lastPlayed: string;
  playersReady: number;
}