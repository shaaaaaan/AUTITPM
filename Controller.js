// Avoid `console` errors in browsers that lack a console.
(function() {
  document.addEventListener("DOMContentLoaded", function() { // equivalent to document on ready

    function HelperFunctions() {
      const fObj = {};

      fObj.getRandomNumBetween = function (min, max){
        // src: https://stackoverflow.com/a/7228322
        return Math.floor(Math.random() * (max - min + 1) + min);
      }

      fObj.shuffleArray = function (array) {
        // src: https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
        for(let i = array.length - 1; i > 0; i--){
          const j = Math.floor(Math.random() * i)
          const temp = array[i]
          array[i] = array[j]
          array[j] = temp
        }
      }

      fObj.generateTasksIds = function (iTaskCount) {
        let iTaskIds = [];
        for (let i=1; i<=iTaskCount; i++) {iTaskIds.push(i);}
        return iTaskIds;
      }

      fObj.generateResources = function (iResourcesSrc) {
        return iResourcesSrc.map(resourcesSrcItem => {
          // resourcesSrcItem = [<name,perf,cost>]
          return createResource(resourcesSrcItem[0],resourcesSrcItem[1],resourcesSrcItem[2]);
        });
      }

      function createResource(name, perf, cost) {
        const resObj = {};
        resObj.name = name;
        resObj.perf = perf;
        resObj.cost = cost;
        resObj.greeting = function() {
          alert('Hi! I\'m ' + resObj.name + '.');
        };
        return resObj;
      }
      return fObj;
    }

    let costDifficultySlider = 1.5;
    let timeDifficultySlider = 1.75;
    let projectBudget = HelperFunctions().getRandomNumBetween(500000, 2000000); // Between 500K and 2 Million
    const taskCount = 5; // minimum of 2 [restriction]
    let taskIds = HelperFunctions().generateTasksIds(taskCount);

    document.getElementById('projectBudget').innerHTML = projectBudget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // resources = [<name,perf,cost>]
    const resourcesSrc = [
      //['James',61,99],['John',73,16],['Robert',15,78],['Michael',46,35],['William',20,16],['David',26,28],['Richard',69,27],['Joseph',80,19],['Thomas',46,92],['Charles',45,95],['Mary',83,70],['Patricia',89,13],['Jennifer',16,11],['Linda',35,27],['Elizabeth',43,15],['Barbara',42,54],['Susan',25,48],['Jessica',37,59],['Sarah',80,30],['Karen',42,22]
      ['James',61,61],['John',73,73],['Robert',15,15],['Michael',46,46],['William',20,20],['David',26,26],['Richard',69,69],['Joseph',80,80],['Thomas',46,46],['Charles',45,45],['Mary',83,83],['Patricia',89,89],['Jennifer',16,16],['Linda',35,35],['Elizabeth',43,43],['Barbara',42,42],['Susan',25,25],['Jessica',37,37],['Sarah',80,80],['Karen',42,42],
    ];
    let resources = HelperFunctions().generateResources(resourcesSrc);
    HelperFunctions().shuffleArray(resources);
    resources = resources.slice(0,taskCount);

    generateResourceDiv(resources, 'resourceListDiv');

    function generateResourceDiv(resourceList, resourceListDivId) {
      let resourceListDiv = document.getElementById(resourceListDivId);
      resourceList.forEach(resource => {
        let name = resource.name;
        let perf = 'slow';
        if (resource.perf > 75) {
          perf = 'very fast';
        } else if (resource.perf > 50) {
          perf = 'fast';
        } else if (resource.perf > 25) {
          perf = 'average speed';
        }
        let cost = 'inexpensive';
        if (resource.cost > 75) {
          cost = 'very expensive';
        } else if (resource.cost > 50) {
          cost = 'expensive';
        } else if (resource.cost > 25) {
          cost = 'average cost';
        }
        let divHolder = '<tr><td class="resourceName">{name}</td><td class="{speed}">{speed}</td><td class="{cost}">{cost}</td></tr>'.replaceAll('{name}', name).replaceAll('{speed}', perf).replaceAll('{cost}', cost);
        resourceListDiv.innerHTML += divHolder;
      });
    }

    // CREATING THE GANTT GRID
    let sampleTaskItems = '';
    taskIds.forEach(taskId => {
      let taskHolder = '<tr>';
      taskHolder += '<td>Task {taskId}</td>'.replaceAll('{taskId}', taskId);
      let cellId = 1;
      for (let weekId=1; weekId<=5; weekId++) {
        //iterating over weeks
        for (let dayId=1; dayId<=7; dayId++) {
          taskHolder += '<td id="task{taskId}cell{cellId}"></td>'.replaceAll('{taskId}', taskId).replaceAll('{cellId}', (cellId++).toString());
        }
      }
      taskHolder += '<td id="task{taskId}cost"></td>'.replaceAll('{taskId}', taskId);
      taskHolder += '<td><select id="task{taskId}resource"></select></td>'.replaceAll('{taskId}', taskId);
      taskHolder += '</tr>';
      document.getElementById('ganttBody').innerHTML += taskHolder;
    })

    let sampleCmbItems = resources.map(resource => '<option value="{name}">{name}</option>'.replaceAll('{name}', resource.name));
    taskIds.forEach(tasksId => {
      document.getElementById('task{id}resource'.replaceAll('{id}', tasksId)).innerHTML = sampleCmbItems;
    });


    // CREATING THE TASKS SETS
    let linearSetTaskDates = [];
    let numberOfLinearTasks = HelperFunctions().getRandomNumBetween(2,taskCount);
    // console.log(numberOfLinearTasks);
    // Linear Set Breakdown
    if (numberOfLinearTasks > 1) {
      let firstTaskOfLinearSet = 1;
      if (numberOfLinearTasks < taskCount ) {
        firstTaskOfLinearSet = HelperFunctions().getRandomNumBetween(1, taskCount - numberOfLinearTasks);
      }
      let startDate = 1;
      let taskSize = Math.floor(35 / numberOfLinearTasks);

      // make task size a bit random to give a bit of randomness to project
      let midTaskSize = taskSize/3;
      taskSize = HelperFunctions().getRandomNumBetween(taskSize-midTaskSize,taskSize+midTaskSize);

      for (let linearTaskIdx=1; linearTaskIdx<=numberOfLinearTasks; linearTaskIdx++) {
        let endDate = linearTaskIdx*taskSize;
        if (linearTaskIdx === numberOfLinearTasks) {
          endDate = 35;
        }
        linearSetTaskDates.push(['linear',startDate,endDate]);
        startDate = endDate+1;
      }
      // console.log('linearSet');
      // console.log(linearSetTaskDates);
    }
    // Parallel Set Breakdown
    let numberOfParallelTasks = taskCount - numberOfLinearTasks;
    // console.log(numberOfParallelTasks);
    let parallelSetTaskDates = [];
    for (let parallelTaskIdx=0; parallelTaskIdx<numberOfParallelTasks; parallelTaskIdx++) {
      let startDate = HelperFunctions().getRandomNumBetween(1, 18); // 7 days * 5 weeks, halfway between (35/2)
      let endDate = HelperFunctions().getRandomNumBetween(startDate, 34);
      parallelSetTaskDates.push(['parallel',startDate,endDate]);
    }
    // console.log('parallelSet');
    // console.log(parallelSetTaskDates);

    let tasksList = linearSetTaskDates.concat(parallelSetTaskDates);
    colorGrid(tasksList);

    function colorGrid(taskList) {
      let projectWorkDays = 0;
      console.log(taskList);
      let taskCounter = 1;
      taskList.forEach(taskItem => {
        let classText = taskItem[0].toString();
        let taskStart = taskItem[1];
        let taskEnd = taskItem[2];
        projectWorkDays += ((taskEnd+1) - taskStart);
        for (let cellIdx=taskStart; cellIdx<=taskEnd; cellIdx++) {
          let cellId =  'task{taskId}cell{cellId}'.replaceAll('{taskId}', taskCounter).replaceAll('{cellId}', cellIdx.toString());
          // console.log(cellId);
          document.getElementById(cellId).classList.add(classText);
        }
        taskCounter++;
      });
      document.getElementById('projectWorkDays').innerHTML = projectWorkDays.toString();
    }


    function processEvent(resourceList,taskList,taskAssignmentList) {
      // CORE PROCESSING
      console.log(resourceList);
      console.log(taskList);
      console.log(taskAssignmentList);

      let workMatrix = [];
      for (i=0;i<35;i++) {
        workMatrix[i] = [];
        for (j=0;j<taskCount;j++) {
          workMatrix[i][j] = {cost: 0, perf: 0};
        }
      }

      console.log(workMatrix);

      let taskCounter = 0;
      let projectWorkDays = 0;
      taskList.forEach(task => {
        let taskStart = task[1];
        let taskEnd = task[2];
        projectWorkDays += ((taskEnd+1) - taskStart);
        for (let i=taskStart-1;i<taskEnd;i++) {
          let resourceNameAssignedToTask = taskAssignmentList[taskCounter];
          let assignedResource = resourceList.filter(resource=> {
            return resource.name === resourceNameAssignedToTask;
          })[0];
          workMatrix[i][taskCounter]['cost'] = assignedResource.cost;
          workMatrix[i][taskCounter]['perf'] = assignedResource.perf;
        }
        taskCounter++;
      });

      let perDayProjectCost = projectBudget / projectWorkDays;
      console.log('perDayProjectCost: ' + perDayProjectCost);
      console.log(workMatrix);
      let simulatedCost = 0; // dollars
      let simulatedTime = 0; // days
      for(let dayIdx=1;dayIdx<=35;dayIdx++) {
        for (let taskIdx=0;taskIdx<taskCount;taskIdx++) {
          simulatedCost += perDayProjectCost * (workMatrix[dayIdx-1][taskIdx].cost*costDifficultySlider/100);
          if (workMatrix[dayIdx-1][taskIdx].perf > 0) {
            simulatedTime += (((workMatrix[dayIdx - 1][taskIdx].perf * timeDifficultySlider) / 100));
            console.log('st:' + simulatedTime + ' | perf:' + workMatrix[dayIdx - 1][taskIdx].perf);
          }
          // simulatedCost +=
          document.getElementById('projectActual').innerHTML = Math.round(simulatedCost, 3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          document.getElementById('projectDays').innerHTML = Math.round(simulatedTime.toString());
        }
      }

      if (simulatedTime < projectWorkDays) {
        document.getElementById('projectDays').classList.add('overTime');
        document.getElementById('projectDays').classList.remove('onTime');
      } else {
        document.getElementById('projectDays').classList.add('onTime');
        document.getElementById('projectDays').classList.remove('overTime');
      }


      if (simulatedCost < projectBudget) {
        document.getElementById('projectActual').classList.add('underBudget');
        document.getElementById('projectActual').classList.remove('overBudget');
      } else {
        document.getElementById('projectActual').classList.add('overBudget');
        document.getElementById('projectActual').classList.remove('underBudget');
      }
    }

    document.getElementById('processBtn').addEventListener('click', function (){
      let taskAssignmentList = [];
      taskIds.forEach(taskId => {
        let taskSelectBox = document.getElementById('task{taskId}resource'.replaceAll('{taskId}', taskId));
        taskAssignmentList.push(taskSelectBox.value);
      });
      processEvent(resources,tasksList,taskAssignmentList);
    });
  });
}());
