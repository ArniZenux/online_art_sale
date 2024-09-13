import * as fs from 'fs';
import * as os from 'os'; 

const now = new Date();
const time = now.toLocaleTimeString();
const date = now.toLocaleDateString();

// Get the current user's name
const username = os.userInfo().username;

const path = './var/logToFile.json'; //að safna öllum. 

export function ad_safna_ollum_append(functionName){
  const logLine = `Date: ${date}, Time: ${time}, User: ${username}, Function: ${functionName}\n`;
  
  fs.appendFile(path, logLine, (error) => {
    if (error) {
      console.log('An error has occurred ', error);
      return;
    }
    console.log('Data written successfully to disk');
  }); 
}

export function catchErrors(fn) {
    return (req, res, next) => fn(req, res, next).catch(next);
  }
  
  

/*function ad_safna_ollum(){
  const config = { ip: '192.0.2.1', port: 3000 };
  
  fs.writeFile(path, JSON.stringify(config, null, 2), (error) => {
    if (error) {
      console.log('An error has occurred ', error);
      return;
    }
    console.log('Data written successfully to disk');
  }); 
}

function ad_safna_ollum_append(functionName){
  const config = { ip: '192.0.2.1', port: 3000 };
  const logLine = `Date: ${date}, Time: ${time}, User: ${username}, Function: ${functionName}\n`;
  
  fs.appendFile(path, logLine, (error) => {
    if (error) {
      console.log('An error has occurred ', error);
      return;
    }
    console.log('Data written successfully to disk');
  }); 
}*/