let db;
const request = index.DB.open("budget", 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore("pending", { autoIncremet: true });

};
request.onsucess = function(event) {
    db.event.target.result;
    if (navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = function(event) {
    console.log(event.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.ObjectStore("pending");
    store.add(record);
}

function checkDatabase() {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.ObjectStore("pending");
    const getAll = store.getAll();

    getAll.onsucess = function() {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            }).then(response => {
                return response.json();

            }).then(() => {
                const transaction =db.transaction(["pending"], "readwrite");
                const store = transaction.ObjectStore("pending");
                store.clear();
            });
        }
    };
}
window.addEventListener("online", checkDatabase);