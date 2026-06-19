/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BusStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  city: string;
}

export interface BusRoute {
  id: string;
  number: string;
  name: string;
  stops: string[]; // IDs of BusStop
  color: string;
  city: string;
}

export type BusStatus = 'on-time' | 'approaching' | 'delayed' | 'heavy-delay';
export type BusType = 'City' | 'Express' | 'Metro' | 'AC' | 'Electric';
export type OccupancyStatus = 'Low' | 'Medium' | 'High';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Bus {
  id: string;
  busNumber: string;
  routeId: string;
  type: BusType;
  status: BusStatus;
  occupancy: OccupancyStatus;
  driverName: string;
  capacity: number;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  nextStopId: string;
  eta: number; // minutes
  routePath?: LatLng[];
}

export interface JourneyStop {
  stopId: string;
  name: string;
  eta: number;
  distance: number;
}

export interface Journey {
  busId: string;
  routeId: string;
  busNumber: string;
  stops: JourneyStop[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
