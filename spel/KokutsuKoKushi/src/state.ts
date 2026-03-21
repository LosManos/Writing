import type { GameConfig, GameState, Condition, Effect, Room, Item } from './types';

export class EngineState {
    private config: GameConfig | null = null;
    private state: GameState | null = null;
    private isEditMode: boolean = false;
    private subscribers: (() => void)[] = [];

    loadGame(config: GameConfig) {
        this.config = config;
        this.state = JSON.parse(JSON.stringify(config.initialState)); // Deep copy initial state
        this.notify();
    }

    getConfig() {
        return this.config;
    }

    getIsEditMode() {
        return this.isEditMode;
    }

    setEditMode(enabled: boolean) {
        this.isEditMode = enabled;
        this.notify();
    }

    updateRoom(roomId: string, data: Partial<Room>) {
        if (!this.config) return;
        this.config.rooms[roomId] = { ...this.config.rooms[roomId], ...data };
        this.notify();
    }

    addRoom(id: string, name: string) {
        if (!this.config) return;
        this.config.rooms[id] = {
            id,
            name,
            description: "A new empty room.",
            exits: [],
            actions: []
        };
        this.notify();
    }

    deleteRoom(id: string) {
        if (!this.config || id === this.state?.currentRoomId) return;
        delete this.config.rooms[id];
        // Also remove exits pointing to this room
        Object.values(this.config.rooms).forEach(room => {
            room.exits = room.exits.filter(exit => exit.targetRoomId !== id);
        });
        this.notify();
    }

    getCurrentRoom() {
        if (!this.config || !this.state) return null;
        return this.config.rooms[this.state.currentRoomId] || null;
    }

    updateItem(itemId: string, data: Partial<Item>) {
        if (!this.config || !this.config.items[itemId]) return;
        this.config.items[itemId] = { ...this.config.items[itemId], ...data };
        this.notify();
    }

    addItem(id: string, name: string) {
        if (!this.config) return;
        this.config.items[id] = {
            id,
            name,
            description: "A new item.",
            actions: []
        };
        this.notify();
    }

    deleteItem(id: string) {
        if (!this.config) return;
        delete this.config.items[id];
        // Remove from inventory if present
        if (this.state) {
            this.state.inventory = this.state.inventory.filter(itemId => itemId !== id);
        }
        this.notify();
    }

    getInventory() {
        return (this.state?.inventory || []).map(id => this.getItem(id)).filter(item => !!item) as Item[];
    }

    getItem(id: string) {
        return this.config?.items[id] || null;
    }

    getVars() {
        return this.state?.vars || {};
    }

    subscribe(callback: () => void) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(s => s !== callback);
        };
    }

    private notify() {
        this.subscribers.forEach(s => s());
    }

    checkCondition(condition: Condition): boolean {
        if (!this.state) return false;

        const currentVal = this.state.vars[condition.key];
        let targetVal = condition.value;

        // Normalize targetVal if it's a string "true"/"false"
        if (targetVal === 'true') targetVal = true;
        if (targetVal === 'false') targetVal = false;
        if (typeof targetVal === 'string' && targetVal !== '' && !isNaN(Number(targetVal))) {
            targetVal = Number(targetVal);
        }

        switch (condition.type) {
            case 'has_item':
                return this.state.inventory.includes(condition.key);
            case 'var_equals':
                // Use loose equality to handle string vs boolean/number from UI
                return currentVal == targetVal;
            case 'var_gt':
                return Number(currentVal) > Number(targetVal);
            case 'var_lt':
                return Number(currentVal) < Number(targetVal);
            default:
                return false;
        }
    }

    applyEffect(effect: Effect) {
        if (!this.state) return;

        switch (effect.type) {
            case 'move_player':
                this.state.currentRoomId = effect.value;
                break;
            case 'add_to_inventory':
                if (!this.state.inventory.includes(effect.value)) {
                    this.state.inventory.push(effect.value);
                }
                break;
            case 'remove_from_inventory':
                this.state.inventory = this.state.inventory.filter(id => id !== effect.value);
                break;
            case 'set_var':
                let key = effect.key;
                let val = effect.value;

                // Handle legacy format where key/value were inside value object
                if (!key && typeof val === 'object' && val !== null && 'key' in val) {
                    key = val.key;
                    val = val.value;
                }

                if (key) {
                    // Try to convert string "true"/"false" to actual booleans
                    if (val === 'true') val = true;
                    if (val === 'false') val = false;
                    // Try to convert numeric strings to numbers
                    if (typeof val === 'string' && val !== '' && !isNaN(Number(val))) {
                        val = Number(val);
                    }
                    this.state.vars[key] = val;
                }
                break;
            case 'play_sound':
                console.log('Playing sound:', effect.value);
                // Sound implementation will go here
                break;
        }
        this.notify();
    }

    performAction(effects: Effect[], conditions?: Condition[]) {
        if (conditions && !conditions.every(c => this.checkCondition(c))) {
            return false;
        }
        effects.forEach(e => this.applyEffect(e));
        return true;
    }

    pickUpItem(itemId: string) {
        if (!this.state || !this.config) return;
        const room = this.getCurrentRoom();
        if (!room || !room.items || !room.items.includes(itemId)) return;

        // Add to inventory
        this.applyEffect({ type: 'add_to_inventory', value: itemId });

        // Remove from room
        room.items = room.items.filter(id => id !== itemId);
        this.notify();
    }
}

export const engine = new EngineState();
