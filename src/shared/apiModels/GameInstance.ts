export default interface GameInstance {
  roomName: string;
  type: string;
  map: string;
  camera: string;
  light: string;
  count: number;
  teams?: Array<{
    name: string;
    color: string;
    points: number;
    count: number;
  }>;
}
