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

const addTransactionForm = document.getElementById("newTransactionForm")

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

    addTransaction(transactionTitle, transactionAmount, transactionType, transactionDate)

    getAllTransactions()
})

// getAllTransactions()