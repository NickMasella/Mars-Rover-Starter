const Message = require('./message.js');
const Command = require('./command.js');

class Rover {
   constructor(position, mode = 'NORMAL', generatorWatts = 110) {
      this.position = position;
      this.mode = mode;
      this.generatorWatts = generatorWatts;
    }

    receiveMessage(message) {
      let results = [];
      //first loop iterates through the commands array to check if MODE_CHANGE is a property in any of the objects and executes if so
      // for (let i = 0; i < message.commands.length; i++){ 
      //    if ((message.commands)[i].commandType === 'MODE_CHANGE'){
      //       if ((message.commands)[i].value === 'LOW_POWER' || (message.commands)[i].value === 'NORMAL'){
      //          this.mode = (message.commands)[i].value;
      //       }
      //       // if (this.mode === 'NORMAL'){
      //       //    this.mode = 'LOW_POWER';
      //       // }  else if (this.mode === 'LOW_POWER'){
      //       //    this.mode = 'NORMAL';
      //       // }
      //       results[i] = ({completed: true})
      //    }
      // }
      // second loop iterates through the commands array to check objects for STATUS_CHECK and MOVE property values and executes them if so.
      // nevermind did all that work for no reason
      for (let i = 0; i < message.commands.length; i++){
         if ((message.commands)[i].commandType === 'STATUS_CHECK'){
            results[i] = ({
               completed: true,
               roverStatus: { mode: this.mode, generatorWatts: this.generatorWatts, position: this.position }
            })
         }
         if ((message.commands)[i].commandType === 'MODE_CHANGE'){
            if ((message.commands)[i].value === 'LOW_POWER' || (message.commands)[i].value === 'NORMAL'){
               this.mode = (message.commands)[i].value;
            }
            // if (this.mode === 'NORMAL'){
            //    this.mode = 'LOW_POWER';
            // }  else if (this.mode === 'LOW_POWER'){
            //    this.mode = 'NORMAL';
            // }
            results[i] = ({completed: true})
         }
         if ((message.commands)[i].commandType === 'MOVE'){
            if (this.mode === 'LOW_POWER'){
               results[i] = ({completed: false})
            } else {
               this.position = (message.commands)[i].value;
               results[i] = ({completed: true})
            }
         }
      }
      return {
         message: message.name,
         results: results
      } 
   }
}


// let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK'), new Command('MOVE')];
// let message = new Message('Test message with two commands', commands);
// let rover = new Rover(98382);    // Passes 98382 as the rover's position.
// let response = rover.receiveMessage(message);

// console.log(response);

module.exports = Rover;