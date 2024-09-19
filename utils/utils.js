import * as fs from 'fs';
import * as os from 'os'; 

const now = new Date();
const time = now.toLocaleTimeString();
const date = now.toLocaleDateString();
const username = os.userInfo().username;
const path = './var/logToFile.json'; //að safna öllum. 

export function ad_safna_ollum_append(virkjaName){

  const _dagur = date; 
  const _tima  = time; 
  const _virkjaName = virkjaName;

  const logFile = {
    dagur  : `"${_dagur}"`,
    tima   : `"${_tima}"`,
    virkja : `"${_virkjaName}"` 
  };

  fs.readFile(path, 'utf-8', (err, data) => {
    if(err) {
      console.error('Error reading json file:', err); 
      return res.status(500).send('Error reading json file');
    }

    const jsonDATA = JSON.parse(data); 
    jsonDATA.users.push(logFile); 

    fs.writeFile(path, JSON.stringify(jsonDATA, null, 2), (err) => {
      if(err) {
        console.error('Error writing to JSON file:', err);
        return res.status(500).send('Error writing to JSON file');
      }
    });
  });
}

export function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}
