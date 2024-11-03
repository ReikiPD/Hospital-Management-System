// index.js
const express = require("express");
const port = 8523;
const app = express();
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");

const bodyParser = require("body-parser");

const eventsRepo = require("./repositories/test");
const adminController = require("./controller/admin"); 
const doctorController = require("./controller/doctor");
const patientController = require("./controller/patient");
const medicalRecordsController = require("./controller/medicalrecords");
const appointmentController = require("./controller/appoinment");
const billController = require("./controller/bill");
const medicinePrescriptionController = require("./controller/medicinePrescription"); // Import controller
const signupController = require("./controller/signup");
const usersController = require("./controller/users");
const loginHistoryController = require("./controller/login");
const testResultController = require("./controller/testResult");

app.use(bodyParser.json());

app.post('/test', eventsRepo.testInput);

// Routes for admin
app.post('/admin', adminController.createAdmin);
app.get('/admin/:admin_id', adminController.getAdminById);
app.get('/admin', adminController.getAllAdmin);
app.put('/admin/:admin_id', adminController.updateAdminById);
app.delete('/admin/:admin_id', adminController.deleteAdminById);

// Routes for doctor
app.post('/doctor', doctorController.createDoctor);
app.get('/doctor', doctorController.getAllDoctors);
app.get('/doctor/:doctor_id', doctorController.getDoctorById);
app.put('/doctor/:doctor_id', doctorController.updateDoctorById);
app.delete('/doctor/:doctor_id', doctorController.deleteDoctorById);

// Routes for patient
app.post('/patient', patientController.createPatient);
app.get('/patient', patientController.getAllPatient);
app.get('/patient/:patient_id', patientController.getPatientById);
app.put('/patient/:patient_id', patientController.updatePatientById);
app.delete('/patient/:patient_id', patientController.deletePatientById);

// Routes for medical records
app.post('/medicalrecords', medicalRecordsController.createMedicalRecord);
app.get('/medicalrecords', medicalRecordsController.getAllMedicalRecords);
app.get('/medicalrecords/:record_id', medicalRecordsController.getMedicalRecordById);
app.put('/medicalrecords/:record_id', medicalRecordsController.updateMedicalRecordById);
app.delete('/medicalrecords/:record_id', medicalRecordsController.deleteMedicalRecordById);

// Routes for appointment
app.post('/appointment', appointmentController.createAppointment);
app.get('/appointment', appointmentController.getAllAppointments);
app.get('/appointment/:appointment_id', appointmentController.getAppointmentById);
app.put('/appointment/:appointment_id', appointmentController.updateAppointmentById);
app.delete('/appointment/:appointment_id', appointmentController.deleteAppointmentById);

// Routes for bill
app.post('/bill', billController.createBill);
app.get('/bill', billController.getAllBills);
app.get('/bill/:bill_id', billController.getBillById);
app.put('/bill/:bill_id', billController.updateBillById);
app.delete('/bill/:bill_id', billController.deleteBillById);

// Routes for medicine prescription
app.post('/medicinePrescription', medicinePrescriptionController.createMedicinePrescription);
app.get('/medicinePrescription', medicinePrescriptionController.getAllMedicinePrescriptions);
app.get('/medicinePrescription/:record_id/:medicine_id', medicinePrescriptionController.getMedicinePrescription);
app.put('/medicinePrescription/:record_id/:medicine_id', medicinePrescriptionController.updateMedicinePrescription);
app.delete('/medicinePrescription/:record_id/:medicine_id', medicinePrescriptionController.deleteMedicinePrescription);

// Routes for signup
app.post('/signup', signupController.signupUser);
app.post('/signupAdmin', signupController.signupAdmin);

// Routes for users
app.post('/users', usersController.createUser);            // Create user with role 'user'
app.post('/admins', usersController.createAdmin);          // Create user with role 'admin'
app.get('/users', usersController.getAllUsers);            // Get all users
app.get('/users/:user_id', usersController.getUserById);   // Get user by ID
app.put('/users/:user_id', usersController.updateUserById);// Update user by ID
app.delete('/users/:user_id', usersController.deleteUserById); // Delete user by ID

//Route for login
app.post('/login-history', loginHistoryController.createLoginRecord);
app.get('/login-history', loginHistoryController.getAllLoginRecords);
app.get('/login-history/:login_id', loginHistoryController.getLoginRecordById);
app.put('/login-history/:login_id', loginHistoryController.updateLoginRecord);
app.delete('/login-history/:login_id', loginHistoryController.deleteLoginRecord);
app.put('/logout/:login_id', loginHistoryController.logout);

//Route for test results
app.post('/testResult', testResultController.createTestResult);
app.get('/testResult', testResultController.getAllTestResults);       // Route to get all test results
app.get('/testResult/:test_id', testResultController.getTestResultById);
app.put('/testResult/:test_id', testResultController.updateTestResultById);
app.delete('/testResult/:test_id', testResultController.deleteTestResultById);

// Routes for doctor availability
app.post('/doctor/availability', doctorController.createAvailability);
app.get('/doctor/availability', doctorController.getAllAvailabilities);
app.get('/doctor/:doctor_id/availability', doctorController.getAvailabilityByDoctorId);
app.put('/doctor/availability/:availability_id', doctorController.updateAvailabilityById);
app.delete('/doctor/availability/:availability_id', doctorController.deleteAvailabilityById);

app.listen(port, () => {
  console.log("Server is running and listening on port", port);
});
