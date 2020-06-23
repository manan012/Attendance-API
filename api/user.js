const express = require('express');

const router = express.Router();

const sign = require('../controllers/users');
const task = require('../controllers/task');
const attendance = require('../controllers/attendance');
const moduler = require('../controllers/module');
const project = require('../controllers/projects');
//const kanban = require('../controllers/kanban');
const leave = require('../controllers/leave');
const editDetail = require('../controllers/editDetail');

// const kanban = require('../controllers/kanban/kanban')
const checkTask = require('../controllers/checkTask');
const userAuth = require('../middleware/userAuth');
const bucket = require('../controllers/kanban/buckets');
const tasks = require('../controllers/kanban/task');

router.post('/register', userAuth, sign.register);
router.post('/login', sign.login);
router.post('/attendance', userAuth, attendance.markAttendance);
router.put('/reset', sign.reset);
router.put('/edit/:employeeId', userAuth, sign.editUser);
router.delete('/delete/:userId', userAuth, sign.deleteUser);
router.get('/user/all', userAuth, sign.getAllUser);
router.get('/user', userAuth, sign.getDetails);
router.get('/user/:userId', userAuth, sign.getUser);


router.get('/attendance/all', userAuth, attendance.getAllAttendance);
router.get('/attendance/:userId', userAuth, attendance.getAttendanceById);

router.post('/task', userAuth, task.generateTask);
router.put('/task/:taskId', userAuth, task.editTask);
router.delete('/task/:taskId', userAuth, task.deleteTask);
router.get('/task', userAuth, task.getTask);

router.post('/module', userAuth, moduler.createModule);
router.put('/module/:moduleId', userAuth, moduler.editModule);
router.delete('/module/:moduleId', userAuth, moduler.deleteModule);
router.get('/task/:moduleId', userAuth, moduler.getTasks);
router.get('/modules', userAuth, moduler.getModule);

// Add project
router.post('/project', userAuth, project.createProject);
router.put('/project/:projectId', userAuth, project.editProject);
router.delete('/project/:projectId', userAuth, project.deleteProject);
router.get('/project/all', userAuth, project.getAllProject);
router.get('/projects/:employeeId', userAuth, project.getProjectsAdmin);


router.get('/project/:projectId', userAuth, project.getProject);
router.get('/module/:projectId', userAuth, project.getModules);


// router.post('/board', userAuth, kanban.createKanban);
// router.put('/board/:boardId', userAuth, kanban.editKanban);
// router.delete('/board/:boardId', userAuth, kanban.deleteKanban);
// router.get('/board', userAuth, kanban.getKanban);

router.post('/leave', userAuth, leave.addRecord);
router.get('/leave/all', userAuth, leave.getRecord);
router.get('/leave/pending', userAuth, leave.getMyRecord_pending);
router.get('/leave/approved', userAuth, leave.getMyRecord_approved);
router.get('/leave/rejected', userAuth, leave.getMyRecord_rejected);
router.put('/leave/:leaveId', userAuth, leave.editRecord);

router.post('/editdetail', userAuth, editDetail.addRecord);
router.put('/editdetail/:detailId', userAuth, editDetail.editDetails);
router.get('/editdetail', userAuth, editDetail.getRecord);

//Added by Siddeshwar 
// router.get('/tasks', userAuth, kanban.getAllTasks)
// router.post('/tasks/save', userAuth, kanban.saveTask)
// router.get('/buckets', userAuth, kanban.getAllBuckets)
// router.post('/buckets/save', userAuth, kanban.saveBucket)
// router.post('/files', userAuth, kanban.uploadFiles, kanban.saveFiles)

router.post('/checktask', userAuth, checkTask.addTask);
router.get('/checktask', userAuth, checkTask.getMyTask);
router.get('/checktask/all', userAuth, checkTask.getAllTask);

router.post('/bucket/add', userAuth, bucket.addBucket);
router.post('bucket/save', userAuth, bucket.saveBucket);
router.get('/bucket/:projectId', userAuth, bucket.getBucket);
router.delete('/bucket/delete', userAuth, bucket.deleteBucket);
router.put('/bucket/edit', userAuth, bucket.editBucket);
router.put('/bucket/bucketswap', userAuth, bucket.bucketSwap);

router.post('/tasks/add', userAuth, tasks.addTask);
router.get('/tasks/:projectId', userAuth, tasks.getTask);
router.put('/tasks/edit', userAuth, tasks.editTask);
router.delete('/tasks/delete', userAuth, tasks.deleteTask);
router.put('/tasks/taskswap', userAuth, tasks.taskSwap);

module.exports = router;