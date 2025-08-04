const mongoose = require('mongoose');
const readline = require('readline');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/employeedb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');
  showMenu();
}).catch(err => console.error('❌ Connection Error:', err));

// Define Schema
const employeeSchema = new mongoose.Schema({
  name: String,
  position: String,
  salary: Number
});

const Employee = mongoose.model('Emp', employeeSchema);

// CLI Setup
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Menu
function showMenu() {
  console.log(`
--- Employee Management ---
1. Add Employee
2. View All Employees
3. Update Employee
4. Delete Employee
5. Sort Salary ↑ Ascending
6. Sort Salary ↓ Descending
7. Exit
---------------------------`);
  rl.question('Choose an option (1-7): ', handleMenu);
}

// Menu Actions
function handleMenu(choice) {
  switch (choice.trim()) {
    case '1': addEmployee(); break;
    case '2': viewEmployees(); break;
    case '3': updateEmployee(); break;
    case '4': deleteEmployee(); break;
    case '5': sortSalaryAsc(); break;
    case '6': sortSalaryDesc(); break;
    case '7':
      console.log('👋 Exiting...');
      rl.close();
      mongoose.disconnect();
      break;
    default:
      console.log('❌ Invalid choice.');
      showMenu();
  }
}

function addEmployee() {
  rl.question('Name: ', name => {
    rl.question('Position: ', position => {
      rl.question('Salary: ', salary => {
        const emp = new Employee({ name, position, salary: Number(salary) });
        emp.save()
          .then(() => console.log('✅ Employee added.'))
          .catch(err => console.error('❌ Failed:', err))
          .finally(showMenu);
      });
    });
  });
}

function viewEmployees() {
  Employee.find()
    .then(emps => {
      console.log('\n📋 Employee List:');
      emps.forEach((e, i) => {
        console.log(`${i + 1}. ${e.name} | ${e.position} | ₹${e.salary} | ID: ${e._id}`);
      });
    })
    .catch(err => console.error('❌ Fetch failed:', err))
    .finally(showMenu);
}

function updateEmployee() {
  rl.question('Enter Employee ID to update: ', id => {
    rl.question('New Name: ', name => {
      rl.question('New Position: ', position => {
        rl.question('New Salary: ', salary => {
          Employee.findByIdAndUpdate(id, {
            name, position, salary: Number(salary)
          }, { new: true })
            .then(emp => {
              if (emp) console.log('✅ Updated.');
              else console.log('❌ Not found.');
            })
            .catch(err => console.error('❌ Update error:', err))
            .finally(showMenu);
        });
      });
    });
  });
}

function deleteEmployee() {
  rl.question('Enter Employee ID to delete: ', id => {
    Employee.findByIdAndDelete(id)
      .then(emp => {
        if (emp) console.log('🗑️ Deleted.');
        else console.log('❌ Not found.');
      })
      .catch(err => console.error('❌ Delete error:', err))
      .finally(showMenu);
  });
}

function sortSalaryAsc() {
  Employee.find().sort({ salary: 1 })
    .then(emps => {
      console.log('\n💰 Employees Sorted by Salary ↑:');
      emps.forEach((e, i) => {
        console.log(`${i + 1}. ${e.name} | ₹${e.salary}`);
      });
    })
    .catch(err => console.error('❌ Sort error:', err))
    .finally(showMenu);
}

function sortSalaryDesc() {
  Employee.find().sort({ salary: -1 })
    .then(emps => {
      console.log('\n💸 Employees Sorted by Salary ↓:');
      emps.forEach((e, i) => {
        console.log(`${i + 1}. ${e.name} | ₹${e.salary}`);
      });
    })
    .catch(err => console.error('❌ Sort error:', err))
    .finally(showMenu);
}
