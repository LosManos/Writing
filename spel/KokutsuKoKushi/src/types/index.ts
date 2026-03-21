export interface GameMetadata {
  title: string;
  author: string;
  version: string;
  description?: string;
}

export interface GameState {
  currentRoomId: string;
  inventory: string[];
  vars: Record<string, any>;
}

export interface Condition {
  type: 'has_item' | 'var_equals' | 'var_gt' | 'var_lt';
  key: string;
  value: any;
}

export interface Effect {
  type: 'move_player' | 'add_to_inventory' | 'remove_from_inventory' | 'set_var' | 'play_sound';
  key?: string;
  value: any;
}

export interface Action {
  label: string;
  conditions?: Condition[];
  effects: Effect[];
}

export interface Exit {
  label: string;
  targetRoomId: string;
  conditions?: Condition[];
}

export interface Room {
  id: string;
  name: string;
  description: string;
  image?: string;
  exits: Exit[];
  actions: Action[];
  items?: string[];
}

export interface Item {
  id: string;
  name: string;
  description: string;
  icon?: string;
  actions: Action[];
}

export interface GameConfig {
  metadata: GameMetadata;
  initialState: GameState;
  rooms: Record<string, Room>;
  items: Record<string, Item>;
}
