export type Side = 'A' | 'B' | 'C'

export enum SideRole {
  Attack = 'A',
  Defense = 'D',
  Floater = 'F',
  Leader = 'L',
}

export enum ArrowType {
  Attack = 'atk',
  Defense = 'def',
  Floater = 'flo',
  Enemy = 'foe',
  Movement = 'mv',
  Bidirectional = 'bi',
}

export interface GuideStep {
  text: string
  highlights?: string[]
  mapMarkers?: Array<[nodeKey: string, label: string, role?: SideRole]>
  arrows?: Array<[fromNode: string, toNode: string, type: ArrowType]>
  roleMarkers?: Array<[nodeKey: string, role: SideRole]>
  chips?: string[]
  mapFocus?: string[]
  side?: Side
  showRegion?: boolean
}

export type GuideSection = [string, GuideStep[]]
