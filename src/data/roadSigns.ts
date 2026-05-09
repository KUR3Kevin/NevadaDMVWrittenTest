export type SignType =
  | 'stop' | 'yield' | 'warning' | 'construction' | 'speed-limit'
  | 'regulatory' | 'guide' | 'services' | 'recreation'
  | 'no-uturn' | 'railroad' | 'school' | 'hov'

export type RoadSign = {
  id: string
  name: string
  type: SignType
  colorLabel: string
  shapeLabel: string
  meaning: string
  tip: string
}

export const ROAD_SIGNS: RoadSign[] = [
  { id: 'stop', name: 'Stop', type: 'stop', colorLabel: 'Red', shapeLabel: 'Octagon', meaning: 'Come to a complete stop. Proceed when safe.', tip: 'The ONLY octagon on U.S. roads.' },
  { id: 'yield', name: 'Yield', type: 'yield', colorLabel: 'Red & White', shapeLabel: 'Inverted Triangle', meaning: 'Slow down, give way to cross traffic. Stop if you cannot merge safely.', tip: 'Yield ≠ ignore. Stop if needed.' },
  { id: 'warning', name: 'Warning (Generic)', type: 'warning', colorLabel: 'Yellow', shapeLabel: 'Diamond', meaning: 'Hazard or change in road ahead. Slow down and be alert.', tip: 'Yellow diamond = something ahead to watch for.' },
  { id: 'construction', name: 'Construction Zone', type: 'construction', colorLabel: 'Orange', shapeLabel: 'Diamond', meaning: 'Work zone ahead. Fines doubled for violations.', tip: 'Orange = same shape as yellow warning, but construction context.' },
  { id: 'speed-limit', name: 'Speed Limit', type: 'speed-limit', colorLabel: 'White', shapeLabel: 'Rectangle', meaning: 'Maximum legal speed under ideal conditions.', tip: 'White rectangle = regulatory rule you must follow.' },
  { id: 'regulatory', name: 'Regulatory (Generic)', type: 'regulatory', colorLabel: 'White', shapeLabel: 'Rectangle', meaning: 'Rules you must obey: turn restrictions, lane use, one-way.', tip: 'White = must obey. Green = informational.' },
  { id: 'guide', name: 'Guide / Destination', type: 'guide', colorLabel: 'Green', shapeLabel: 'Rectangle', meaning: 'Directions, distances, exits. Informational.', tip: 'Green = guidance. No action required.' },
  { id: 'services', name: 'Motorist Services', type: 'services', colorLabel: 'Blue', shapeLabel: 'Rectangle', meaning: 'Gas, food, lodging, hospital ahead.', tip: 'Blue = services for drivers.' },
  { id: 'recreation', name: 'Recreation / Cultural', type: 'recreation', colorLabel: 'Brown', shapeLabel: 'Rectangle', meaning: 'Parks, campgrounds, historic sites, recreation areas.', tip: 'Brown = points of interest.' },
  { id: 'no-uturn', name: 'No U-Turn', type: 'no-uturn', colorLabel: 'White & Red', shapeLabel: 'Circle with slash', meaning: 'U-turns are prohibited at this location.', tip: 'Also illegal on hills <500ft visibility, curves, fire stations, railroads.' },
  { id: 'railroad', name: 'Railroad Crossing', type: 'railroad', colorLabel: 'Yellow & Black', shapeLabel: 'Round', meaning: 'Railroad crossing ahead. Expect trains.', tip: 'Round yellow sign with RR = advance warning. Stop at the gate.' },
  { id: 'school', name: 'School Zone', type: 'school', colorLabel: 'Yellow-Green', shapeLabel: 'Pentagon', meaning: 'School zone or crosswalk. Reduced speed limit.', tip: 'Pentagon shape is unique to school and pedestrian signs.' },
  { id: 'hov', name: 'HOV / Diamond Lane', type: 'hov', colorLabel: 'White on Black', shapeLabel: 'Diamond', meaning: 'High-Occupancy Vehicle lane. 3+ persons required in Nevada.', tip: 'Nevada requires 3+ occupants (some states use 2 — Nevada is 3).' },
]
