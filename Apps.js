// Auto Mood - Application Data Layer

const STORAGE_KEYS = {
  invoices: "automood_invoices",
  expenses: "automood_expenses",
  customers: "automood_customers"
};

function getData(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getInvoices() {
  return getData(STORAGE_KEYS.invoices);
}

function getExpenses() {
  return getData(STORAGE_KEYS.expenses);
}

function getCustomers() {
  return getData(STORAGE_KEYS.customers);
}

function saveInvoice(invoice) {
  const invoices = getInvoices();

  invoices.push({
    id: Date.now(),
    createdAt: new Date().toISOString(),
    ...invoice
  });

  saveData(STORAGE_KEYS.invoices, invoices);

  updateCustomer(invoice);

  return true;
}

function updateCustomer(invoice) {
  const customers = getCustomers();

  let customer = customers.find(
    c => c.phone === invoice.phone
  );

  if (!customer) {
    customer = {
      id: Date.now(),
      phone: invoice.phone,
      visits: 0,
      totalSpent: 0,
      lastVisit: null
    };

    customers.push(customer);
  }

  customer.visits += 1;
  customer.totalSpent += Number(invoice.total || 0);
  customer.lastVisit = new Date().toISOString();

  saveData(STORAGE_KEYS.customers, customers);
}

function saveExpense(expense) {
  const expenses = getExpenses();

  expenses.push({
    id: Date.now(),
    createdAt: new Date().toISOString(),
    ...expense
  });

  saveData(STORAGE_KEYS.expenses, expenses);

  return true;
}

function getCustomerHistory(phone) {
  return getInvoices().filter(
    invoice => invoice.phone === phone
  );
}

function getTodayInvoices() {
  const today = new Date().toISOString().slice(0, 10);

  return getInvoices().filter(invoice =>
    invoice.createdAt.startsWith(today)
  );
}

function getTodayExpenses() {
  const today = new Date().toISOString().slice(0, 10);

  return getExpenses().filter(expense =>
    expense.createdAt.startsWith(today)
  );
}

function getTodaySales() {
  return getTodayInvoices().reduce(
    (total, invoice) =>
      total + Number(invoice.total || 0),
    0
  );
}

function getTodayExpensesTotal() {
  return getTodayExpenses().reduce(
    (total, expense) =>
      total + Number(expense.amount || 0),
    0
  );
}

function getTodayNetProfit() {
  return getTodaySales() - getTodayExpensesTotal();
}

console.log("Auto Mood system loaded");
