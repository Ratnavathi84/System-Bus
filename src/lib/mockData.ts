import { BusStop, BusRoute } from '../types';

export const VIZAG_STOPS: BusStop[] = [
  { id: 'rtc-complex', name: 'RTC Complex (Dwaraka)', lat: 17.7259, lng: 83.3039, city: 'Visakhapatnam' },
  { id: 'nad-junction', name: 'NAD Junction', lat: 17.7297, lng: 83.2396, city: 'Visakhapatnam' },
  { id: 'gajuwaka', name: 'Gajuwaka Junction', lat: 17.6888, lng: 83.2104, city: 'Visakhapatnam' },
  { id: 'anakapalle', name: 'Anakapalle RTC Complex', lat: 17.6913, lng: 83.0039, city: 'Visakhapatnam' },
  { id: 'rk-beach', name: 'RK Beach', lat: 17.7126, lng: 83.3330, city: 'Visakhapatnam' },
  { id: 'mvp-colony', name: 'MVP Colony', lat: 17.7447, lng: 83.3364, city: 'Visakhapatnam' },
  { id: 'madhurawada', name: 'Madhurawada', lat: 17.8184, lng: 83.3444, city: 'Visakhapatnam' },
  { id: 'gitam-university', name: 'GITAM University', lat: 17.7816, lng: 83.3769, city: 'Visakhapatnam' },
  { id: 'bheemunipatnam', name: 'Bheemunipatnam (Bheemili)', lat: 17.8894, lng: 83.4475, city: 'Visakhapatnam' },
  { id: 'pendurthi', name: 'Pendurthi', lat: 17.8080, lng: 83.2201, city: 'Visakhapatnam' },
  { id: 'vizianagaram', name: 'Vizianagaram RTC', lat: 18.1134, lng: 83.4079, city: 'Visakhapatnam' },
];

export const VIZAG_ROUTES: BusRoute[] = [
  {
    id: 'r1',
    number: '38',
    name: 'RTC Complex to Gajuwaka',
    stops: ['rtc-complex', 'nad-junction', 'gajuwaka'],
    color: '#00BFFF',
    city: 'Visakhapatnam'
  },
  {
    id: 'r2',
    number: '400',
    name: 'RTC Complex to Madhurawada',
    stops: ['rtc-complex', 'mvp-colony', 'madhurawada'],
    color: '#00FFFF',
    city: 'Visakhapatnam'
  },
  {
    id: 'r3',
    number: '222',
    name: 'Anakapalle to RTC Complex',
    stops: ['anakapalle', 'nad-junction', 'rtc-complex'],
    color: '#FFD700',
    city: 'Visakhapatnam'
  },
  {
    id: 'r4',
    number: '999',
    name: 'Beach Road Special',
    stops: ['rtc-complex', 'rk-beach', 'mvp-colony'],
    color: '#FF69B4',
    city: 'Visakhapatnam'
  },
  {
    id: 'r5',
    number: '111',
    name: 'Bheemili Express',
    stops: ['rtc-complex', 'madhurawada', 'gitam-university', 'bheemunipatnam'],
    color: '#ADFF2F',
    city: 'Visakhapatnam'
  },
];
