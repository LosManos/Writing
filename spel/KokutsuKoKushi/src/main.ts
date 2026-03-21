import './styles/main.css';
import { engine } from './state';
import type { GameConfig } from './types';

import sampleGame from '../games/mystery/mystery.json';


function init() {
    console.log('Initializing Engine...');

    // Load the sample game
    engine.loadGame(sampleGame as GameConfig);

    // Subscribe to state changes to re-render
    engine.subscribe(() => {
        render();
    });

    render();
}

function render() {
    const room = engine.getCurrentRoom();
    const app = document.querySelector<HTMLDivElement>('#app');
    const isEditMode = engine.getIsEditMode();

    if (!app || !room) return;

    app.innerHTML = `
    <div class="game-container ${isEditMode ? 'edit-mode' : 'play-mode'}">
      <header>
        <div class="mode-toggle">
          <button id="toggle-play" class="${!isEditMode ? 'active' : ''}">Play</button>
          <button id="toggle-edit" class="${isEditMode ? 'active' : ''}">Edit</button>
        </div>
        <div class="header-actions">
          <button class="icon-btn" id="share-btn" title="Share Game">📤</button>
          <button class="icon-btn" id="config-btn" title="Game Config">⚙️</button>
        </div>
      </header>
      <main>
        ${room.image ? `<div class="room-image" style="background-image: url('${room.image}')"></div>` : ''}
        
        <div class="room-info">
          ${isEditMode
            ? `<input type="text" id="edit-room-name" value="${room.name}" class="edit-input">`
            : `<h1>${room.name}</h1>`}
          
          ${isEditMode
            ? `<textarea id="edit-room-desc" class="edit-textarea">${room.description}</textarea>`
            : `<p class="description">${room.description}</p>`}
        </div>

        <div class="interactions">
          <section class="exits">
            <h2>Exits ${isEditMode ? '<button class="add-btn" id="add-exit-btn">+</button>' : ''}</h2>
            ${room.exits.map((exit, idx) => {
                const available = !exit.conditions || exit.conditions.every(c => engine.checkCondition(c));
                return `
                <div class="btn-group">
                  <button 
                    class="exit-btn" 
                    ${available || isEditMode ? '' : 'disabled'} 
                    data-target="${exit.targetRoomId}"
                  >
                    ${exit.label} ${available ? '' : '🔒'}
                  </button>
                  ${isEditMode ? `<button class="edit-btn-small" data-type="exit" data-index="${idx}">✎</button>` : ''}
                </div>
              `;
            }).join('')}
          </section>

          <section class="actions">
            <h2>Actions ${isEditMode ? '<button class="add-btn" id="add-action-btn">+</button>' : ''}</h2>
            ${room.actions.map((action, index) => `
              <div class="btn-group">
                <button class="action-btn" data-index="${index}">
                  ${action.label}
                </button>
                ${isEditMode ? `<button class="edit-btn-small" data-type="action" data-index="${index}">✎</button>` : ''}
              </div>
            `).join('')}
          </section>
        </div>

        <div class="room-items-section">
          ${(room.items || []).length > 0 || isEditMode ? `<h2>Items ${isEditMode ? '<button class="add-btn" id="add-room-item-btn">+</button>' : ''}</h2>` : ''}
          <div class="room-items">
            ${(room.items || []).map((itemId, idx) => {
                const item = engine.getItem(itemId);
                if (!item) return '';
                return `
                <div class="btn-group">
                  <button class="item-pickup-btn" data-id="${itemId}">
                    📦 ${item.name}
                  </button>
                  ${isEditMode ? `<button class="edit-btn-small delete-room-item" data-index="${idx}">🗑️</button>` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </main>
      <footer>
        <div class="footer-nav">
          ${isEditMode
            ? `
              <button id="manage-rooms-btn">Manage Rooms</button>
              <button id="manage-items-btn">Item Manager</button>
            `
            : `
              <div class="inventory-indicator" id="open-inventory">
                <span>🎒 Inventory</span>
                <span class="inventory-count">${engine.getInventory().length}</span>
              </div>
            `}
        </div>
      </footer>
    </div>
    
    <!-- Modals (Config, etc.) same as before but added Room Manager -->
    <div id="modal-overlay" class="hidden">
      <!-- Content injected by modal handlers -->
    </div>
  `;

    // Mode Toggle Events
    app.querySelector('#toggle-play')?.addEventListener('click', () => engine.setEditMode(false));
    app.querySelector('#toggle-edit')?.addEventListener('click', () => engine.setEditMode(true));

    // Edit Room Events
    if (isEditMode) {
        app.querySelector('#edit-room-name')?.addEventListener('change', (e) => {
            engine.updateRoom(room.id, { name: (e.target as HTMLInputElement).value });
        });
        app.querySelector('#edit-room-desc')?.addEventListener('change', (e) => {
            engine.updateRoom(room.id, { description: (e.target as HTMLTextAreaElement).value });
        });
    }

    // Config & Share Events
    app.querySelector('#share-btn')?.addEventListener('click', async () => {
        const config = engine.getConfig();
        if (!config) return;
        const text = JSON.stringify(config, null, 2);
        if (navigator.share) {
            try { await navigator.share({ title: config.metadata.title, text: text }); } catch (err) { }
        } else {
            navigator.clipboard.writeText(text);
            alert('Config copied to clipboard');
        }
    });

    app.querySelector('#config-btn')?.addEventListener('click', () => showModal('config'));
    app.querySelector('#manage-rooms-btn')?.addEventListener('click', () => showModal('room-manager'));
    app.querySelector('#manage-items-btn')?.addEventListener('click', () => showModal('item-manager'));
    app.querySelector('#open-inventory')?.addEventListener('click', () => showModal('inventory'));

    // Add Exit/Action
    if (isEditMode) {
        app.querySelector('#add-exit-btn')?.addEventListener('click', () => {
            const currentRoom = engine.getCurrentRoom();
            if (currentRoom) {
                currentRoom.exits.push({ label: "New Exit", targetRoomId: room.id });
                engine.updateRoom(room.id, { exits: currentRoom.exits });
            }
        });
        app.querySelector('#add-action-btn')?.addEventListener('click', () => {
            const currentRoom = engine.getCurrentRoom();
            if (currentRoom) {
                currentRoom.actions.push({ label: "New Action", effects: [] });
                engine.updateRoom(room.id, { actions: currentRoom.actions });
            }
        });

        app.querySelectorAll('.edit-btn-small').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLButtonElement;
                const type = target.dataset.type as 'exit' | 'action';
                const index = parseInt(target.dataset.index || '0');
                showModal(type === 'exit' ? 'edit-exit' : 'edit-action', index);
            });
        });
    }

    // Exit/Action interaction
    app.querySelectorAll('.exit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (isEditMode) return;
            const target = (e.currentTarget as HTMLButtonElement).dataset.target;
            if (target) engine.applyEffect({ type: 'move_player', value: target });
        });
    });

    app.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (isEditMode) return;
            const index = parseInt((e.currentTarget as HTMLButtonElement).dataset.index || '0');
            const action = room.actions[index];
            if (action) engine.performAction(action.effects, action.conditions);
        });
    });

    // Room Item interaction
    app.querySelectorAll('.item-pickup-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (isEditMode) return;
            const id = (e.currentTarget as HTMLButtonElement).dataset.id;
            if (id) engine.pickUpItem(id);
        });
    });

    if (isEditMode) {
        app.querySelector('#add-room-item-btn')?.addEventListener('click', () => showModal('add-room-item'));
        app.querySelectorAll('.delete-room-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt((e.currentTarget as HTMLButtonElement).dataset.index || '0');
                const items = room.items || [];
                items.splice(index, 1);
                engine.updateRoom(room.id, { items });
            });
        });
    }
}

// Modal helper setup
function showModal(type: 'config' | 'room-manager' | 'item-manager' | 'edit-item' | 'edit-exit' | 'edit-action' | 'inventory' | 'add-room-item', index?: number, itemId?: string) {
    const overlay = document.querySelector('#modal-overlay') as HTMLDivElement;
    const config = engine.getConfig();
    const room = engine.getCurrentRoom();
    if (!overlay || !config || !room) return;

    overlay.classList.remove('hidden');

    if (type === 'config') {
        overlay.innerHTML = `
        <div class="modal">
          <h2>Game Configuration</h2>
          <textarea id="config-text" placeholder="Paste game JSON here...">${JSON.stringify(config, null, 2)}</textarea>
          <div class="modal-actions">
            <button id="import-btn">Import & Play</button>
            <button id="copy-btn">Copy Current JSON</button>
            <button id="close-btn">Close</button>
          </div>
        </div>
      `;
        overlay.querySelector('#close-btn')?.addEventListener('click', () => overlay.classList.add('hidden'));
        overlay.querySelector('#copy-btn')?.addEventListener('click', () => {
            navigator.clipboard.writeText((overlay.querySelector('#config-text') as HTMLTextAreaElement).value);
            alert('Copied!');
        });
        overlay.querySelector('#import-btn')?.addEventListener('click', () => {
            try {
                engine.loadGame(JSON.parse((overlay.querySelector('#config-text') as HTMLTextAreaElement).value));
                overlay.classList.add('hidden');
            } catch (e) { alert('Invalid JSON'); }
        });
    }

    if (type === 'room-manager') {
        const rooms = Object.values(config.rooms);
        overlay.innerHTML = `
            <div class="modal">
                <h2>Manage Rooms</h2>
                <div class="room-list" style="max-height: 200px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem;">
                    ${rooms.map(r => `
                        <div class="room-item">
                            <span>${r.name} (${r.id})</span>
                            <div class="room-item-actions">
                                <button class="small-btn go-to-room" data-id="${r.id}">Go</button>
                                ${r.id !== room.id ? `<button class="small-btn delete-room" data-id="${r.id}">🗑️</button>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="modal-actions">
                    <input type="text" id="new-room-id" placeholder="new_room_id" class="edit-input" style="font-size: 0.8rem;">
                    <button id="add-room-btn">Add New Room</button>
                    <button id="close-modal">Close</button>
                </div>
            </div>
        `;
        overlay.querySelector('#close-modal')?.addEventListener('click', () => overlay.classList.add('hidden'));
        overlay.querySelector('#add-room-btn')?.addEventListener('click', () => {
            const id = (overlay.querySelector('#new-room-id') as HTMLInputElement).value;
            if (id && !config.rooms[id]) {
                engine.addRoom(id, "New Room");
                showModal('room-manager');
            } else { alert('Invalid or duplicate ID'); }
        });
        overlay.querySelectorAll('.go-to-room').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = (e.currentTarget as HTMLButtonElement).dataset.id;
                if (id) {
                    engine.applyEffect({ type: 'move_player', value: id });
                    overlay.classList.add('hidden');
                }
            });
        });
        overlay.querySelectorAll('.delete-room').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = (e.currentTarget as HTMLButtonElement).dataset.id;
                if (id) { engine.deleteRoom(id); showModal('room-manager'); }
            });
        });
    }

    if (type === 'edit-exit' && index !== undefined) {
        const exit = room.exits[index];
        const renderConditions = () => {
            const conditions = exit.conditions || [];
            return `
                <label>Conditions (all must be met)</label>
                <div class="logic-list" id="exit-conditions-list">
                    ${conditions.map((c, i) => `
                        <div class="logic-item" data-index="${i}">
                            <button class="remove-logic-btn" data-type="condition" data-index="${i}">×</button>
                            <div class="logic-item-row">
                                <select class="logic-type" data-type="condition" data-index="${i}">
                                    <option value="has_item" ${c.type === 'has_item' ? 'selected' : ''}>Has Item</option>
                                    <option value="var_equals" ${c.type === 'var_equals' ? 'selected' : ''}>Variable Equals</option>
                                </select>
                            </div>
                            <div class="logic-item-row">
                                <input type="text" class="logic-key" placeholder="Key/Item ID" value="${c.key}" data-type="condition" data-index="${i}">
                                <input type="text" class="logic-value" placeholder="Value" value="${c.value}" data-type="condition" data-index="${i}">
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button class="add-logic-btn" id="add-exit-condition">Add Condition</button>
            `;
        };

        const updateModal = () => {
            overlay.innerHTML = `
                <div class="modal">
                    <h2>Edit Exit</h2>
                    <label>Label</label>
                    <input type="text" id="exit-label" value="${exit.label}" class="edit-input">
                    <label>Target Room</label>
                    <select id="exit-target" class="edit-input">
                        ${Object.keys(config.rooms).map(id => `<option value="${id}" ${id === exit.targetRoomId ? 'selected' : ''}>${id}</option>`).join('')}
                    </select>
                    ${renderConditions()}
                    <div class="modal-actions">
                        <button id="save-exit">Save</button>
                        <button id="delete-exit" style="background: #ff4d4d">Delete Exit</button>
                        <button id="close-modal">Cancel</button>
                    </div>
                </div>
            `;
            attachListeners();
        };

        const attachListeners = () => {
            overlay.querySelector('#close-modal')?.addEventListener('click', () => overlay.classList.add('hidden'));
            overlay.querySelector('#save-exit')?.addEventListener('click', () => {
                exit.label = (overlay.querySelector('#exit-label') as HTMLInputElement).value;
                exit.targetRoomId = (overlay.querySelector('#exit-target') as HTMLSelectElement).value;
                engine.updateRoom(room.id, { exits: room.exits });
                overlay.classList.add('hidden');
            });
            overlay.querySelector('#delete-exit')?.addEventListener('click', () => {
                room.exits.splice(index, 1);
                engine.updateRoom(room.id, { exits: room.exits });
                overlay.classList.add('hidden');
            });
            overlay.querySelector('#add-exit-condition')?.addEventListener('click', () => {
                exit.conditions = exit.conditions || [];
                exit.conditions.push({ type: 'has_item', key: '', value: '' });
                updateModal();
            });
            overlay.querySelectorAll('.remove-logic-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt((e.currentTarget as HTMLButtonElement).dataset.index || '0');
                    exit.conditions?.splice(idx, 1);
                    updateModal();
                });
            });
            overlay.querySelectorAll('.logic-type, .logic-key, .logic-value').forEach(input => {
                input.addEventListener('change', (e) => {
                    const target = e.currentTarget as HTMLInputElement | HTMLSelectElement;
                    const idx = parseInt(target.dataset.index || '0');
                    const field = target.classList.contains('logic-type') ? 'type' : (target.classList.contains('logic-key') ? 'key' : 'value');
                    if (exit.conditions) {
                        (exit.conditions[idx] as any)[field] = target.value;
                    }
                });
            });
        };
        updateModal();
    }

    if (type === 'edit-action' && index !== undefined) {
        const action = room.actions[index];

        // Migrate legacy set_var effects
        action.effects.forEach(e => {
            if (e.type === 'set_var' && typeof e.value === 'object' && e.value !== null) {
                const legacyValue = e.value as any;
                e.key = legacyValue.key || '';
                e.value = legacyValue.value || '';
            }
        });

        const renderLogic = (label: string, items: any[], typeName: 'condition' | 'effect') => {
            return `
                <label>${label}</label>
                <div class="logic-list">
                    ${items.map((item, i) => {
                let displayKey = (item as any).key || '';
                let displayValue = item.value || '';

                // Handle legacy object-based value for set_var
                if (item.type === 'set_var' && typeof item.value === 'object' && item.value !== null) {
                    displayKey = item.value.key || '';
                    displayValue = item.value.value || '';
                }

                return `
                        <div class="logic-item" data-index="${i}">
                            <button class="remove-logic-btn" data-type="${typeName}" data-index="${i}">×</button>
                            <div class="logic-item-row">
                                <select class="logic-type" data-type="${typeName}" data-index="${i}">
                                    ${typeName === 'condition' ? `
                                        <option value="has_item" ${item.type === 'has_item' ? 'selected' : ''}>Has Item</option>
                                        <option value="var_equals" ${item.type === 'var_equals' ? 'selected' : ''}>Variable Equals</option>
                                    ` : `
                                        <option value="move_player" ${item.type === 'move_player' ? 'selected' : ''}>Move Player</option>
                                        <option value="set_var" ${item.type === 'set_var' ? 'selected' : ''}>Set Variable</option>
                                        <option value="add_to_inventory" ${item.type === 'add_to_inventory' ? 'selected' : ''}>Add to Inventory</option>
                                        <option value="remove_from_inventory" ${item.type === 'remove_from_inventory' ? 'selected' : ''}>Remove from Inventory</option>
                                        <option value="play_sound" ${item.type === 'play_sound' ? 'selected' : ''}>Play Sound</option>
                                    `}
                                </select>
                            </div>
                            <div class="logic-item-row">
                                <input type="text" class="logic-key" placeholder="${typeName === 'condition' ? 'Key (Item ID or Var Name)' : 'Key (Variable Name)'}" value="${displayKey}" data-type="${typeName}" data-index="${i}" 
                                    ${typeName === 'effect' && (item.type === 'move_player' || item.type === 'play_sound' || item.type === 'add_to_inventory' || item.type === 'remove_from_inventory') ? 'style="display:none"' : ''}>
                                
                                ${typeName === 'effect' && item.type === 'move_player' ? `
                                    <select class="logic-value" data-type="${typeName}" data-index="${i}">
                                        ${Object.keys(config.rooms).map(id => `<option value="${id}" ${id === displayValue ? 'selected' : ''}>${id}</option>`).join('')}
                                    </select>
                                ` : `
                                    <input type="text" class="logic-value" placeholder="Value" value="${displayValue}" data-type="${typeName}" data-index="${i}" 
                                        ${typeName === 'condition' && item.type === 'has_item' ? 'style="display:none"' : ''}>
                                `}
                            </div>
                        </div>
                    `;
            }).join('')}
                </div>
                <button class="add-logic-btn" data-type="${typeName}">Add ${typeName}</button>
            `;
        };

        const updateModal = () => {
            overlay.innerHTML = `
                <div class="modal">
                    <h2>Edit Action</h2>
                    <label>Label</label>
                    <input type="text" id="action-label" value="${action.label}" class="edit-input">
                    ${renderLogic('Conditions (all must be met)', action.conditions || [], 'condition')}
                    ${renderLogic('Effects (run in order)', action.effects || [], 'effect')}
                    <div class="modal-actions">
                        <button id="save-action">Save</button>
                        <button id="delete-action" style="background: #ff4d4d">Delete Action</button>
                        <button id="close-modal">Cancel</button>
                    </div>
                </div>
            `;
            attachListeners();
        };

        const attachListeners = () => {
            overlay.querySelector('#close-modal')?.addEventListener('click', () => overlay.classList.add('hidden'));
            overlay.querySelector('#save-action')?.addEventListener('click', () => {
                action.label = (overlay.querySelector('#action-label') as HTMLInputElement).value;
                engine.updateRoom(room.id, { actions: room.actions });
                overlay.classList.add('hidden');
            });
            overlay.querySelector('#delete-action')?.addEventListener('click', () => {
                room.actions.splice(index, 1);
                engine.updateRoom(room.id, { actions: room.actions });
                overlay.classList.add('hidden');
            });
            overlay.querySelectorAll('.add-logic-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const typeName = (e.currentTarget as HTMLButtonElement).dataset.type;
                    if (typeName === 'condition') {
                        action.conditions = action.conditions || [];
                        action.conditions.push({ type: 'has_item', key: '', value: '' });
                    } else {
                        action.effects.push({ type: 'move_player', value: '' });
                    }
                    updateModal();
                });
            });
            overlay.querySelectorAll('.remove-logic-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const target = e.currentTarget as HTMLButtonElement;
                    const typeName = target.dataset.type;
                    const idx = parseInt(target.dataset.index || '0');
                    if (typeName === 'condition') action.conditions?.splice(idx, 1);
                    else action.effects.splice(idx, 1);
                    updateModal();
                });
            });
            overlay.querySelectorAll('.logic-type, .logic-key, .logic-value').forEach(input => {
                input.addEventListener('change', (e) => {
                    const target = e.currentTarget as HTMLInputElement | HTMLSelectElement;
                    const typeName = target.dataset.type;
                    const idx = parseInt(target.dataset.index || '0');
                    const field = target.classList.contains('logic-type') ? 'type' : (target.classList.contains('logic-key') ? 'key' : 'value');
                    const items = typeName === 'condition' ? action.conditions : action.effects;
                    if (items) {
                        (items[idx] as any)[field] = target.value;
                        if (field === 'type') updateModal(); // Redraw if type changed (for effect selects)
                    }
                });
            });
        };
        updateModal();
    }

    if (type === 'item-manager') {
        const items = Object.values(config.items);
        overlay.innerHTML = `
            <div class="modal">
                <h2>Item Manager</h2>
                <div class="manager-list">
                    ${items.map(item => `
                        <div class="manager-item">
                            <div class="manager-item-info">
                                <span class="manager-item-name">${item.name}</span>
                                <span class="manager-item-id">(${item.id})</span>
                            </div>
                            <div class="room-item-actions">
                                <button class="small-btn edit-item" data-id="${item.id}">✎</button>
                                <button class="small-btn delete-item" data-id="${item.id}">🗑️</button>
                            </div>
                        </div>
                    `).join('')}
                    ${items.length === 0 ? '<p style="color: var(--text-dim); text-align: center;">No items created yet.</p>' : ''}
                </div>
                <div class="modal-actions">
                    <input type="text" id="new-item-id" placeholder="item_id" class="edit-input" style="font-size: 0.8rem;">
                    <button id="add-item-btn">Add New Item</button>
                    <button id="close-modal">Close</button>
                </div>
            </div>
        `;
        overlay.querySelector('#close-modal')?.addEventListener('click', () => overlay.classList.add('hidden'));
        overlay.querySelector('#add-item-btn')?.addEventListener('click', () => {
            const id = (overlay.querySelector('#new-item-id') as HTMLInputElement).value;
            if (id && !config.items[id]) {
                engine.addItem(id, "New Item");
                showModal('item-manager');
            } else { alert('Invalid or duplicate ID'); }
        });
        overlay.querySelectorAll('.edit-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = (e.currentTarget as HTMLButtonElement).dataset.id;
                if (id) showModal('edit-item', undefined, id);
            });
        });
        overlay.querySelectorAll('.delete-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = (e.currentTarget as HTMLButtonElement).dataset.id;
                if (id && confirm(`Delete item "${id}"?`)) {
                    engine.deleteItem(id);
                    showModal('item-manager');
                }
            });
        });
    }

    if (type === 'edit-item' && itemId) {
        const item = config.items[itemId];
        overlay.innerHTML = `
            <div class="modal">
                <h2>Edit Item: ${itemId}</h2>
                <label>Name</label>
                <input type="text" id="item-name" value="${item.name}" class="edit-input">
                <label>Description</label>
                <textarea id="item-desc" class="edit-textarea">${item.description}</textarea>
                <div class="modal-actions">
                    <button id="save-item">Save</button>
                    <button id="close-modal">Cancel</button>
                </div>
            </div>
        `;
        overlay.querySelector('#close-modal')?.addEventListener('click', () => showModal('item-manager'));
        overlay.querySelector('#save-item')?.addEventListener('click', () => {
            const name = (overlay.querySelector('#item-name') as HTMLInputElement).value;
            const description = (overlay.querySelector('#item-desc') as HTMLTextAreaElement).value;
            engine.updateItem(itemId, { name, description });
            showModal('item-manager');
        });
    }

    if (type === 'inventory') {
        const inventory = engine.getInventory();
        overlay.innerHTML = `
            <div class="modal">
                <h2>Inventory</h2>
                <div class="item-grid">
                    ${inventory.map((item, idx) => `
                        <div class="item-card" data-index="${idx}">
                            <span class="item-icon">📦</span>
                            <span class="item-name">${item.name}</span>
                        </div>
                    `).join('')}
                    ${inventory.length === 0 ? '<p style="color: var(--text-dim); text-align: center; grid-column: 1/-1;">Your inventory is empty.</p>' : ''}
                </div>
                <div id="item-details-container" class="hidden" style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--glass-border);">
                    <!-- Detailed item info -->
                </div>
                <div class="modal-actions">
                    <button id="close-modal">Close</button>
                </div>
            </div>
        `;
        overlay.querySelector('#close-modal')?.addEventListener('click', () => overlay.classList.add('hidden'));
        overlay.querySelectorAll('.item-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const idx = parseInt((e.currentTarget as HTMLElement).dataset.index || '0');
                const item = inventory[idx];
                const detailContainer = overlay.querySelector('#item-details-container') as HTMLDivElement;
                detailContainer.classList.remove('hidden');
                detailContainer.innerHTML = `
                    <div class="item-details">
                        <h3 style="margin: 0 0 0.5rem 0;">${item.name}</h3>
                        <p class="item-details-desc" style="color: var(--text-dim); font-size: 0.9rem; line-height: 1.4;">${item.description}</p>
                    </div>
                `;
            });
        });
    }

    if (type === 'add-room-item') {
        const items = Object.values(config.items);
        overlay.innerHTML = `
            <div class="modal">
                <h2>Add Item to Room</h2>
                <div class="manager-list">
                    ${items.map(item => `
                        <div class="manager-item">
                            <div class="manager-item-info">
                                <span>${item.name}</span>
                                <span class="manager-item-id">(${item.id})</span>
                            </div>
                            <button class="small-btn add-to-room" data-id="${item.id}">Add</button>
                        </div>
                    `).join('')}
                    ${items.length === 0 ? '<p style="color: var(--text-dim); text-align: center;">No items in config. Create some in Item Manager first.</p>' : ''}
                </div>
                <div class="modal-actions">
                    <button id="close-modal">Cancel</button>
                </div>
            </div>
        `;
        overlay.querySelector('#close-modal')?.addEventListener('click', () => overlay.classList.add('hidden'));
        overlay.querySelectorAll('.add-to-room').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = (e.currentTarget as HTMLButtonElement).dataset.id;
                if (id) {
                    const roomItems = room.items || [];
                    roomItems.push(id);
                    engine.updateRoom(room.id, { items: roomItems });
                    overlay.classList.add('hidden');
                }
            });
        });
    }
}

init();
