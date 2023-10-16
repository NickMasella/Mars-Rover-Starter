const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe('Rover class', function() {
  //declared variables for testing purposes
  let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
  let normalModeCommand = [new Command('MODE_CHANGE', 'NORMAL')];
  let normalMode = new Message('Mode change test', normalModeCommand);
  let moveCommand = [new Command('MOVE', 420)];
  let moveMessage = new Message('Move command test', moveCommand);
  let message = new Message('Test message with two commands', commands);
  let rover = new Rover(98382);
  
  let response = rover.receiveMessage(message);
  // let modeChangeMessage = new Message('Mode change test', [new Command('MODE_CHANGE', 'LOW_POWER')]);
  // let modeChangeTest = rover.receiveMessage(modeChangeMessage);

  test('constructor sets position and default values for mode and generatorWatts', function() {
    expect((new Rover(1)).position).toBe(1);
    expect((new Rover(1)).mode).toBe('NORMAL');
    expect((new Rover(1)).generatorWatts).toBe(110);
  });

  test('response returned by receiveMessage contains the name of the message', function() {
    expect(response.message).toContain(message.name); 
  });

  test('response returned by receiveMessage includes two results if two commands are sent in the message', function() {
    expect(response.results.length).toBe(2);
  });

// 1 is the index of the STATUS_CHECK command within the commands array
  test('responds correctly to the status check command', function() {
    expect((response.results)[1].completed).toBe(true);
    expect((response.results)[1].roverStatus.mode).toBe('LOW_POWER');
    expect((response.results)[1].roverStatus.generatorWatts).toBe(110);
    expect((response.results)[1].roverStatus.position).toBe(98382);
  });

// 0 is the index of the MODE_CHANGE command within the commands array
  test('responds correctly to the mode change command', function() {
    expect((response.results)[0].completed).toBe(true);
    expect(new Rover(0).mode).toBe('NORMAL');
    expect(rover.mode).toBe('LOW_POWER');
    rover.receiveMessage(normalMode);
    expect(rover.mode).toBe('NORMAL');
  });

  test('responds with a false completed value when attempting to move in LOW_POWER mode', function() {
    rover.receiveMessage(message); // sets rover to low power mode   
    expect((rover.receiveMessage(moveMessage).results)[0].completed).toBe(false);
  });

  test('responds with the position for the move command', function() {
    rover.receiveMessage(normalMode); // sets rover to normal mode   
    expect((rover.receiveMessage(moveMessage).results)[0].completed).toBe(true);
    rover.receiveMessage(moveMessage); // attempts to move rover
    expect(rover.position).toBe(420);
  });

});
