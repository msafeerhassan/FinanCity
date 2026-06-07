// const { act } = require("react");

let transactionsDatabase = JSON.parse(localStorage.getItem("transactionsDatabase")) || [];

// let sampleTransaction = {
//     id: "unique timestamp based id",
//     title: "text title of transaction",
//     amount: 450,
//     type: "income or expense",
//     date: "iso format date"
// }

let currentPage = 1;
const recordsPerPage = 6;

function saveToLocalStorage() {
    localStorage.setItem("transactionsDatabase", JSON.stringify(transactionsDatabase));

}

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
    saveToLocalStorage();
}

// addTransaction("Electricity Bill Payment", 1200.00, "Expense", "2026-06-05");
// addTransaction("Freelance Website Designing", 20000.00, "Income", "2026-03-05");

function delTransactionbyID(idRequired) {
    for (let i = 0; i < transactionsDatabase.length; i++) {
        if(transactionsDatabase[i].id == idRequired) {
            transactionsDatabase.splice(i, 1)
            console.log(`Transaction with ID: ${idRequired} has been removed successfully!`)
            saveToLocalStorage()
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
const paginationControl = document.getElementById("paginationControl");

let isFirstTransactionEntry = transactionsDatabase.length === 0;

function renderCurrentPage() {
    historyTableBody.innerHTML = "";

    if (transactionsDatabase.length === 0) {
        paginationControl.innerHTML = "";
        recalculateTotals();
        return ;
    }

    const totalPages = Math.ceil(transactionsDatabase.length / recordsPerPage);

    if (currentPage > totalPages) currentPage = totalPages || 1;

    const reverseData = [...transactionsDatabase].reverse();
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const paginatedItems = reverseData.slice(startIndex, endIndex);

    paginatedItems.forEach((trans) => {
        const formattedType = trans.type.charAt(0).toUpperCase() + trans.type.slice(1);
        const formattedTitle = trans.title.charAt(0).toUpperCase() + trans.title.slice(1);

        let formattedDate = trans.date;
        if (trans.date && trans.date.includes("-")) {
            const [year, month, day] = trans.date.split("-");
            formattedDate = `${day}/${month}/${year}`;
        }

        const newRow = document.createElement("tr");

        newRow.dataset.id = trans.id

        newRow.innerHTML = `<td class="date">${formattedDate}</td>
            <td class="title">${formattedTitle}</td>
            <td class="amount">${trans.amount}</td>
            <td class="type">${formattedType}</td>
            <td class="action"><button class="editButton">Edit</button></td>`;

        historyTableBody.appendChild(newRow)
    });

    renderPaginationButton(totalPages);
    recalculateTotals();
}

function renderPaginationButton(totalPages) {
    paginationControl.innerHTML = "";
    if (totalPages <= 1) return;

    const prevBtn = document.createElement("button");
    prevBtn.innerText = "<< Previous";
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener("click", ()=> {
        currentPage--;
        renderCurrentPage();
    });
    paginationControl.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.innerText = i;

        if(i === currentPage) pageBtn.classList.add("activePage");
        pageBtn.addEventListener("click", ()=>{
            currentPage = i;
            renderCurrentPage();
        });
        paginationControl.appendChild(pageBtn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.innerText = "Next >>";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener("click", () => {
        currentPage++;
        renderCurrentPage();
    });
    paginationControl.appendChild(nextBtn);
}

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

    currentPage = 1;
    renderCurrentPage();
    addTransactionForm.reset();
})

const editButton = document.getElementsByClassName("editButton")

historyTableBody.addEventListener("click", function(event) {
    const target = event.target;

    if (target.classList.contains("editButton")) {
        const editButton = event.target;
        const row = editButton.closest("tr");
        const transactionID = row.dataset.id;
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

            const targetTransaction = transactionsDatabase.find(t => t.id === transactionID);
            if (targetTransaction){
                targetTransaction.title = newTitle;
                targetTransaction.amount = Number(newAmount);
                targetTransaction.type = newType.toLowerCase();
                targetTransaction.date = newRawDate;
                saveToLocalStorage();
            }

            editButton.innerText = "Edit";
            const delButton = actionCell.querySelector(".delButton");
            if (delButton) delButton.remove();

            renderCurrentPage();
        }
    }

    if (event.target.classList.contains("delButton")){
        const row = event.target.closest("tr");
        const transactionId = row.dataset.id;

        transactionsDatabase = transactionsDatabase.filter(t => t.id !== transactionId);
        saveToLocalStorage();
        renderCurrentPage();
    }
})
function recalculateTotals() {
    let incomeSum = 0;
    let expenseSum = 0;

    transactionsDatabase.forEach(trans => {
        if(trans.type === "income") {
            incomeSum += trans.amount;
        }
        else if (trans.type === "expense"){
            expenseSum += trans.amount;
        }
    });

    let balanceSum = incomeSum - expenseSum;
    let sign = balanceSum >= 0 ? "+" : "";

    document.getElementById("totalIncome").innerText = `${incomeSum} PKR`;
    document.getElementById("totalExpenses").innerText = `${expenseSum} PKR`;
    document.getElementById("netBalance").innerText = `${sign}${balanceSum} PKR`;
}

// getAllTransactions()

document.getElementById("exportJSONBtn").addEventListener("click", function () {
    if (transactionsDatabase.length === 0) {
        alert("No transaction record to export!");
        return;
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(transactionsDatabase, null, 2));
    const downloadIcon = document.createElement('a');
    downloadIcon.setAttribute("href", dataStr)
    downloadIcon.setAttribute("download", "FinanCityBackup.json");
    document.body.appendChild(downloadIcon);
    downloadIcon.click();
    downloadIcon.remove();
})

document.getElementById("importJSONFile").addEventListener("change", function(event) {
    const fileReader = new FileReader();
    let targetFile = event.target.files[0];

    if (!targetFile) return;

    fileReader.onload = function(e) {
        try {
            const parsedData = JSON.parse(e.target.result);
            if (Array.isArray(parsedData)){
                transactionsDatabase = parsedData;
                saveToLocalStorage();
                currentPage = 1;
                renderCurrentPage();
                alert("Backup Loaded Successfully!");
            }
            else {
                alert("Invalid Data Structure within JSON File.");
            }
        }
        catch(err) {
            alert("Error Parsing File!")
        }
    };
    fileReader.readAsText(targetFile);
    event.target.value = "";
})

document.addEventListener("DOMContentLoaded" ,() => {
    const aiResponseDisplay = document.getElementById("aiResponseDisplay");
    const aiCustomQueryInput = document.getElementById("aiCustomQuery");
    const aiSubmitQueryBtn = document.getElementById("aiSubmitQueryBtn");

    document.querySelectorAll(".aiActionBtn").forEach(btn => {
        btn.addEventListener("click", ()=>{
            const actionType = btn.getAttribute("data-query");
            genAIResponse(actionType);
        });
    });
    aiSubmitQueryBtn.addEventListener("click", processCustomAIQuery);
    aiCustomQueryInput.addEventListener("keypress", (e) => {
        if(e.key === "Enter") processCustomAIQuery();
    });

    function processCustomAIQuery() {
        const queryText = aiCustomQueryInput.value.trim().toLowerCase();
        if (!queryText) return;

        if (queryText.includes("saving") || queryText.includes("rate") || queryText.includes("percent")) {
            genAIResponse("analyze");
        }
        else if (queryText.includes("summary") || queryText.includes("history") || queryText.includes("list")) {
            genAIResponse("summary");
        }
        else if (queryText.includes("budget") || queryText.includes("strategy") || queryText.includes("plan") || queryText.includes("advice")) {
            genAIResponse("budget");
        }
        else {
            genAIResponse("general", queryText);
        }
        aiCustomQueryInput.value = "";
    }

    function genAIResponse(type, customPhrase = "") {
        if (!transactionsDatabase || transactionsDatabase.length === 0) {
            aiResponseDisplay.innerHTML = `
            <div class="aiResponseCard alert">
                <strong>System Alert:</strong> Your transaction history is currently empty so can't perform analysis.
            </div>;
            `
            return;
        }

        let totalIncome = 0;
        let totalExpenses = 0;
        const categoriesMap = {};
        let largestExpenseTitle = "None";
        let maxExpenseAmount = 0;

        transactionsDatabase.forEach(item => {
            const amount = Number(item.amount) || 0;
            const formattedTitle = item.title.trim().charAt(0).toUpperCase() + item.title.trim().slice(1).toLowerCase();

            if(item.type === "income") {
                totalIncome += amount;
            }
            else if (item.type === "expense") {
                totalExpenses += amount;

                categoriesMap[formattedTitle] = (categoriesMap[formattedTitle] || 0) + amount;

                if (amount > maxExpenseAmount) {
                    maxExpenseAmount = amount;
                    largestExpenseTitle = formattedTitle;
                }
            }
        });

        const netSavings = totalIncome - totalExpenses;
        const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : 0;

        let htmlResponse = "";

        if (type === "analyze") {
            htmlResponse = `
            <div class="aiResponseCard">
                <h4>Savings Rate Analysis</h4>
                <p>Your current net savings rate is <strong>${savingsRate}%</strong> (${netSavings} PKR retained out of ${totalIncome} PKR total Income.)</p>
                <div class="aiProgressBarContainer">
                    <div class="aiProgressBar" style="width: ${Math.max(0, Math.min(100, savingsRate))}%"></div>
                <p class="aiInsightText">${
                    savingsRate >= 20 ? "Perfect - keep maintaining this cash surplus. You will have net worth equal to Elon Musk in 2030 (just kidding)" :
                    "Caution: Your savings are not enough. Lower spendings on Claude Code Subscription (just kidding)"
                }</p>
            </div>`;
        }
        else if (type === "summary") {
            htmlResponse = `
            <div class="aiResponseCard">
                <h4>Transactions History Summary</h4>
                <ul>
                    <li><strong>Ledger Count:</strong> Total: ${transactionsDatabase.length} records submitted.</li>
                    <li><strong>Total Cash Inflow:</strong><span class="aiTextIncome"> ${totalIncome} PKR</span></li>
                    <li><strong>Total Cash Outflow:</strong><span class="aiTextExpense"> ${totalExpenses} PKR</span></li>
                    <li><strong>Highest Expense:</strong><span class="aiTextIncome">"${largestExpenseTitle}" of ${maxExpenseAmount} PKR</span></li>
            </div>`;
        }
        else if(type === "budget") {
            htmlResponse = `
                <div class="aiResponseCard">
                    <h4>Budget Strategy Suggestions</h4>
                    <p>Based on your current peak expenditure for <strong>"${largestExpenseTitle}", here are three suggestions:</strong></p>
                    <ol>
                        <li>Implement a <strong>48-hour cool-off rule</strong> on non-essential transactions near your peak expense of ${maxExpenseAmount} PKR.
                        </li>
                        <li>
                        Plan your saving target of <strong>${Math.max(1000, Math.floor(totalIncome * 0.1))} PKR</strong> directly when adding income transaction details.
                        </li>
                        <li>Divide income in weekly-based cash envelopes to prevent over-spending</li>
                    </ol>
                </div>`;
        }
        else {
            htmlResponse = `
                <div class="aiResponseCard">
                    <h4>Custom AI-based Insights</h4>
                    <p>Review done of query <em>"${customPhrase}"</em> keeping your transational records and history:</p>
                    </div>
                    <p>Currently, your overall balance changes are having <strong>${netSavings >= 0 ? 'Surplus' : 'Deficit'} of ${netSavings} PKR</strong>. Your highest single expense was at ${largestExpenseTitle} of ${maxExpenseAmount} PKR. </p>
                </div>
            `
        }
        aiResponseDisplay.innerHTML = htmlResponse;
    }
})

renderCurrentPage();