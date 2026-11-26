// HTTP LAYER: endpoints, request logging, error handling, and starting the server.

const express = require('express');
const logger = require('./logger');
const service = require('./service');

const app = express();

// Log every request when it finishes: "POST /api/items -> 201 (3 ms)"
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - start} ms)`);
  });
  next();
});

var x = {
"emp-101": { "name": "Asha", "daysLeft": 5 },
"emp-102": { "name": "Ravi", "daysLeft": 1 }
}
function validEmp(empid){
			if(x.contains(empid) return true;
return false;
		}
// Turn the JSON body into a JS object: req.body
app.use(express.json());

// ---------------- ENDPOINTS ----------------

// Sample POST: reads a JSON body, returns JSON
app.post('/api/items', (req, res) => {
  logger.info('Create item request', { body: req.body });
  const item = service.createItem(req.body);
  res.status(201).json(item);
});

app.get('/api/items/:id', (req, res) => {
  const item = service.getItem(req.params.id);
  res.status(200).json(item);
});

app.get('/api/items', (req, res) => {
  res.status(200).json(service.getAllItems());
});
var days,empid;
if(typeOf(days)!=INTEGER)  console.log(days);
car Status;
app.post('api/leaves',(req,res))-=>{
	days = service.getItem(req.params.days)
	empid = service.getItem(req.params.id)
	if(!validEmp(empid)){
		return "error": "404", "message": "Employee does not exist"		}
	if(days<1){
		return "error": "401", "message": "Enter Valid Leave days"
		}
	Status = "PENDING";

	return "success" : "200" , "message": "PENDING"

}

app.post('api/leaves/{leaveid}/approve' (req,res))=>{
		var y = x.empid.daysLeft
		if(Status=="Approved") return "leaveId": "req.params.id", "status": "REJECT", "daysLeft": "y"
		if(y <days){  return "leaveId": "req.params.id", "status": "REJECTED", "daysLeft": 0" }
		y = y-days;
		if(y<0) return "leaveId": "request.params.id", "status": "REJECTED", "daysLeft": "y"

		return "leaveId": "request.params.id", "status": "APPROVED", "daysLeft": y"
		
		
	}

// ---------------- ERRORS ----------------

// No endpoint matched -> 404
app.use((req, res) => {
  res.status(404).json({ error: `No endpoint ${req.method} ${req.originalUrl}` });
});

// Anything thrown above ends up here (Express needs all 4 arguments to know this is the error handler)
app.use((err, req, res, next) => {
  // Our own errors from service.js (400 / 404 / 409)
  if (err instanceof service.AppError) {
    logger.warn(err.message, { status: err.status, details: err.details });
    return res.status(err.status).json({ error: err.message, details: err.details });
  }

  // Broken JSON in the request body
  if (err.type === 'entity.parse.failed') {
    logger.warn('Invalid JSON body');
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  // Anything else is a bug: log it fully, send a safe message
  logger.error('Unexpected error', { message: err.message, stack: err.stack });
  res.status(500).json({ error: 'Something went wrong' });
});

// ---------------- START ----------------

const PORT = 3000;
app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
