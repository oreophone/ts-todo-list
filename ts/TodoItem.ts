export type priority = 'none' | 'low' | 'high'
export type colourRGB = [number, number, number]
export type siteTheme = {
    base: colourRGB,
    primary: colourRGB,
    secondary: colourRGB,
    action: colourRGB,
    warning: colourRGB,
    danger: colourRGB,
}

// TODO import svg's from file (or don't)
export const buttonSVGs = {
    time: '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/></svg>',
    low: '<svg class="icon" viewBox="0 0 5 16" xmlns="http://www.w3.org/2000/svg"><circle cx="2.5" cy="14.5" r="1.5" stroke="none"/><path d="M1.04957 1.54527L1.77684 9.54527C1.80026 9.80281 2.01619 10 2.27479 10H2.98393C3.24833 10 3.46702 9.79416 3.48302 9.53025L3.96786 1.53025C3.98529 1.24274 3.75682 1 3.46878 1H1.54752C1.2535 1 1.02295 1.25246 1.04957 1.54527Z" stroke-linecap="round"/></svg>',
    high: '<svg class="icon" width="11" height="16" viewBox="0 0 11 16" xmlns="http://www.w3.org/2000/svg"><circle cx="2.5" cy="14.5" r="1.5" stroke="none"/><path d="M1.04957 1.54527L1.77684 9.54527C1.80026 9.80281 2.01619 10 2.27479 10H2.98393C3.24833 10 3.46702 9.79416 3.48302 9.53025L3.96786 1.53025C3.98529 1.24274 3.75682 1 3.46878 1H1.54752C1.2535 1 1.02295 1.25246 1.04957 1.54527Z" stroke-linecap="round"/><circle cx="8.5" cy="14.5" r="1.5" stroke="none"/><path d="M7.04957 1.54527L7.77684 9.54527C7.80026 9.80281 8.01619 10 8.27479 10H8.98393C9.24833 10 9.46702 9.79416 9.48302 9.53025L9.96786 1.53025C9.98529 1.24274 9.75682 1 9.46878 1H7.54752C7.2535 1 7.02295 1.25246 7.04957 1.54527Z" stroke-linecap="round"/></svg>',
    trash: '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>',
    check: '<svg class="icon" viewBox="0 0 19 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.37648 13.725L0.274927 7.62349C-0.0916425 7.25692 -0.0916425 6.66256 0.274927 6.29596L1.60242 4.96843C1.96899 4.60182 2.56338 4.60182 2.92995 4.96843L7.04025 9.07869L15.844 0.274927C16.2106 -0.0916425 16.805 -0.0916425 17.1716 0.274927L18.4991 1.60246C18.8656 1.96903 18.8656 2.56338 18.4991 2.92998L7.70401 13.7251C7.3374 14.0916 6.74305 14.0916 6.37648 13.725Z"/></svg>'
}

export class TodoItem {
    title: string;
    description: string | null;
    priority: priority;
    isCompleted: boolean;
    private id: number;
    
    

    constructor (
        title: string,
        description: string | null,
        priority: priority = 'none',
        isCompleted: boolean = false,
        id: number
    ) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.isCompleted = isCompleted;
        this.id = id
    }
    
    // Setters
    set_title(title: string): void {
        this.title = title
    }

    set_description(description: string): void {
        this.description = description
    }

    set_priority(priority: priority): void {
        this.priority = priority
    }

    set_isCompleted(isCompleted: boolean): void {
        this.isCompleted = isCompleted
    }

    get_id(): number {
        return this.id
    }

    toggleCheck(): void {
        this.isCompleted = !this.isCompleted
    }
    
    // partial function to give selected children onfocus
    private focusEvent(): (_: Event) => void {
        return (_: Event) => {
            let itemDiv = document.getElementById(`todo-item-holder-${this.id}`)!;
            itemDiv.classList.add("todo-item-holder-focused");
            (<HTMLElement>itemDiv.getElementsByClassName("todo-item-title")[0])
            .tabIndex = 0;
            (<HTMLElement>itemDiv.getElementsByClassName("todo-item-desc")[0])
            .tabIndex = 0;
        }
    }
    // partial function to give selected children onunfocus
    private unfocusEvent(): (_: Event) => void {
        return (_: Event) => {
            let itemDiv = document.getElementById(`todo-item-holder-${this.id}`);
            // runs after dom fully updates focus
            setTimeout(() => {
                if (!itemDiv!.contains(document.activeElement)) {
                    itemDiv!.classList.remove("todo-item-holder-focused");
                }
            },0)
            
        }
    }
    // Builds the side buttons div
    private makeButtonsDiv(theme?: siteTheme): HTMLDivElement {
        // <div class="todo-item-priority-holder" id="todo-item-priority-holder-..."
        var buttonDiv = <HTMLDivElement>document.createElement("div");
        Object.assign(buttonDiv, 
            {className: "todo-item-priority-holder",
            id:`todo-item-priority-holder-${this.id}`,
            onfocus: this.focusEvent(),
            onclick: this.focusEvent(),
            }
        )
        // <button class="todo-item-priority-...">
        // TODO figure out way to iterate thru. priority type
        var buttons = ['high','low','time'].map(prty => {
            var curButton = document.createElement("button");
            let curSVG: string = buttonSVGs[<'time' | 'low' | 'high'>prty];
            let curClass = this.priority == prty ?
                `todo-item-priority-button-${prty} todo-item-priority-button todo-item-priority-button-selected` :
                `todo-item-priority-button-${prty} todo-item-priority-button`;
            Object.assign(curButton, {
                className: curClass,
                innerHTML: curSVG,
                onfocus: this.focusEvent(),
            })
            return curButton
        });
        // <button class="todo-item-delete">
        var itemDelete = document.createElement("button");
        Object.assign(itemDelete, {
            className: "todo-item-delete",
            innerHTML: buttonSVGs.trash,
            onfocus: this.focusEvent(),
        })
        buttons.push(itemDelete)

        buttons.forEach(elem => {
            buttonDiv.appendChild(elem)
        });


        return buttonDiv;
    }

    // builds todo-item title/check div
    private makeTitleDiv(theme?: siteTheme): HTMLDivElement {
        var titleDiv = <HTMLDivElement>document.createElement("div");
        titleDiv.className = this.isCompleted ?
        "todo-item-title-holder todo-item-title-holder-checked" : "todo-item-title-holder";
        titleDiv.id=`todo-item-title-holder-${this.id}`

        // <input type="text" class="todo-item-title">
        var itemTitle = document.createElement("input");
        Object.assign(itemTitle,{
            className: "todo-item-title",
            type: "text",
            value: this.title,
            tabIndex: "-1",
            placeholder: "Add a title...",
            onkeyup: (e: KeyboardEvent) => {
                this.set_title(itemTitle.value);
                if (e.key == "Enter") {
                    (<HTMLElement>document.getElementById(`todo-item-holder-${this.id}`)!
                    .getElementsByClassName('todo-item-desc')[0])
                    .focus();
                }
            },
            onfocus: this.focusEvent(),
        });
        titleDiv.appendChild(itemTitle);
        // <div class="todo-item-check-holder">
        var checkDiv = <HTMLDivElement>document.createElement("div");
        checkDiv.className = "todo-item-check-holder";

        // <button class="todo-item-check">
        var itemCheck = document.createElement("button");
        itemCheck.innerHTML = buttonSVGs.check;
        Object.assign(itemCheck, {
            className: "todo-item-check",
            onkeyup: (e: KeyboardEvent) => {
                if (e.key == " ") {
                    titleDiv.focus();
                    itemCheck.blur();
                }
            }
        })
        checkDiv.appendChild(itemCheck);
        titleDiv.appendChild(checkDiv);

        return titleDiv;
    }

    // Builds an HTML element from the item
    toHTML(theme?: siteTheme): HTMLDivElement
    {
        // <div class="todo-item-holder" id="todo-item-holder-...">
        var itemDiv = <HTMLDivElement>document.createElement("div");
        Object.assign(itemDiv, {
            className: "todo-item-holder",
            id: `todo-item-holder-${this.id}`,
            tabIndex: "-1",
            onfocus: this.focusEvent(),
        });
        itemDiv.addEventListener("focusout",this.unfocusEvent());

        // title div
        itemDiv.appendChild(this.makeTitleDiv());

        // <textarea class="todo-item-desc">
        var itemDesc = document.createElement("textarea");
        Object.assign(itemDesc, {
            className: "todo-item-desc",
            value: this.description === null ? "" : this.description,
            placeholder: "Include a short description...",
            tabIndex: "-1",
            onkeyup: (e: KeyboardEvent) => {
                this.set_description(itemDesc.value)
                if (e.key == "Enter") {
                    itemDesc.blur()
                }
            },
            onfocus: this.focusEvent(),
        });
        itemDiv.appendChild(itemDesc);

        // button div
        itemDiv.appendChild(this.makeButtonsDiv());

        // <div class="todo-item-status-holder">
        var statusDiv = <HTMLDivElement>document.createElement('div');
        statusDiv.className = "todo-item-status-holder";
        if (this.isCompleted) {
            var deleteButton = document.createElement('button');
            Object.assign(deleteButton, {
                className: "todo-item-delete",
                innerHTML: buttonSVGs.trash,
            });
            statusDiv.appendChild(deleteButton);
        }
        else {
            statusDiv.innerHTML = this.priority == 'none' ? "" : buttonSVGs[this.priority];
        }
        
        itemDiv.appendChild(statusDiv);
        
        return itemDiv
        
    }
}
