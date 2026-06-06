// const { act } = require("react");

let transactionsDatabase = [];

// let sampleTransaction = {
//     id: "unique timestamp based id",
//     title: "text title of transaction",
//     amount: 450,
//     type: "income or expense",
//     date: "iso format date"
// }

function addTransaction(title, amount, type, date) {
    let idString = "trans" + Date.now();
    let newTransaction = {
        id: idString,
        title: title,
        amount: Number(amount),
        type: type,
        date: date,
    };

    transactionsDatabase.push(newTransaction);

}

// addTransaction("Electricity Bill Payment", 1200.00, "Expense", "2026-06-05");
// addTransaction("Freelance Website Designing", 20000.00, "Income", "2026-03-05");

function delTransactionbyID(idRequired) {
    for (let i = 0; i < transactionsDatabase.length; i++) {
        if(transactionsDatabase[i].id == idRequired) {
            transactionsDatabase.splice(i, 1)
            console.log(`Transaction with ID: ${idRequired} has been removed successfully!`)
        }
        else {
            console.log("Transaction ID search ongoing...")
        }
    };
}

function getAllTransactions(){
    for (let i = 0; i < transactionsDatabase.length; i++) {
        console.log(`Transaction ${i+1}
            Transaction ID: ${transactionsDatabase[i].id}
            Transaction Title: ${transactionsDatabase[i].title}
            Transaction Amount: ${transactionsDatabase[i].amount}
            Transaction Type: ${transactionsDatabase[i].type}
            Transaction Date: ${transactionsDatabase[i].date}
            `)
    }
}

const addTransactionForm = document.getElementById("newTransactionForm");
const historyTableBody = document.getElementById("historyBody");

let isFirstTransactionEntry = true;

addTransactionForm.addEventListener("submit", function(event){
    event.preventDefault();

    const formData = new FormData(addTransactionForm);

    const  transactionTitle = formData.get('title');

    const  transactionAmount = formData.get('amount');

    const  transactionType = formData.get('type');

    const  transactionDate = formData.get('date');

    // console.log(`Transaction Title :${transactionTitle}
    //     Transaction Amount: ${transactionAmount}
    //     Transaction Type: ${transactionType}
    //     Transaction Date: ${transactionDate}`)

    if (isFirstTransactionEntry) {
        historyTableBody.innerHTML = "";

        document.getElementById("totalIncome").innerText = "0 PKR"
        document.getElementById("totalExpenses").innerText = "0 PKR"
        document.getElementById("netBalance").innerText = "0 PKR"

        isFirstTransactionEntry = false;
    }

    addTransaction(transactionTitle, transactionAmount, transactionType, transactionDate);

    const formattedType = transactionType.charAt(0).toUpperCase() + transactionType.slice(1);

    const formattedTitle = transactionTitle.charAt(0).toUpperCase() + transactionTitle.slice(1);

    let formattedDate = transactionDate;

    if (transactionDate) {
        const [year, month, day] = transactionDate.split("-");
        formattedDate = `${day}/${month}/${year}`;
    }
    const newRow = document.createElement("tr");

    newRow.innerHTML = `<td class="date">${formattedDate}</td>
            <td class="title">${formattedTitle}</td>
            <td class="amount">${transactionAmount}</td>
            <td class="type">${formattedType}</td>
            <td class="action"><button class="editButton">Edit</button></td>`;
    
    historyTableBody.insertBefore(newRow, historyTableBody.firstChild);
    if (historyTableBody.children.length > 6) {
        historyTableBody.removeChild(historyTableBody.lastChild);
    }

    let currentIncome = 0;
    let currentExpense = 0;

    transactionsDatabase.forEach(trans => {
        if (trans.type === "income") currentIncome += trans.amount;
        if (trans.type === "expense") currentExpense += trans.amount;
    });

    let currentBalance = currentIncome - currentExpense;
    let balanceSign = currentBalance >= 0 ? "+" : "";

    totalIncomeField = document.getElementById("totalIncome");
    totalExpensesField = document.getElementById("totalExpenses");
    netBalanceField = document.getElementById("netBalance");

    totalIncomeField.innerText = `${currentIncome} PKR`;
    totalExpensesField.innerText = `${currentExpense} PKR`;
    netBalanceField.innerText = `${balanceSign}${currentBalance} PKR`;

})

const editButton = document.getElementsByClassName("editButton")

historyTableBody.addEventListener("click", function(event) {
    const target = event.target;

    if (target.classList.contains("editButton")) {
        const editButton = event.target;
        const row = editButton.closest("tr");

        const dateCell = row.querySelector(".date");
        const titleCell = row.querySelector(".title");
        const amountCell = row.querySelector(".amount");
        const typeCell = row.querySelector(".type");
        const actionCell = row.querySelector(".action");

        if (editButton.innerText === "Edit") {
            currentPlainDate = dateCell.innerText;
            const [date, month, year] = currentPlainDate.split("/");

            const htmlDateFormat = `${year}-${month}-${date}`;

            dateCell.innerHTML = `<input type="date" value="${htmlDateFormat}" class="editDate" style="width: 100px;">`;
            titleCell.innerHTML = `<input type="text" value="${titleCell.innerText}" class="editTitle" style="width: 80px;">`;
            amountCell.innerHTML = `<input type="number" value="${amountCell.innerText}" class="editAmount" style="width: 60px;">`;

            const currentType = typeCell.innerText.toLowerCase();

            typeCell.innerHTML = `
            <select class="editType">
                <option value="Income" ${currentType==='income' ? 'selected' : ''}>Income</option>
                <option value="Expense" ${currentType==='expense' ? 'selected' : ''}>Expense</option>
            </select>`;

            editButton.innerText = "Save";

            const delButton = document.createElement("button");

            delButton.className = "delButton";
            delButton.innerText = "Delete";
            delButton.style.backgroundColor = "crimson";
            delButton.style.color = "white";
            delButton.style.border = "none";
            delButton.style.borderRadius = "4px";
            delButton.style.marginLeft = "5px";
            delButton.style.cursor = "pointer";

            actionCell.appendChild(delButton)
                
        } else if (editButton.innerText === "Save") {
            const newRawDate = row.querySelector(".editDate").value;
            const newTitle = row.querySelector(".editTitle").value;
            const newAmount = row.querySelector(".editAmount").value;
            const newType = row.querySelector(".editType").value;

            let formattedDate = "";
            if (newRawDate) {
                const [year, month, date] = newRawDate.split("-");
                formattedDate = `${date}/${month}/${year}`;
            }

            dateCell.innerText = formattedDate;
            titleCell.innerText = newTitle.charAt(0).toUpperCase() + newTitle.slice(1);
            amountCell.innerText = newAmount;
            typeCell.innerText = newType;

            const rowIndex = Array.from(historyTableBody.children).indexOf(row);

            if (transactionsDatabase[rowIndex]) {
                transactionsDatabase[rowIndex].title = newTitle;
                transactionsDatabase[rowIndex].amount = Number(newAmount);
                transactionsDatabase[rowIndex].type = newType.toLowerCase();
                transactionsDatabase[rowIndex].date = newRawDate;
            }

            editButton.innerText = "Edit";
            const delButton = actionCell.querySelector(".delButton");
            if (delButton) delButton.remove();

            recalculateTotals();
        }
    }

    if (event.target.classList.contains("delButton")) {
        const row = event.target.closest("tr");
        const rowIndex = Array.from(historyTableBody.children).indexOf(row);

        if (rowIndex > -1) {
            transactionsDatabase.splice(rowIndex, 1);
        }

        row.remove();

        recalculateTotals();
    }
})

function recalculateTotals() {
    let incomeSum = 0;
    let expenseSum = 0;

    const rows = historyTableBody.querySelectorAll("tr");

    rows.forEach(row => {
        const amount = Number(row.querySelector(".amount").innerText) || 0;
        const type = row.querySelector(".type").innerText.toLowerCase();

        if (type === "income") {
            incomeSum += amount;
        }
        else if (type === "expense") {
            expenseSum += amount;
        }
    });

    let balanceSum = incomeSum - expenseSum;
    let sign = balanceSum >= 0 ? "+" : "";

    document.getElementById("totalIncome").innerText = `${incomeSum} PKR`;
    document.getElementById("totalExpenses").innerText = `${expenseSum} PKR`;
    document.getElementById("netBalance").innerText = `${sign}${balanceSum} PKR`;
}

// getAllTransactions()