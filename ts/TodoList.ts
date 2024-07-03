import { TodoItem, priority, buttonSVGs} from './TodoItem';

export class TodoList {
    private tasks: TodoItem[];
    //theme: siteTheme;

    constructor() {
        this.tasks = this.getListData()
        this.renderItems()
        this.initListeners()
        this.updateDisplay()
        // saves to local when site is closed/refreshed by user
        window.onbeforeunload = (_) => this.exportListData();
    }

    // sets up base listeners
    initListeners(): void {
        document.getElementById("add-item-submit")!.onclick = this.addEvent.bind(this);
        let titleInput = <HTMLInputElement>document.getElementById("add-item-title")!; 
        titleInput.onkeyup = (e: KeyboardEvent) => {
            if (e.key == "Enter") {
                this.addEvent()
            }
        }
        document.getElementById("clear-all-button")!.onclick
            = this.clearAllDone.bind(this);

        document.onkeyup = (e: KeyboardEvent) => {
            if (e.key == "Escape") {
                (<HTMLElement>document.activeElement!).blur()
            }
        }
        
        this.updateButtonListeners();
    }

    // Updates display based on list state
    updateDisplay(): void {
        var todoItemSeparator = document.getElementById("todo-done-separator")!;
        var doneTitle = document.getElementById("done-title")!;
        var footerBorderHolder = document.getElementById("footer-border-holder")!;
        var creditsHolder = document.getElementById("credits-holder")!;
        let doneList = this.tasks.filter(elem => elem.isCompleted);
        if (doneList.length == 0) {
            todoItemSeparator.style.display = "none";
            doneTitle.style.display = "none";
        } else {
            todoItemSeparator.style.display = "auto";
            doneTitle.style.display = "flex";
        }
        if (this.tasks.length == 0) {
            creditsHolder.style.display = "none";
            footerBorderHolder.style.display = "none";
        } else {
            creditsHolder.style.display = "inline";
            footerBorderHolder.style.display = "flex";
        }
    }
    
    private generateUniqueID(): number {
        if (this.tasks.length == 0) {
            return 0
        }
        let curIDs: number[] = this.tasks.map((elem) => elem.get_id());
        return Math.max.apply(this, curIDs) + 1;
    }

    // add item event
    private addEvent(_: Event | null = null): void {
        let addItemTitle = <HTMLInputElement>document.getElementById("add-item-title");
        if (addItemTitle.value == "") {
            addItemTitle.focus();
            return
        }
        this.addTask(new TodoItem(
            addItemTitle!.value,
            null,
            <priority>"none",
            false,
            this.generateUniqueID()
        ));
        addItemTitle!.value = "";
        this.updateDisplay();
    }

    // partial function for delete event
    private deleteEvent(id: number): (a: Event) => void {
        return (_: Event) => {this.removeTask(id); this.updateDisplay()}
    }

    // partial function for check event 
    private checkEvent(id: number): (a: Event) => void {
        return (_: Event) => {
            let curIndex = this.idToIndex(id)
            let curTask = this.tasks[curIndex];
            let curTaskDiv = document.getElementById(`todo-item-holder-${id}`);
            curTask.toggleCheck();
            curTaskDiv!.remove();
            this.renderItem(curTask);
            this.updateDisplay();
        }
    }

    // partial function for priority event
    private priorityEvent(priority: priority): (id: number) => (a: Event) => void {
        return (id: number) => (_: Event) => {
            let curIndex = this.idToIndex(id);
            let curPriority = this.tasks[curIndex].priority;
            this.tasks[curIndex].priority = priority == curPriority ?
            'none' : priority;
            let curButtonDiv = document.getElementById(`todo-item-priority-holder-${id}`);
            if (curPriority != 'none') {
                let prevPriorityButton = curButtonDiv!.getElementsByClassName(`todo-item-priority-button-selected`);
                prevPriorityButton[0].classList.remove("todo-item-priority-button-selected");
            }

            let curItemDiv = document.getElementById(`todo-item-holder-${id}`);
            let statusDiv = curItemDiv!.getElementsByClassName('todo-item-status-holder');
            
            if (curPriority == priority) { // new priority == 'none'
                statusDiv[0].innerHTML = '';
                return
            }

            statusDiv[0].innerHTML = buttonSVGs[<'low' | 'high'>priority];
            let newPriorityButton = curButtonDiv!.getElementsByClassName(`todo-item-priority-button-${priority}`);
            newPriorityButton[0].classList.add("todo-item-priority-button-selected");
            
        }
    }

    private idToIndex(id: number): number {
        let selectedItem = [...Array(this.tasks.length).keys()].filter((i) => this.tasks[i].get_id() === id)
        if (selectedItem.length === 0) {
            throw new ReferenceError(`TodoList.getTaskByID: Task with ID ${id} not found.`)
        }
        else if (selectedItem.length >= 2) {
            throw new ReferenceError(`TodoList.getTaskByID: Multiple items with ID ${id} found.`)
        }
        return selectedItem[0]
    }
    // initialise/update all button listeners
    updateButtonListeners(): void {
        this.tasks.forEach((task) => {
            this.initButtonListeners(task)
        })
    }

    // initialise all button listeners of elem
    initButtonListeners(
        task: TodoItem
    ): void {
        this.initButtonListener(task, 'delete', this.deleteEvent.bind(this));
        this.initButtonListener(task, 'check', this.checkEvent.bind(this));
        this.initButtonListener(task, 'priority-button-low', 
            this.priorityEvent('low').bind(this)
        );
        this.initButtonListener(task, 'priority-button-high', 
            this.priorityEvent('high').bind(this)
        )
    }

    // initialise button listeners of elem
    initButtonListener(
        task: TodoItem,
        type: 'delete' | 'check' | 'priority-button-high' | 'priority-button-low',
        buttonFunction: (i: number) => ((a: Event) => void)
    ): void {
        let id = task.get_id();
        let curDiv = document.getElementById(`todo-item-holder-${id}`);
        let curButtons: Element[] = Array.from(curDiv!.getElementsByClassName(`todo-item-${type}`));
        curButtons.forEach((element: Element) => {
            let htmlElement = <HTMLElement>element!;
            htmlElement.onclick = buttonFunction(id)
        });
    }
    

    // Retrieves data from localStorage
    getListData(): TodoItem[] {
        let curData: string | null = localStorage.getItem("items");
        if (curData === null || curData === "undefined") {
            localStorage.setItem("items", "[]")
            return <TodoItem[]>[];
        }
        let curJSON: any[] = JSON.parse(curData);
        let data: TodoItem[] = curJSON.map((elem) => {
            return new TodoItem(
                elem.title,
                elem.description,
                <priority>elem.priority,
                elem.isCompleted,
                elem.id
            )
        });
        return data
    }

    // Exports data to localStorage
    exportListData(): void {
        let dataString = JSON.stringify(this.tasks);
        localStorage.setItem("items", dataString)
        console.log("Data Exported!")
    }
    
    // Adds task to current list
    addTask(task: TodoItem): void {
        this.tasks.push(task);
        this.renderItem(task);
        this.initButtonListeners(task)
    }

    // Removes task from current list by id
    removeTask(id: number): void {
        let index = this.idToIndex(id);
        this.tasks.splice(index, 1);
        let curTaskDiv = document.getElementById(`todo-item-holder-${id}`);
        curTaskDiv!.remove();
        this.updateButtonListeners()
    }

    // Clears all done tasks
    clearAllDone(): void {
        let doneList = this.tasks.filter(elem => elem.isCompleted);
        let doneIds = doneList.map(elem => elem.get_id());
        doneIds.forEach(id => this.removeTask(id));
        this.updateDisplay();
    }

    // Renders tasks in respective holder
    renderItem(task: TodoItem): void {
        var todoDiv = document.getElementById("todo-items-list");
        var doneDiv = document.getElementById("done-items-list");
        let taskHTML = task.toHTML();
        if (task.isCompleted) {
            doneDiv!.appendChild(taskHTML);
        } else {
            todoDiv!.appendChild(taskHTML);
        }
        this.initButtonListeners(task)
    }
    
    // Renders each task in list to corresponding div
    renderItems(): void {
        this.tasks.forEach((element: TodoItem) => {
            this.renderItem(element)
        });
    }
}