// selecting required elements
const form = document.querySelector('.todo-form')
const todoInput = document.querySelector('.add-todo-input')
const todoList = document.querySelector('.todo-list')
const templateEle = document.querySelector('#boilerplate-todo-list')

// local storage key
const LOCAL_STORAGE_KEY = 'TodoList'
const TODO_LOCAL_STORAGE_KEY = `${LOCAL_STORAGE_KEY}-CRUD`

// maintaining all the todo
const todos = getLocalTodo()
todos.forEach(renderTodo)

form.addEventListener('submit' , e => {
    e.preventDefault()

    const todoName = todoInput.value

    // edge case
    if (todoName === "") return 

    // for handling complete todo state
    const newTodo = {
        name: todoName ,
        complete: false , // by-default a todo will be in incomplete state
        id: new Date().valueOf().toString()
    }
    todos.push(newTodo)
    renderTodo(newTodo)
    saveLocalTodo()
    todoInput.value = ""
})

// ============================ CRUD Operations Functions ============================ 

// add/render todo 
function renderTodo(todoItem) {
    const templateFragment = templateEle.content.cloneNode(true)
    
    // adding id
    const todoListItemContainer = templateFragment.querySelector('.todo-list-item')
    todoListItemContainer.dataset.todoId = todoItem.id
    
    // adding todo name 
    const todoItemName = todoListItemContainer.querySelector('[data-list-item-text]')
    todoItemName.innerText = todoItem.name
    
    // for complete todo state
    const todoItemCheckbox = todoListItemContainer.querySelector('[data-list-item-checkbox]')
    todoItemCheckbox.checked = todoItem.complete
    if (todoItemCheckbox.checked === true) {
        todoListItemContainer.classList.add('complete-state')
    } else {
        todoListItemContainer.classList.remove('complete-state')
    }

    todoList.append(todoListItemContainer)
}

// complete todo
function completeTodo(targetEle) {
    const todoListItemContainer = targetEle.closest('.todo-list-item')
    const todoListItemId = todoListItemContainer.dataset.todoId
    const todo = todos.find(todoItem => {
        return todoItem.id === todoListItemId
    }) 
    todo.complete = targetEle.checked
    todoListItemContainer.classList.toggle('complete-state')

    saveLocalTodo()
}

// edit todo
function editTodo(targetEle) {
    const todoListItemContainer = targetEle.closest('.todo-list-item')
    const todoListItem = todoListItemContainer.querySelector('[data-list-item-text]')
    const editInput = todoListItemContainer.querySelector('.edit-input')

    const todoItem = todos.find(todo => {
        return todo.id === todoListItemContainer.dataset.todoId
    })

    if (!todoListItemContainer.classList.contains('edit-state')) {
        todoListItemContainer.classList.add('edit-state')
        
        editInput.value = todoListItem.innerText
    } else {
        todoListItemContainer.classList.remove('edit-state')

        todoListItem.innerText = editInput.value 
        todoItem.name = todoListItem.innerText
    }

    saveLocalTodo()
}

// delete todo
function deleteTodo(targetEle) {
    const todoListItemContainer = targetEle.closest('.todo-list-item')
    todoListItemContainer.classList.add('delete-state')

    // delete todo from the localStorage
    const todoItem = todos.find(todoItem => {
        return todoItem.id === todoListItemContainer.dataset.todoId 
    })

    todos.splice(todos.indexOf(todoItem) , 1)

    todoListItemContainer.addEventListener('transitionend' , () => {
        todoListItemContainer.remove()
    })

    saveLocalTodo()
}

// ============================ LocalStorage ============================ 

// save todo in localStorage
function saveLocalTodo() {
    localStorage.setItem(TODO_LOCAL_STORAGE_KEY , JSON.stringify(todos))
}

// get/load all todo from the localStorage after DOM loaded successfully
function getLocalTodo() {
    const allTodoList = localStorage.getItem(TODO_LOCAL_STORAGE_KEY)
    return JSON.parse(allTodoList) || []
}

// ============================ event listener ============================

// window.addEventListener('load' , getLocalTodo )
todoList.addEventListener('click' , e => {
    const targetEle = e.target

    if (targetEle.matches('[data-list-item-checkbox]')) {
        completeTodo(targetEle)
    }
    
    if (targetEle.matches('.edit-button')) {
        editTodo(targetEle)
    }

    if (targetEle.matches('.delete-button')) {
        deleteTodo(targetEle)
    }
})

const filterTodo = document.querySelector('.filter-options')
filterTodo.addEventListener('change' , filterTodoOptions)

// ============================ Filter todos =============================

function filterTodoOptions(e) {
    const targetOptionEle = e.target
    const todoListItem = todoList.querySelectorAll('.todo-list-item')

    // edge case
    if (todoList.innerHTML === "") return

    // const filterOptions = Array.from(filterTodo.children)

    todoListItem.forEach(todoItem => {
        switch(targetOptionEle.value) {
            case "all" : 
                todoItem.style.display = "flex"
                break ;
            case "completed" :
                if (todoItem.matches('.complete-state')) {
                    todoItem.style.display = "flex"
                } else {
                    todoItem.style.display = "none"
                }
                break;
            case "uncompleted" :
                if (!todoItem.matches('.complete-state')) {
                    todoItem.style.display = "flex"
                } else {
                    todoItem.style.display = "none"
                }
        }
    })

}