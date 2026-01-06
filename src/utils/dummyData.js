export const dummyStudents = [
  {
    id: 'STU20240025',
    name: 'John Smith',
    class: '10-A',
    rollNo: 25,
    attendance: 92,
    overallGrade: 'A-',
    feeStatus: 'paid',
    fatherName: 'Robert Smith',
    contact: 'robert.smith@email.com',
    phone: '+91 9876543210'
  },
  {
    id: 'STU20240001',
    name: 'Rohan Kumar',
    class: '10-A',
    rollNo: 1,
    attendance: 98,
    overallGrade: 'A+',
    feeStatus: 'paid',
    fatherName: 'Rajesh Kumar',
    contact: 'rajesh.kumar@email.com',
    phone: '+91 9876543211'
  },
  {
    id: 'STU20240012',
    name: 'Anjali Singh',
    class: '10-A',
    rollNo: 12,
    attendance: 95,
    overallGrade: 'A',
    feeStatus: 'paid',
    fatherName: 'Vikram Singh',
    contact: 'vikram.singh@email.com',
    phone: '+91 9876543212'
  }
]

export const dummyTeachers = [
  {
    id: 'TCH2020008',
    name: 'Ms. Priya Sharma',
    subject: 'Mathematics',
    experience: '5 years',
    qualification: 'M.Sc Mathematics, B.Ed',
    classes: ['10-A', '10-B', '11-Science', '12-Commerce'],
    salary: 65000
  },
  {
    id: 'TCH2020012',
    name: 'Mr. Raj Patel',
    subject: 'Science',
    experience: '7 years',
    qualification: 'M.Sc Physics, B.Ed',
    classes: ['10-A', '10-B', '11-Science'],
    salary: 68000
  },
  {
    id: 'TCH2020005',
    name: 'Ms. Meera Lee',
    subject: 'English',
    experience: '8 years',
    qualification: 'M.A English, B.Ed',
    classes: ['10-A', '10-B', '11-Science', '12-Commerce'],
    salary: 62000
  }
]

export const dummyAssignments = [
  {
    id: 1,
    title: 'Trigonometry Problems Set',
    subject: 'Mathematics',
    dueDate: '2024-03-16',
    maxMarks: 20,
    status: 'pending',
    assignedTo: ['10-A', '10-B'],
    submitted: 53,
    total: 67
  },
  {
    id: 2,
    title: 'Solar System Model',
    subject: 'Science',
    dueDate: '2024-03-20',
    maxMarks: 50,
    status: 'in-progress',
    assignedTo: ['10-A'],
    submitted: 28,
    total: 35
  },
  {
    id: 3,
    title: 'Essay on Importance of Reading',
    subject: 'English',
    dueDate: '2024-03-13',
    maxMarks: 50,
    status: 'graded',
    assignedTo: ['10-A'],
    submitted: 35,
    total: 35
  }
]

export const dummyFees = [
  {
    component: 'Tuition Fee',
    amount: 45000,
    status: 'paid'
  },
  {
    component: 'Laboratory Charges',
    amount: 8000,
    status: 'paid'
  },
  {
    component: 'Library Fee',
    amount: 2000,
    status: 'paid'
  },
  {
    component: 'Sports Fee',
    amount: 3000,
    status: 'paid'
  },
  {
    component: 'Annual Function',
    amount: 1500,
    status: 'pending'
  },
  {
    component: 'Development Fund',
    amount: 5000,
    status: 'pending'
  }
]