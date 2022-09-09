// selecting required elements
const form = document.querySelector('.todo-form')
const todoInput = document.querySelector('.add-todo-input')
const todoList = document.querySelector('.todo-list')
const templateEle = document.querySelector('#boilerplate-todo-list')

// local storage key
const LOCAL_STORAGE_KEY = 'TodoList'
const TODO_LOCAL_STORAGE_KEY = `${LOCAL_STORAGE_KEY}-CRUD`

// maintaining all the todo
const todoBox = getLocalTodo()
todoBox.forEach(renderTodo)

form.addEventListener('submit' , e => {
    e.preventDefault()

    const todoName = todoInput.value

    // edge case
    if (todoName === "") return 

    todoBox.push(todoName)
    renderTodo(todoName)
    saveLocalTodo()
    todoInput.value = ""
})

// ============================ CRUD Operations Functions ============================ 

// add/render todo 
function renderTodo(todoName) {
    const templateFragment = templateEle.content.cloneNode(true)
    const todoListItemContainer = templateFragment.querySelector('.todo-list-item')
    const todoItemName = todoListItemContainer.querySelector('[data-list-item-text]')
    
    todoItemName.innerText = todoName
    todoList.append(todoListItemContainer)
}

// ============================ LocalStorage ============================ 

// save todo in localStorage
function saveLocalTodo() {
    localStorage.setItem(TODO_LOCAL_STORAGE_KEY , JSON.stringify(todoBox))
}

// get all todo from the localStorage after DOM loaded successfully
function getLocalTodo() {
    const allTodoList = localStorage.getItem(TODO_LOCAL_STORAGE_KEY)
    return JSON.parse(allTodoList) || []
}

// ============================ event listener ============================

// window.addEventListener('load' , getLocalTodo )
